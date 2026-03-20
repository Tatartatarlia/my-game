/**
 * useStorage
 * - 负责“唯一存档”的读写（localStorage 或你后续扩展的后端）
 * - 存档结构建议：直接保存 GameState（包含 nodeId/affection/history/failed/checkpoint/等）
 * - 提供 API（概念上）：
 *   - save(gameState): 覆盖写入唯一存档
 *   - load(): 读取唯一存档并返回 GameState
 *   - clear(): 可选，清空存档
 *
 * 由于你有“重新选择后存档页发生变化”的需求，所以不要做“多条时间线追加”；
 * 而是每次重新选择更新并覆盖唯一存档。
 */

import { useCallback } from 'react';

const STORAGE_KEY = 'react-demo:save-slot-1';

export default function useStorage() {
  const saveGame = useCallback((gameState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
      return true;
    } catch (e) {
      console.warn('[Storage] saveGame failed:', e);
      return false;
    }
  }, []);

  const loadGame = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[Storage] loadGame failed:', e);
      return null;
    }
  }, []);

  const clearGame = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (e) {
      console.warn('[Storage] clearGame failed:', e);
      return false;
    }
  }, []);

  return {
    saveGame,
    loadGame,
    clearGame,
  };
}
