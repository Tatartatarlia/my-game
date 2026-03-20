/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';

// 创建音频上下文
const AudioContext = createContext();

// 读取打包后的默认 BGM（你后续可扩展为按场景选择）
// 说明：放在 src/assets 下的音频，Vite 会在打包时把它转换成可访问的 URL。
const bgmModules = import.meta.glob('../assets/audio/bgm/*', {
  eager: true,
  import: 'default',
});

const defaultBgmUrl = Object.values(bgmModules)[0] || null;

// 默认音效（用于按钮点击等）
const seModules = import.meta.glob('../assets/audio/se/*', {
  eager: true,
  import: 'default',
});
const defaultSeUrl = Object.values(seModules)[0] || null;

// 提供者组件
export function AudioProvider({ children }) {
  const [bgmVolume, setBgmVolume] = useState(70); // 0-100
  const [sfxVolume, setSfxVolume] = useState(70); // 0-100

  const bgmAudioRef = useRef(null);
  const bgmVolumeRef = useRef(bgmVolume);
  const sfxVolumeRef = useRef(sfxVolume);

  useEffect(() => {
    bgmVolumeRef.current = bgmVolume;
    if (bgmAudioRef.current) {
      bgmAudioRef.current.volume = bgmVolume / 100;
    }
  }, [bgmVolume]);

  useEffect(() => {
    sfxVolumeRef.current = sfxVolume;
  }, [sfxVolume]);

  const ensureBgmAudio = useCallback(() => {
    if (bgmAudioRef.current) return bgmAudioRef.current;
    const audio = new Audio();
    audio.loop = true;
    bgmAudioRef.current = audio;
    return audio;
  }, []);

  // 静音预播：规避部分浏览器对“未触发手势的自动播放”的限制
  const primeBgm = useCallback(
    async (audioUrl = defaultBgmUrl) => {
      if (!audioUrl) return false;

      const audio = ensureBgmAudio();

      // 如果已经是同一首 BGM，就不用换 src，尽量避免“从头播放”的观感
      if (!audio.src || audio.src !== audioUrl) {
        audio.src = audioUrl;
        audio.load(); // 确保浏览器在 play() 前完成资源切换
      }

      // 用 muted 先播放，提高自动播放成功率
      audio.muted = true;
      audio.volume = 0;
      audio.loop = true;

      try {
        await audio.play();

        // 如果此时浏览器允许恢复音量，则直接解静音；否则用户交互后再恢复
        audio.muted = false;
        audio.volume = bgmVolumeRef.current / 100;
        return true;
      } catch (err) {
        console.warn('[Audio] BGM 预播失败：', err);
        // 预播失败时确保不要长期保持静音
        audio.muted = false;
        return false;
      }
    },
    [defaultBgmUrl, ensureBgmAudio],
  );

  const playBgm = useCallback(
    async (audioUrl = defaultBgmUrl) => {
      if (!audioUrl) return false;

      const audio = ensureBgmAudio();
      // 如果之前 prime 失败把 muted 留住了，这里强制取消静音
      audio.muted = false;
      // 更新音量（HTMLAudioElement 音量范围是 0-1）
      audio.volume = bgmVolumeRef.current / 100;

      // 切歌：只有在 URL 不同时才更新 src
      if (audio.src !== audioUrl) {
        audio.src = audioUrl;
        audio.load(); // 切换资源后强制 load，避免某些浏览器状态不同步
      }

      try {
        // 某些浏览器要求必须由用户手势触发，否则会报 NotAllowedError
        await audio.play();
        return true;
      } catch (err) {
        console.warn('[Audio] 播放BGM失败：', err);
        return false;
      }
    },
    [defaultBgmUrl, ensureBgmAudio],
  );

  const stopBgm = useCallback(() => {
    const audio = bgmAudioRef.current;
    if (!audio) return;
    audio.pause();
    // 不清空 src：避免重复切回时需要重新加载
  }, []);

  const playSe = useCallback(
    async (audioUrl) => {
      if (!audioUrl) return false;
      try {
        const audio = new Audio(audioUrl);
        audio.volume = sfxVolumeRef.current / 100;
        // 音效通常不需要 loop
        await audio.play();
        return true;
      } catch (err) {
        console.warn('[Audio] 播放音效失败：', err);
        return false;
      }
    },
    [],
  );

  const value = {
    bgmVolume,
    setBgmVolume,
    sfxVolume,
    setSfxVolume,

    defaultBgmUrl,
    defaultSeUrl,
    primeBgm,
    playBgm,
    stopBgm,
    playSe,
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
