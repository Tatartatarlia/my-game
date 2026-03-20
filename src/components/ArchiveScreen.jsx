/**
 * ArchiveScreen（存档页）
 * - 展示“唯一存档”的内容：已经经过的对话/节点历史（history）
 * - 支持你当前需求：
 *   - 退出剧情后回到主界面
 *   - 点击“查看存档”进入此页
 *   - 重新选择分支后，存档页会随同一个唯一存档被覆盖而展示新历史
 *
 * 通常由主界面（或 GameScreen 的上层）切换 mode 并把 GameState 传入。
 */

import { useMemo } from 'react';

import { useAudio } from '../context/AudioContext';
import { useGameContext } from '../context/GameContext';
import { storyGraph } from '../data/story';

function getSpeakerLabel(node) {
  if (!node) return '';
  if (node.speakerName) return node.speakerName;
  const speaker = node.speaker;
  if (speaker === 'traveler') return '旅行者';
  if (speaker === 'paimon') return '派蒙';
  if (speaker === 'tartaglia') return '达达利亚';
  if (speaker === 'narration' || speaker === 'narrator') return '旁白';
  if (speaker === 'fatui_soldier') return '愚人众士兵';
  return speaker ?? '旁白';
}

export default function ArchiveScreen() {
  const { history, exitArchive, startGame, rollbackToNode } = useGameContext();
  const { defaultSeUrl, playSe } = useAudio();

  const lines = useMemo(() => {
    return (history ?? [])
      .map((id) => storyGraph[id])
      .filter(Boolean)
      .map((node) => ({
        speaker: getSpeakerLabel(node),
        text: node.text ?? '',
      }));
  }, [history]);

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.65))',
        position: 'relative',
        overflow: 'hidden',
        padding: 18,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <button
          onClick={() => {
            if (defaultSeUrl) playSe(defaultSeUrl);
            exitArchive();
          }}
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 800,
          }}
        >
          返回主界面
        </button>
        <button
          onClick={() => {
            if (defaultSeUrl) playSe(defaultSeUrl);
            startGame();
          }}
          style={{
            padding: '10px 14px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 800,
          }}
        >
          继续剧情
        </button>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 980,
          margin: '0 auto',
          borderRadius: 18,
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.06)',
          padding: 16,
          boxSizing: 'border-box',
          color: '#fff',
          textAlign: 'left',
        }}
      >
        <div style={{ fontWeight: 1000, fontSize: 20, marginBottom: 12 }}>对话记录（唯一存档）</div>

        {lines.length === 0 ? (
          <div style={{ opacity: 0.8 }}>暂无存档内容，请先开始游戏。</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {lines.map((l, idx) => {
              const nodeId = history[idx];
              return (
                <div
                  key={idx}
                  style={{
                    borderRadius: 14,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.04)',
                    padding: 12,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                    <div style={{ fontWeight: 1000, opacity: 0.95 }}>{l.speaker}</div>
                    <button
                      onClick={() => {
                        if (defaultSeUrl) playSe(defaultSeUrl);
                        rollbackToNode?.(nodeId);
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 10,
                        border: '1px solid rgba(255,255,255,0.18)',
                        background: 'rgba(255,255,255,0.08)',
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: 900,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      回退到这里
                    </button>
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, opacity: 0.95 }}>{l.text}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

