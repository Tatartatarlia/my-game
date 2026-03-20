import { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import '../styles/SoundControl.css';

export default function SoundControl() {
  const { bgmVolume, setBgmVolume, sfxVolume, setSfxVolume } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`sound-control ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* 控制面板主体 */}
      <div className="sound-control-panel">
        <div 
          className="sound-toggle-btn" 
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? '关闭' : '打开音量控制'}
        >
          🔊
        </div>

        {isExpanded && (
          <div className="sound-controls">
            {/* BGM音量控制 */}
            <div className="control-item">
              <label className="control-label">
                🎵 BGM
                <span className="volume-value">{bgmVolume}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={bgmVolume}
                onChange={(e) => setBgmVolume(Number(e.target.value))}
                className="volume-slider"
              />
            </div>

            {/* 音效音量控制 */}
            <div className="control-item">
              <label className="control-label">
                🔔 音效
                <span className="volume-value">{sfxVolume}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={sfxVolume}
                onChange={(e) => setSfxVolume(Number(e.target.value))}
                className="volume-slider"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
