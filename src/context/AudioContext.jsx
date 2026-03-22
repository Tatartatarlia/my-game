/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';

// 创建音频上下文
const AudioContext = createContext();

/**
 * BGM 使用全局单例 HTMLAudioElement（挂在 window 上），避免：
 * - React StrictMode 开发环境双挂载 → 两个 new Audio() 同时播
 * - Vite HMR 热更新重载本模块 → 旧 Audio 未 pause，新 Provider 再 new 一条轨
 * 音量滑块只会改到 ref 指向的那一个，就会出现「静音只关掉其中一首」。
 */
const GLOBAL_BGM_KEY = '__react_demo_bgm_audio_singleton__';

function getGlobalBgmAudio() {
  if (typeof window === 'undefined') return null;
  let el = window[GLOBAL_BGM_KEY];
  if (!el) {
    el = new Audio();
    el.loop = true;
    window[GLOBAL_BGM_KEY] = el;
  }
  return el;
}

/**
 * 判断是否为同一音频资源。浏览器里 audio.src 多为绝对 URL，Vite 入参常为相对路径，
 * 若用 !== 比较会误判为「不同」从而 audio.load()，导致从头播放。
 */
function isSameAudioResource(currentSrc, requestedUrl) {
  if (!requestedUrl) return false;
  if (!currentSrc) return false;
  try {
    const base =
      typeof window !== 'undefined' && window.location?.href
        ? window.location.href
        : 'http://localhost/';
    return new URL(currentSrc, base).href === new URL(requestedUrl, base).href;
  } catch {
    return currentSrc === requestedUrl;
  }
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    const el = typeof window !== 'undefined' ? window[GLOBAL_BGM_KEY] : null;
    if (el && typeof el.pause === 'function') {
      el.pause();
    }
  });
}

// 读取打包后的默认 BGM（你后续可扩展为按场景选择）
// 说明：放在 src/assets 下的音频，Vite 会在打包时把它转换成可访问的 URL。
const bgmModules = import.meta.glob('../assets/audio/bgm/*', {
  eager: true,
  import: 'default',
});

const defaultBgmUrl = Object.values(bgmModules)[0] || null;

/** 开始界面 BGM：文件名（不含路径）以此前缀开头 */
const START_BGM_FILENAME_PREFIX = '开始界面';

const GLOBAL_LAST_START_BGM_KEY = '__react_demo_last_start_bgm_url__';

