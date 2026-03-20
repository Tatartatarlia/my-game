import StartScreen from './components/StartScreen';
import { AudioProvider } from './context/AudioContext';
import { GameProvider, useGameContext } from './context/GameContext';
import SoundControl from './components/SoundControl';
import GameScreen from './components/GameScreen';
import FailureScreen from './components/FailureScreen';
import ArchiveScreen from './components/ArchiveScreen';
import './App.css';

function AppInner() {
  const { mode } = useGameContext();
  return (
    <>
      {mode === 'story' && <GameScreen />}
      {mode === 'failed' && <FailureScreen />}
      {mode === 'archive' && <ArchiveScreen />}
      {mode === 'main' && <StartScreen />}
    </>
  );
}

function App() {
  return (
    <AudioProvider>
      <GameProvider>
        <div className="App">
          <AppInner />
          <SoundControl />
        </div>
      </GameProvider>
    </AudioProvider>
  );
}

export default App;