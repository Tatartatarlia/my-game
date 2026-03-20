/**
 * FailureScreen（失败页）
 * - 展示失败原因（例如：选错选项 / 好感度过低）
 * - 提供“返回选项处重新选择”的入口
 *
 * 关键依赖：
 * - 失败时必须保留 checkpoint（选择发生前的 nodeId + affection + history）
 * - 点击“返回重新选择”时恢复 checkpoint，并允许用户走新分支
 */
import { useAudio } from '../context/AudioContext';
import { useGameContext } from '../context/GameContext';
import DialogBox from './DialogBox';

export default function FailureScreen() {
  const { currentNode, retryFromCheckpoint } = useGameContext();
  const { defaultSeUrl, playSe } = useAudio();

  if (!currentNode) return null;

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.7))',
        position: 'relative',
        padding: 18,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ position: 'absolute', top: 18, left: 18, zIndex: 2 }}>
        <button
          onClick={retryFromCheckpoint}
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
          返回选项处重新选择
        </button>
      </div>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 70 }}>
        <div style={{ width: '100%', maxWidth: 980, marginTop: 60 }}>
          <DialogBox
            speakerName={currentNode.speakerName || ''}
            text={currentNode.text}
            onAdvance={undefined}
            style={{ width: '100%', minHeight: 160 }}
            typingMs={26}
          />
        </div>
      </div>

      {/* 底部兜底按钮（便于触达） */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 18, display: 'flex', justifyContent: 'center', zIndex: 3 }}>
        <button
          onClick={() => {
            if (defaultSeUrl) playSe(defaultSeUrl);
            retryFromCheckpoint();
          }}
          style={{
            padding: '12px 18px',
            borderRadius: 14,
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(255,255,255,0.10)',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 900,
            boxShadow: '0 16px 60px rgba(0,0,0,0.25)',
          }}
        >
          返回选项处重新选择
        </button>
      </div>
    </div>
  );
}