function basenameFromModulePath(modulePath) {
  const raw = modulePath.split('/').pop() || '';
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/** 所有「开始界面」前缀的 BGM 的 URL 列表（顺序随构建工具，仅用于随机池） */
export function getStartScreenBgmUrls() {
  const urls = [];
  for (const [path, url] of Object.entries(bgmModules)) {
    const name = basenameFromModulePath(path);
    if (name.startsWith(START_BGM_FILENAME_PREFIX)) {
      urls.push(url);
    }
  }
  return urls;
}

/**
 * 随机选一首开始界面 BGM；若多首，尽量不选与上一次刚播的同一 URL（避免紧挨着重复）
 */
export function pickStartScreenBgmUrl() {
  const urls = getStartScreenBgmUrls();
  if (urls.length === 0) return defaultBgmUrl;
  if (urls.length === 1) {
    if (typeof window !== 'undefined') {
      window[GLOBAL_LAST_START_BGM_KEY] = urls[0];
    }
    return urls[0];
  }
  const w = typeof window !== 'undefined' ? window : {};
  const last = w[GLOBAL_LAST_START_BGM_KEY];
  let pool = urls.filter((u) => u !== last);
  if (pool.length === 0) pool = urls;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  w[GLOBAL_LAST_START_BGM_KEY] = pick;
  return pick;
}

/**
 * 剧情场景 BGM（放在 src/assets/audio/bgm/，文件名以此前缀开头）：
 * - 主线：nodeId 含 chapter1_ / chapter_2_ 等 → 「剧情第一章」「剧情第二章」…（中文数字一至十）
 * - 旧线：nodeId 含 oldstory → 「剧情旧线」
 * 若当前场景没有对应文件，则暂停 BGM（避免开始界面音乐在剧情里一直播）。
 */
const CN_CHAPTER = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

function chapterChineseOrdinal(n) {
  if (n >= 1 && n <= 10) return CN_CHAPTER[n - 1];
  if (n === 11) return '十一';
  if (n === 12) return '十二';
  return String(n);
}

/** @returns {string|null} 用于匹配文件名的前缀 */
export function storyBgmFilenamePrefixForNodeId(nodeId) {
  if (!nodeId) return null;
  const s = String(nodeId);
  if (/oldstory/i.test(s)) return '剧情旧线';
  let m = s.match(/chapter_(\d+)_/i);
  if (!m) m = s.match(/chapter(\d+)_/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  if (n < 1) return null;
  return `剧情第${chapterChineseOrdinal(n)}章`;
}

export function findStoryBgmUrl(nodeId) {
  const prefix = storyBgmFilenamePrefixForNodeId(nodeId);
  if (!prefix) return null;
  const hits = [];
  for (const [path, url] of Object.entries(bgmModules)) {
    const name = basenameFromModulePath(path);
    if (name.startsWith(prefix)) hits.push({ path, url });
  }
  hits.sort((a, b) => a.path.localeCompare(b.path));
  return hits[0]?.url ?? null;
}

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
    const audio = bgmAudioRef.current ?? getGlobalBgmAudio();
    if (audio) {
      audio.volume = bgmVolume / 100;
    }
  }, [bgmVolume]);

  useEffect(() => {
    sfxVolumeRef.current = sfxVolume;
  }, [sfxVolume]);

  const ensureBgmAudio = useCallback(() => {
    const audio = getGlobalBgmAudio();
    if (!audio) return null;
    bgmAudioRef.current = audio;
    return audio;
  }, []);

  // 静音预播：规避部分浏览器对“未触发手势的自动播放”的限制
  const primeBgm = useCallback(
    async (audioUrl = defaultBgmUrl) => {
      if (!audioUrl) return false;

      const audio = ensureBgmAudio();
      if (!audio) return false;

      // 如果已经是同一首 BGM，就不用换 src，尽量避免“从头播放”的观感
      if (!isSameAudioResource(audio.src, audioUrl)) {
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
      if (!audio) return false;
      // 如果之前 prime 失败把 muted 留住了，这里强制取消静音
      audio.muted = false;
      // 更新音量（HTMLAudioElement 音量范围是 0-1）
      audio.volume = bgmVolumeRef.current / 100;

      // 切歌：只有在 URL 不同时才更新 src（须规范化比较，见 isSameAudioResource）
      if (!isSameAudioResource(audio.src, audioUrl)) {
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
    const audio = bgmAudioRef.current ?? getGlobalBgmAudio();
    if (!audio) return;
    audio.pause();
    // 不清空 src：避免重复切回时需要重新加载
  }, []);

  /** 根据当前剧情节点切换 BGM；无对应文件则暂停（开始界面音乐不会带进剧情） */
  const playStoryBgmForNode = useCallback(
    async (nodeId) => {
      const url = findStoryBgmUrl(nodeId);
      const audio = ensureBgmAudio();
      if (!audio) return false;
      if (!url) {
        audio.pause();
        return false;
      }
      audio.muted = false;
      audio.volume = bgmVolumeRef.current / 100;
      audio.loop = true;
      if (!isSameAudioResource(audio.src, url)) {
        audio.src = url;
        audio.load();
      }
      try {
        await audio.play();
        return true;
      } catch (err) {
        console.warn('[Audio] 剧情 BGM 播放失败：', err);
        return false;
      }
    },
    [ensureBgmAudio],
  );

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

  /**
   * 若全局 BGM 正在播且当前资源属于「开始界面*」曲库，返回对应的模块 URL（用于主菜单重挂载后接着播、不重新随机）。
   * 已暂停（例如从剧情 stopBgm 回来）则返回 null，下次点击应重新 pick。
   */
  const getStartMenuBgmIfAlreadyPlaying = useCallback(() => {
    const audio = ensureBgmAudio();
    if (!audio || audio.paused) return null;
    const pool = getStartScreenBgmUrls();
    return pool.find((u) => isSameAudioResource(audio.src, u)) ?? null;
  }, [ensureBgmAudio]);

  const value = {
    bgmVolume,
    setBgmVolume,
    sfxVolume,
    setSfxVolume,

    defaultBgmUrl,
    /** 开始界面用：从「开始界面*」文件里随机，且不与上一首紧挨重复 */
    pickStartScreenBgmUrl,
    findStoryBgmUrl,
    playStoryBgmForNode,
    defaultSeUrl,
    primeBgm,
    playBgm,
    stopBgm,
    playSe,
    getStartMenuBgmIfAlreadyPlaying,
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
