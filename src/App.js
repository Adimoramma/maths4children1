import React, { useState } from 'react';
import './App.css';

import Home from './components/Home';
import CountingGame from './components/CountingGame';
import ShapesGame from './components/ShapesGame';
import ComparisonGame from './components/ComparisonGame';
import Settings from './components/Settings';

function App() {
  const [screen, setScreen] = useState('home');
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const s = localStorage.getItem('maths1-5-sound');
      return s === null ? true : s === 'true';
    } catch {
      return true;
    }
  });
  const [highContrast, setHighContrast] = useState(() => {
    try {
      const h = localStorage.getItem('maths1-5-highcontrast');
      return h === 'true';
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // track plays/completions/accuracy for simple progress overview
  const defaultStats = {
    counting: { plays: 0, completed: 0 },
    shapes: { plays: 0, completed: 0 },
    compare: { plays: 0, completed: 0, correct: 0 },
  };
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('maths1-5-stats');
      return saved ? JSON.parse(saved) : defaultStats;
    } catch (e) {
      return defaultStats;
    }
  });

  const persist = (newStats) => {
    setStats(newStats);
    try {
      localStorage.setItem('maths1-5-stats', JSON.stringify(newStats));
    } catch (e) {}
  };

  const incrementPlay = (game) => {
    persist({
      ...stats,
      [game]: { ...stats[game], plays: stats[game].plays + 1 }
    });
  };
  const incrementComplete = (game) => {
    persist({
      ...stats,
      [game]: { ...stats[game], completed: stats[game].completed + 1 }
    });
  };
  const incrementCorrect = () => {
    persist({
      ...stats,
      compare: { ...stats.compare, correct: stats.compare.correct + 1 }
    });
  };

  const handleSelect = (name) => {
    setScreen(name);
  };

  // speak welcome when returning home
  React.useEffect(() => {
    if (screen === 'home' && soundEnabled && 'speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance('Welcome! Tap a game to begin.');
      window.speechSynthesis.speak(msg);
    }
  }, [screen, soundEnabled]);

  const goHome = () => setScreen('home');

  let content;
  switch (screen) {
    case 'counting':
      content = <CountingGame onHome={goHome} sound={soundEnabled} onPlay={() => incrementPlay('counting')} onComplete={() => incrementComplete('counting')} completed={stats.counting.completed} />;
      break;
    case 'shapes':
      content = <ShapesGame onHome={goHome} sound={soundEnabled} onPlay={() => incrementPlay('shapes')} onComplete={() => incrementComplete('shapes')} completed={stats.shapes.completed} />;
      break;
    case 'compare':
      content = <ComparisonGame onHome={goHome} sound={soundEnabled} onPlay={() => incrementPlay('compare')} onComplete={() => incrementComplete('compare')} onCorrect={incrementCorrect} correctCount={stats.compare.correct} />;
      break;
    case 'settings':
      content = <Settings
        onHome={goHome}
        soundOn={soundEnabled}
        toggleSound={() => setSoundEnabled(prev => { const next = !prev; try{localStorage.setItem('maths1-5-sound', next);}catch{} return next; })}
        highContrast={highContrast}
        toggleContrast={() => setHighContrast(prev => { const next = !prev; try{localStorage.setItem('maths1-5-highcontrast', next);}catch{} return next; })}
        stats={stats}
      />;
      break;
    default:
      content = <Home onSelect={handleSelect} onSettings={() => handleSelect('settings')} stats={stats} />;
  }

  return <div className="App">{content}</div>;
}

export default App;
