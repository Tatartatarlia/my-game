import { createContext, useState, useContext } from 'react';

// 创建音频上下文
const AudioContext = createContext();

// 提供者组件
export function AudioProvider({ children }) {
  const [bgmVolume, setBgmVolume] = useState(70); // 0-100
  const [sfxVolume, setSfxVolume] = useState(70); // 0-100

  const value = {
    bgmVolume,
    setBgmVolume,
    sfxVolume,
    setSfxVolume,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

// 自定义Hook，方便在任何组件中使用
export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}
