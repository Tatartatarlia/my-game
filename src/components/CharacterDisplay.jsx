/**
 * CharacterDisplay
 * - 用于剧情内页的立绘/角色展示（当前项目缺少图片资源，因此先用“占位卡片”实现布局）
 *
 * props:
 * - position: 'left' | 'right'
 * - label: 显示在立绘卡片上的角色名
 */

export default function CharacterDisplay({ position = 'right', label }) {
  const isLeft = position === 'left';
  return (
    <div
      style={{
        width: isLeft ? 180 : 360,
        minHeight: 280,
        borderRadius: 18,
        background: isLeft
          ? 'linear-gradient(135deg, rgba(102,126,234,0.35), rgba(118,75,162,0.2))'
          : 'linear-gradient(135deg, rgba(245,87,108,0.25), rgba(170,59,255,0.15))',
        border: '1px solid rgba(255,255,255,0.16)',
        boxShadow: '0 18px 60px rgba(0,0,0,0.22)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
      }}
    >
      <div style={{ color: '#fff', fontWeight: 900, fontSize: 18, textAlign: 'center' }}>
        {label ?? (isLeft ? '旅行者' : '角色')}
      </div>
    </div>
  );
}
