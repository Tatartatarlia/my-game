import { useCallback, useEffect, useMemo, useState } from 'react';

import { storyGraph } from '../data/story';
import useStorage from './useStorage';

const INITIAL_MODE = 'main';

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// 目前先做最小可用版本：
// - 支持 dialogue / narration：点击推进 nextId；目标节点可带 affectionDelta（进入该节点时加减好感）
// - 支持 choice：渲染 choices，点击选项后跳到 nextId 并应用选项上的 affectionDelta（如有）
// - 暂不处理失败回滚/存档（后面再加）
export default function useGame() {
  const [mode, setMode] = useState(INITIAL_MODE); // main | story | failed | cleared | archive
  /** 仅当从「查看存档」回到主菜单时为 true，供 StartScreen 决定是否沿用正在播的开始界面 BGM（其它入口应重新随机） */
  const [mainEntryFromArchive, setMainEntryFromArchive] = useState(false);
  const [nodeId, setNodeId] = useState(null);
  const [checkpoint, setCheckpoint] = useState(null);
  const [history, setHistory] = useState([]);

  // 好感度：目前只做 tartaglia
  const [affection, setAffection] = useState({ tartaglia: 0 });
  const [affectionMeta, setAffectionMeta] = useState({
    tartaglia: { max: 5, failThreshold: 0 },
  });

  // 剧情播放初始化：从 storyGraph 里找起点
  const { saveGame, loadGame } = useStorage();

  const applySavedState = useCallback(
    (saved) => {
      if (!saved) return false;
      if (!saved.nodeId) return false;

      setNodeId(saved.nodeId);
      setAffection(saved.affection ?? { tartaglia: 0 });
      setAffectionMeta(
        saved.affectionMeta ?? {
          tartaglia: { max: 5, failThreshold: 0 },
        },
      );
      setHistory(Array.isArray(saved.history) ? saved.history : []);
      setCheckpoint(saved.checkpoint ?? null);
      return true;
    },
    [],
  );

  const startGame = useCallback(() => {
    setMainEntryFromArchive(false);
    const saved = loadGame();
    const ok = applySavedState(saved);
    if (ok) {
      const clearedNode = saved.nodeId ? storyGraph[saved.nodeId] : null;
      if (clearedNode?.type === 'game_clear') {
        setMode('cleared');
        return;
      }
      setMode('story');
      return;
    }

    setMode('story');
    setNodeId('chapter1_intro_1');
    setCheckpoint(null);
    setHistory(['chapter1_intro_1']);
    setAffection({ tartaglia: 1 }); // 由数据层 chapter1_meet_1 初始化前，这里先给一个默认起点
    setAffectionMeta({
      tartaglia: { max: 5, failThreshold: 0 },
    });
  }, [applySavedState, loadGame]);

  const currentNode = useMemo(() => {
    if (!nodeId) return null;
    return storyGraph[nodeId] || null;
  }, [nodeId]);

  /** 任意节点（对白/旁白/选项目标等）上可写 affectionDelta，进入该节点时生效 */
  const applyNodeAffectionDeltaIfAny = useCallback((nextNode) => {
    const delta = nextNode?.affectionDelta?.tartaglia;
    if (delta == null) return;
    setAffection((prev) => ({
      ...prev,
      tartaglia: clamp(
        prev.tartaglia + delta,
        0,
        affectionMeta.tartaglia?.max ?? 5,
      ),
    }));
  }, [affectionMeta.tartaglia?.max]);

  const advance = useCallback(() => {
    if (!currentNode) return;
    const nextId = currentNode.nextId;
    if (!nextId) return;

    const nextNode = storyGraph[nextId];
    const init = nextNode?.affectionInit?.tartaglia;
    if (init) {
      setAffectionMeta((prev) => ({
        ...prev,
        tartaglia: {
          max: init.max ?? prev.tartaglia.max,
          failThreshold: init.failThreshold ?? prev.tartaglia.failThreshold,
        },
      }));
      setAffection((prev) => ({
        ...prev,
        tartaglia: clamp(init.value ?? prev.tartaglia, 0, init.max ?? 5),
      }));
    }

    applyNodeAffectionDeltaIfAny(nextNode);

    setNodeId(nextId);
    setHistory((prev) => [...prev, nextId]);
    if (nextNode.type === 'game_clear') {
      setMode('cleared');
    }
  }, [applyNodeAffectionDeltaIfAny, currentNode]);

  const rebuildAffectionFromHistory = useCallback((historyIds) => {
    // 复原规则需与 choose/advance 的实际顺序保持一致：
    // - 从初始好感度开始
    // - 遇到上一个节点是 choice 时：先应用选项上的 affectionDelta
    // - 再检查目标节点 affectionInit（覆盖）
    // - 再应用目标节点上的 affectionDelta（加减）
    let nextAffection = { tartaglia: 1 };
    let nextMeta = { tartaglia: { max: 5, failThreshold: 0 } };

    const maxOf = () => nextMeta.tartaglia?.max ?? 5;

    for (let i = 1; i < historyIds.length; i++) {
      const prevId = historyIds[i - 1];
      const nextId = historyIds[i];

      const prevNode = storyGraph[prevId];
      const nextNode = storyGraph[nextId];
      if (!nextNode) continue;

      // choice -> nextId：先应用 affectionDelta
      if (prevNode?.type === 'choice') {
        const matchedChoice = prevNode.choices?.find((c) => c.nextId === nextId);
        const delta = matchedChoice?.affectionDelta?.tartaglia;
        if (delta != null) {
          nextAffection = {
            ...nextAffection,
            tartaglia: clamp(nextAffection.tartaglia + delta, 0, maxOf()),
          };
        }
      }

      // nextNode 覆盖：affectionInit 覆盖之前的值
      const init = nextNode?.affectionInit?.tartaglia;
      if (init) {
        nextMeta = {
          ...nextMeta,
          tartaglia: {
            max: init.max ?? nextMeta.tartaglia.max,
            failThreshold: init.failThreshold ?? nextMeta.tartaglia.failThreshold,
          },
        };
        nextAffection = {
          ...nextAffection,
          tartaglia: clamp(init.value ?? nextAffection.tartaglia, 0, init.max ?? maxOf()),
        };
      }

      const nodeDelta = nextNode?.affectionDelta?.tartaglia;
      if (nodeDelta != null) {
        nextAffection = {
          ...nextAffection,
          tartaglia: clamp(nextAffection.tartaglia + nodeDelta, 0, maxOf()),
        };
      }
    }

    return { affection: nextAffection, affectionMeta: nextMeta };
  }, []);

  const applyAffectionInitIfAny = useCallback((nextNode) => {
    const init = nextNode?.affectionInit?.tartaglia;
    if (!init) return;

    setAffectionMeta((prev) => ({
      ...prev,
      tartaglia: {
        max: init.max ?? prev.tartaglia.max,
        failThreshold: init.failThreshold ?? prev.tartaglia.failThreshold,
      },
    }));
    setAffection((prev) => ({
      ...prev,
      tartaglia: clamp(init.value ?? prev.tartaglia, 0, init.max ?? 5),
    }));
  }, []);

  const evaluateFailForChoice = useCallback((choice, nextNode, nextAffection) => {
    // 1) data 层直接写了 failOnChoose：最优先
    if (choice?.failOnChoose) return true;

    // 2) choice.failCondition：函数式阈值
    const failCondition = choice?.failCondition;
    if (failCondition && typeof failCondition === 'object') {
      for (const [k, fn] of Object.entries(failCondition)) {
        if (typeof fn === 'function') {
          const value = nextAffection?.[k];
          if (fn(value)) return true;
        }
      }
    }

    // 3) 下一个节点本身是失败类型：failType + failAffection 阈值
    if (nextNode?.failType === 'affection' && nextNode?.failAffection) {
      for (const [k, threshold] of Object.entries(nextNode.failAffection)) {
        const value = nextAffection?.[k];
        if (value <= threshold) return true;
      }
    }

    return false;
  }, []);

  const choose = useCallback(
    (choiceId) => {
      if (!currentNode || currentNode.type !== 'choice') return;
      const choice = currentNode.choices?.find((c) => c.id === choiceId);
      if (!choice) return;

      const nextNode = choice.nextId ? storyGraph[choice.nextId] : null;
      if (choice.nextId && !nextNode) {
        console.warn(
          '[useGame] 选项 nextId 在 storyGraph 中不存在，请检查剧情数据：',
          choice.nextId,
        );
        return;
      }

      // checkpoint：保存“选择发生前”的状态（回滚用）
      // 注意：只需要回到 choice 页面 + 恢复好感度即可满足当前需求。
      setCheckpoint({
        choiceNodeId: currentNode.id,
        affectionSnapshot: { ...affection },
        historySnapshot: [...history],
      });

      const delta = choice.affectionDelta?.tartaglia ?? 0;
      const currentMax = affectionMeta.tartaglia?.max ?? 5;
      const nextAffectionValue = clamp(affection.tartaglia + delta, 0, currentMax);
      const nextAffection = { ...affection, tartaglia: nextAffectionValue };

      // 应用好感度变化（如果有 affectionDelta）
      if (choice.affectionDelta?.tartaglia != null) {
        setAffection(nextAffection);
      }

      // 选项跳转
      if (choice.nextId && nextNode) {
        // 先评估失败：基于“应用完 delta 后”的好感度
        const shouldFail = evaluateFailForChoice(choice, nextNode, nextAffection);

        // 更新 affectionInit（如果走到 chapter1_meet_1 之类会初始化好感度）
        applyAffectionInitIfAny(nextNode);
        applyNodeAffectionDeltaIfAny(nextNode);

        if (shouldFail) {
          setMode('failed');
          setNodeId(choice.nextId);
        } else if (nextNode.type === 'game_clear') {
          setMode('cleared');
          setNodeId(choice.nextId);
        } else {
          setMode('story');
          setNodeId(choice.nextId);
        }
        setHistory((prev) => [...prev, choice.nextId]);
      }
    },
    [
      applyAffectionInitIfAny,
      applyNodeAffectionDeltaIfAny,
      affection,
      affectionMeta.tartaglia?.max,
      currentNode,
      evaluateFailForChoice,
      history,
    ],
  );

  const retryFromCheckpoint = useCallback(() => {
    if (!checkpoint) return;
    setMode('story');
    setNodeId(checkpoint.choiceNodeId);
    setAffection(checkpoint.affectionSnapshot);
    setHistory(checkpoint.historySnapshot);
    setCheckpoint(null);
  }, [checkpoint]);

  const rollbackToNode = useCallback(
    (targetNodeId) => {
      if (!targetNodeId) return;
      const idx = history.indexOf(targetNodeId);
      if (idx < 0) return;

      const nextHistory = history.slice(0, idx + 1);
      const rebuilt = rebuildAffectionFromHistory(nextHistory);

      setCheckpoint(null);
      setHistory(nextHistory);
      setNodeId(targetNodeId);
      setAffection(rebuilt.affection);
      setAffectionMeta(rebuilt.affectionMeta);
      setMode('story');
    },
    [history, rebuildAffectionFromHistory],
  );

  const stopGameToMain = useCallback(() => {
    setMainEntryFromArchive(false);
    setMode('main');
    setCheckpoint(null);
  }, []);

  const enterArchive = useCallback(() => {
    // 尽量从 localStorage 恢复（防止你刷新后内存丢失）
    const saved = loadGame();
    applySavedState(saved);
    setMode('archive');
  }, [applySavedState, loadGame]);

  const exitArchive = useCallback(() => {
    setMainEntryFromArchive(true);
    setMode('main');
  }, []);

  // 清除「从存档回主菜单」标记：用 setTimeout(0) 以便 React StrictMode 下连续两次挂载都能读到 true（见 StartScreen useLayoutEffect）
  useEffect(() => {
    if (mode !== 'main' || !mainEntryFromArchive) return undefined;
    const id = window.setTimeout(() => setMainEntryFromArchive(false), 0);
    return () => window.clearTimeout(id);
  }, [mode, mainEntryFromArchive]);

  // 自动保存：剧情 / 失败 / 通关界面也写入（便于读档回到通关页）
  useEffect(() => {
    if (mode !== 'story' && mode !== 'failed' && mode !== 'cleared') return;
    if (!nodeId) return;
    saveGame({
      nodeId,
      affection,
      affectionMeta,
      history,
      checkpoint,
    });
  }, [checkpoint, affection, affectionMeta, history, mode, nodeId, saveGame]);

  const value = {
    mode,
    mainEntryFromArchive,
    nodeId,
    currentNode,
    affection,
    affectionMeta,
    history,
    checkpoint,
    startGame,
    advance,
    choose,
    retryFromCheckpoint,
    rollbackToNode,
    stopGameToMain,
    enterArchive,
    exitArchive,
  };

  return value;
}
