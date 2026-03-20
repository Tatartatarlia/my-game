import { useRef } from 'react';
import { useState } from 'react';
import '../styles/StartScreen.css';
import ParticleEffect from './ParticleEffect';
import GameRuleModal from '../components/GameRuleModal';

export default function StartScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);//游戏说明弹窗
  const screenRef = useRef(null);

  return (
    <div className="start-screen" ref={screenRef} style={{ backgroundImage: `url(/src/assets/images/bg-start.jpg)` }}>
      {/* 粒子效果组件 */}
      <ParticleEffect />

      {/* 游戏标题 - 靠近顶部 */}
      <div className="title-container">
        <h1>和达达利亚一起冒险吧！</h1>
      </div>

      {/* 三个按钮容器 - 放在右下角 */}
      <div className="buttons-container">
        <button className="btn btn-start">开始游戏</button>
        <button className="btn btn-load">查看存档</button>
        <button className="btn btn-info" onClick={() => setIsModalOpen(true)}>游戏说明</button>
      </div>
      <GameRuleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}