// GameRuleModal.jsx
import { useEffect } from 'react';

// 接收2个props：是否显示弹窗、关闭弹窗的方法
export default function GameRuleModal({ isOpen, onClose }) {
  // 弹窗打开时，禁止页面滚动（优化体验）
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // 组件卸载时恢复滚动
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // 如果弹窗不显示，直接返回空
  if (!isOpen) return null;

  return (
    // 遮罩层：点击遮罩关闭弹窗
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999, // 确保弹窗在最上层
      }}
      onClick={onClose}
    >
      {/* 弹窗内容：阻止点击事件冒泡（避免点内容也关闭） */}
      <div 
        style={{
          width: '80%',
          maxWidth: '600px',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button 
          onClick={onClose}
          style={{
            float: 'right',
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
        
        {/* 游戏说明内容（你可以自定义） */}
        <h2 style={{ color: '#e63946', textAlign: 'center' }}>✨ 和达达利亚一起冒险吧！ ✨</h2>
        <div style={{ marginTop: '20px', lineHeight: '1.8', color: '#333', textAlign: 'left' }}>
          <p>1. 游戏为乙女向互动剧情，通过选择不同选项推进剧情；</p>
          <p>2. 游戏共有两条剧情线，不同选项会导向不同的剧情线哦～</p>
          <p>3. 部分选项会直接导致游戏失败，部分选项会影响与达达利亚的好感度，好感度过低会触发游戏失败；</p>
          <p>4. 可随时存档，查看已进行的对话记录；</p>
          <p>5. 支持调整BGM和音效音量，享受沉浸式互动～</p>
        </div>
      </div>
    </div>
  );
}