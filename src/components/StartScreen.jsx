import { useEffect, useRef } from 'react';
import { useState } from 'react';
import '../styles/StartScreen.css';
import ParticleEffect from './ParticleEffect';
import GameRuleModal from '../components/GameRuleModal';
import { useAudio } from '../context/AudioContext';
import { useGameContext } from '../context/GameContext';

export default function StartScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);//游戏说明弹窗
  const screenRef = useRef(null);
  const hasAutoTriedPlayRef = useRef(false);
  const hasUserGestureTriggeredRef = useRef(false);
  const { defaultBgmUrl, defaultSeUrl, playBgm, playSe } = useAudio();
  const { startGame, enterArchive } = useGameContext();

  useEffect(() => {
    if (hasAutoTriedPlayRef.current) return;
    hasAutoTriedPlayRef.current = true;

    let cancelled = false;

    // 即使 prime 成功，也仍然保留一次用户交互兜底
    // 这里在 cleanup 中显式移除监听，避免 StrictMode 双挂载导致“旧监听”影响点击播放。
    const onFirstInteraction = () => {
      if (cancelled) return;
      if (hasUserGestureTriggeredRef.current) return;
      hasUserGestureTriggeredRef.current = true;
      // 不 await，保证在用户手势回调同步触发 audio.play()
      playBgm(defaultBgmUrl).then((ok) => {
        if (!ok) console.warn('[Audio] 用户交互播放BGM失败，可能仍被浏览器策略拦截');
      });
    };

    window.addEventListener('pointerdown', onFirstInteraction, { once: true });
    window.addEventListener('keydown', onFirstInteraction, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    };
  }, [defaultBgmUrl, playBgm]);

  const onAnyPointerDown = () => {
    // 每次点击都给一个按钮音效（如果你确实放了 se 文件）
    if (defaultSeUrl) playSe(defaultSeUrl);

    // 只在第一次用户手势时启动 BGM，避免重复从头开始
    if (hasUserGestureTriggeredRef.current) return;
    hasUserGestureTriggeredRef.current = true;

    playBgm(defaultBgmUrl).then((ok) => {
      if (!ok) console.warn('[Audio] root pointerdown 播放BGM失败，可能仍被拦截');
    });
  };

  return (
    <div
      className="start-screen"
      ref={screenRef}
      onPointerDown={onAnyPointerDown}
      style={{ backgroundImage: `url(/src/assets/images/bg-start.jpg)` }}
    >
      {/* 粒子效果组件 */}
      <ParticleEffect />

      {/* 游戏标题 - 靠近顶部 */}
      <div className="title-container">
        <h1>和达达利亚一起冒险吧！</h1>
      </div>

      {/* 三个按钮容器 - 放在右下角 */}
      <div className="buttons-container">
        <button
          className="btn btn-start"
          onClick={() => {
            if (defaultSeUrl) playSe(defaultSeUrl);
            playBgm(defaultBgmUrl);
            startGame();
          }}
        >
          开始游戏
        </button>
        <button
          className="btn btn-load"
          onClick={() => {
            if (defaultSeUrl) playSe(defaultSeUrl);
            enterArchive();
          }}
        >
          查看存档
        </button>
        <button className="btn btn-info" onClick={() => setIsModalOpen(true)}>游戏说明</button>
      </div>
      <GameRuleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}