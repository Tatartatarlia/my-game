import StartScreen from './components/StartScreen';
import { AudioProvider } from './context/AudioContext';
import SoundControl from './components/SoundControl';
import './App.css';

function App() {
  return (
    <AudioProvider>
      <div className="App">
        <StartScreen />
        <SoundControl />
      </div>
    </AudioProvider>
  );
}

export default App;