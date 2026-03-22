import { useEffect, useMemo, useState } from 'react';

import { useAudio } from '../context/AudioContext';
import { useGameContext } from '../context/GameContext';
import ChoiceList from './ChoiceList';
import DialogBox from './DialogBox';

const portraitModules = import.meta.glob('../assets/images/*', {
  eager: true,
  import: 'default',
});

function pickPortraitUrlByFilenameIncludes(modules, includes) {
  const entries = Object.entries(modules);
  for (const [path, url] of entries) {
    const filename = path.split('/').pop() || path;
    if (includes.some((inc) => filename.includes(inc))) return url;
  }
  return null;
}

const portraitUrls = {
  traveler: pickPortraitUrlByFilenameIncludes(portraitModules, ['旅行者']),
  paimon: pickPortraitUrlByFilenameIncludes(portraitModules, ['派蒙']),
  tartaglia: pickPortraitUrlByFilenameIncludes(portraitModules, ['达达利亚', '达达']),
  // 其它角色后续可以继续补
};

function getSpeakerKey(speaker) {
  if (!speaker) return null;
  if (speaker === 'traveler') return 'traveler';
  if (speaker === 'paimon') return 'paimon';
  if (speaker === 'tartaglia' || speaker === 'ajax') return 'tartaglia';
  return null;
}

export default function GameScreen() {
  const { currentNode, affection, affectionMeta, advance, choose, stopGameToMain } = useGameContext();
  const { playStoryBgmForNode, stopBgm } = useAudio();

  const node = currentNode;

  useEffect(() => {
    if (!node?.id) return;
    playStoryBgmForNode(node.id);
  }, [node?.id, playStoryBgmForNode]);

  // 离开剧情回到主菜单/存档等时暂停，避免主界面仍播上一段剧情曲；回主界面后再点击可重新播「开始界面」BGM
  useEffect(() => {
    return () => {
      stopBgm();
    };
  }, [stopBgm]);
  const effectiveSpeaker = node?.type === 'choice' ? null : node?.speaker;

  const affectionValue = affection.tartaglia ?? 0;
  const affectionMax = affectionMeta.tartaglia?.max ?? 5;

  const hearts = useMemo(() => {
    const total = affectionMax ?? 5;
    const filled = Math.max(0, Math.min(total, affectionValue));
    return Array.from({ length: total }, (_, i) => i + 1).map((n) => n <= filled);
  }, [affectionMax, affectionValue]);

  const portraitKey = getSpeakerKey(effectiveSpeaker);
  const portraitSrc = portraitKey ? portraitUrls[portraitKey] : null;

  if (!node) return null;

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.6))',
        position: 'relative',
        overflow: 'hidden',
        padding: 0,
      }}
    >
      {/* 右上角好感度（爱心） */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          right: 18,
          zIndex: 5,
          padding: '10px 12px',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.15)',
          background: 'rgba(0,0,0,0.35)',
          color: '#fff',
          boxShadow: '0 14px 40px rgba(0,0,0,0.25)',
          textAlign: 'left',
          minWidth: 180,
        }}
      >
        <div style={{ fontWeight: 900, marginBottom: 8 }}>达达利亚好感度</div>
        <div style={{ fontSize: 20, letterSpacing: 6, lineHeight: 1 }}>
          {hearts.map((isFilled, i) => (
            <span
              key={i + 1}
              style={{
                color: isFilled ? '#f43f5e' : 'rgba(255,255,255,0.35)',
                textShadow: isFilled ? '0 0 12px rgba(244,63,94,0.35)' : 'none',
              }}
            >
              {isFilled ? '♥' : '♡'}
            </span>
          ))}
        </div>
      </div>

      {/* 立绘层：在对话框上方/下方关系里保持“对话框后屏幕中间” */}
      {portraitSrc && (
        <>
          {portraitKey === 'traveler' ? (
            <img
              src={portraitSrc}
              alt="traveler portrait"
              style={{
                position: 'absolute',
                left: 18,
                bottom: 170,
                width: 240,
                maxHeight: '48vh',
                objectFit: 'contain',
                zIndex: 1,
                filter: 'drop-shadow(0 18px 40px rgba(0,0,0,0.35))',
                pointerEvents: 'none',
              }}
            />
          ) : (
            <img
              src={portraitSrc}
              alt="portrait"
              style={{
                position: 'absolute',
                left: '50%',
                bottom: 170,
                transform: 'translateX(-50%)',
                width: 360,
                maxHeight: '55vh',
                objectFit: 'contain',
                zIndex: 1,
                filter: 'drop-shadow(0 18px 50px rgba(0,0,0,0.35))',
                pointerEvents: 'none',
              }}
            />
          )}
        </>
      )}

      {/* 对话框 + 选项（固定在屏幕下方）；选项多时需可滚动，否则 overflow:hidden 会裁掉第三项导致「点了没反应」 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 3,
          padding: '16px 18px 18px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
          maxHeight: 'min(92vh, 100%)',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '100%', maxWidth: 980 }}>
          {node.type === 'choice' ? (
            <ChoicePrompt
              key={node.id}
              node={node}
              onChoice={(choiceId) => {
                choose(choiceId);
              }}
            />
          ) : (
            <DialogBox
              key={node.id}
              speakerName={node.speakerName || ''}
              text={node.text}
              onAdvance={node.nextId ? advance : undefined}
              typingMs={28}
              style={{ width: '100%', minHeight: 130 }}
            />
          )}
        </div>
      </div>

      {/* 返回主界面按钮 */}
      <div style={{ position: 'absolute', top: 18, left: 18, zIndex: 6 }}>
        <button
          onClick={stopGameToMain}
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
      </div>
    </div>
  );
}

function ChoicePrompt({ node, onChoice }) {
  const [choicesVisible, setChoicesVisible] = useState(false);

  return (
    <>
      <DialogBox
        key={node.id}
        style={{ width: '100%', minHeight: 130 }}
        speakerName={node.speakerName || ''}
        text={node.text}
        onTypedDone={() => setChoicesVisible(true)}
        // choice 节点不走 onAdvance：点击由选择按钮触发
      />
      {choicesVisible && <ChoiceList choices={node.choices ?? []} onChoice={onChoice} />}
    </>
  );
}
