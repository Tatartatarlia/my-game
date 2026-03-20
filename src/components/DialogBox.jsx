import { useEffect, useMemo, useRef, useState } from 'react';
import { useAudio } from '../context/AudioContext';

/**
 * DialogBox
 * - 剧情内页“对话框”的展示组件
 * - 逐字出现文本（打字机效果）
 *
 * 交互规则：
 * - 未播放完时点击：立即补全
 * - 播放完时点击：调用 onAdvance（由 GameScreen 决定切到 nextId）
 *
 * 对 choice 节点的“提示文字”，可用 onTypedDone：当逐字完成后通知上层显示选项。
 */

export default function DialogBox({
  speakerName,
  text,
  onAdvance,
  onTypedDone,
  typingMs = 18,
  style,
}) {
  const { defaultSeUrl, playSe } = useAudio();

  const [index, setIndex] = useState(0);
  const doneCalledRef = useRef(false);

  const safeText = text ?? '';

  const displayText = useMemo(() => safeText.slice(0, index), [safeText, index]);
  const isDone = index >= safeText.length;

  useEffect(() => {
    if (!safeText) return;

    if (isDone) {
      if (!doneCalledRef.current) {
        doneCalledRef.current = true;
        onTypedDone?.();
      }
      return;
    }

    const id = window.setTimeout(() => {
      setIndex((v) => Math.min(v + 1, safeText.length));
    }, typingMs);

    return () => window.clearTimeout(id);
  }, [isDone, onTypedDone, safeText, typingMs]);

  const handleClick = () => {
    if (!safeText) return;

    // 对话框点击音效：与开始界面点击音效保持一致
    if (defaultSeUrl) {
      // 不等待播放完成，避免阻塞点击交互
      playSe(defaultSeUrl);
    }

    if (!isDone) {
      setIndex(safeText.length);
      if (!doneCalledRef.current) {
        doneCalledRef.current = true;
        onTypedDone?.();
      }
      return;
    }

    onAdvance?.();
  };

  const showAdvanceHint = Boolean(onAdvance);

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
      style={{
        cursor: 'pointer',
        userSelect: 'none',
        padding: '14px 16px',
        borderRadius: 12,
        background: 'rgba(250, 248, 243, 0.96)', // 浅色
        color: '#1f2937', // 深色
        boxShadow: '0 14px 44px rgba(0,0,0,0.18)',
        ...style,
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 8, textAlign: 'left' }}>
        {speakerName ? speakerName : ' '}
      </div>
      <div style={{ whiteSpace: 'pre-wrap', textAlign: 'left', lineHeight: 1.6, minHeight: 44 }}>
        {displayText}
        {!isDone && <span style={{ opacity: 0.7 }}>▍</span>}
      </div>
      {isDone && showAdvanceHint && (
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85 }}>点击继续</div>
      )}
    </div>
  );
}
