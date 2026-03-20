import React from 'react';

/**
 * ChoiceList
 * - 展示“当前节点可选项”的列表（按钮形式）
 * - 点击后调用 onChoice(choiceId)
 */

export default function ChoiceList({ choices = [], onChoice }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: 12,
        marginTop: 12,
      }}
    >
      {choices.map((c, idx) => (
        <button
          key={c.id ?? idx}
          onClick={() => onChoice?.(c.id)}
          style={{
            width: '100%',
            padding: '12px 14px',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.18)',
            background: 'rgba(255,255,255,0.08)',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
            textAlign: 'left',
            boxShadow: '0 8px 26px rgba(0,0,0,0.18)',
          }}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}

