import React, { useState } from 'react';
import './Game.css';

// simple tone generator for positive feedback
function playDing() {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const o = context.createOscillator();
    const g = context.createGain();
    o.connect(g);
    g.connect(context.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(880, context.currentTime);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.3);
    setTimeout(() => context.close(), 500);
  } catch (e) {
    // audio context might be blocked if not triggered by user
    // ignore errors
  }
}

const CountingGame = ({ onHome, sound = true, onPlay, onComplete, completed = 0 }) => {
  const target = 20; // always count to 20
  const [count, setCount] = useState(0);

  // speak instructions using speechSynthesis
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(msg);
    }
  };


  const [announcement, setAnnouncement] = useState('');

  React.useEffect(() => {
    if (sound) speak(`Count to ${target}`);
  }, [sound]);

  const increment = () => {
    if (onPlay) onPlay();
    setCount(prev => {
      const next = prev + 1;
      if (sound) speak(`${next}`); // speak number on every increment
      if (next === target) {
        if (sound) playDing();
        if (onComplete) onComplete();
        setAnnouncement(`Well done! You counted to ${target}`);
      }
      return next;
    });
  };
  const reset = () => {
    setCount(0);
    setAnnouncement('');
  };

  return (
    <div className="game-container">
      <button className="home-link" onClick={onHome}>🏠 Home</button>
      <h2>Count to {target}</h2>
      {completed > 0 && <div className="score">⭐ Completed {completed} times</div>}
      <button className="game-button" style={{position:'absolute',top: '1rem',right:'1rem'}} onClick={() => speak(`Count to ${target}`)}>🔊</button>
      <div className="count-display" aria-live="polite">
        {count}
        {count === target && <span className="celebrate"> 🎉</span>}
      </div>
      <div aria-live="assertive" style={{position:'absolute', left:'-10000px'}}>{announcement}</div>
      <button className="game-button" onClick={increment}>+1</button>
      <button className="game-button" onClick={reset}>Reset</button>
    </div>
  );
};

export default CountingGame;
