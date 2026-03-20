/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';

import useGame from '../hooks/useGame';

/**
 * GameContext
 * - 全局持有“唯一存档”的游戏状态（GameState）以及剧情推进 actions。
 * - 你当前阶段目标：先实现“开始游戏 → 逐字对话 → 选项 → 推进”。
 *
 * 注意：AudioContext 已经实现音量/播放，这里只负责“剧情状态/推进逻辑”。
 */
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const game = useGame();
  return <GameContext.Provider value={game}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
}
