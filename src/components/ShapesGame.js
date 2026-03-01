import React, { useState } from 'react';
import './Game.css';

function playClick() {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const o = context.createOscillator();
    const g = context.createGain();
    o.connect(g);
    g.connect(context.destination);
    o.type = 'triangle';
    o.frequency.setValueAtTime(660, context.currentTime);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.2);
    setTimeout(() => context.close(), 300);
  } catch (e) {}
}

// shapes: [name, emoji]
const shapes = [
  ['circle', '🔵'],
  ['square', '🟦'],
  ['triangle', '🔺'],
  ['star', '⭐'],
  ['heart', '❤️'],
  ['hexagon', '⬡'],
  ['oval', '⚪'],
  ['diamond', '♦️'],
  ['pentagon', '⬟'],
  ['cross', '✚'],
  ['crescent', '🌙'],
  ['plus', '➕'],
  ['spade', '♠️'],
  ['club', '♣️'],
  ['arrow', '➡️'],
  ['gear', '⚙️'],
  ['leaf', '🍃'],
  ['drop', '💧'],
  ['moon', '🌑'],
  ['sun', '🌞'],
];


const ShapesGame = ({ onHome, sound = true, onPlay, onComplete, completed = 0 }) => {
  const [current, setCurrent] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const [options, setOptions] = useState([]);

  const makeOptions = (idx) => {
    const correct = shapes[idx][0];
    const others = shapes.map(s => s[0]).filter(n => n !== correct);
    // pick two random other names
    const choices = [];
    while (choices.length < 2) {
      const pick = others[Math.floor(Math.random() * others.length)];
      if (!choices.includes(pick)) choices.push(pick);
    }
    const array = [...choices, correct];
    // shuffle
    return array.sort(() => Math.random() - 0.5);
  };

  React.useEffect(() => {
    setOptions(makeOptions(current));
  }, [current]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(msg);
    }
  };

  React.useEffect(() => {
    if (sound) speak(`What shape is this?`);
  }, [current, sound]);

  const next = () => {
    if (onPlay) onPlay();
    const nextIdx = (current + 1) % shapes.length;
    setCurrent(nextIdx);
    if (nextIdx === 0 && onComplete) onComplete();
  };

  return (
    <div className="game-container">
      <button className="home-link" onClick={onHome}>🏠 Home</button>
      {completed > 0 && <div className="score">⭐ Completed {completed} times</div>}
      <button className="game-button" style={{position:'absolute',top:'1rem',right:'1rem'}} onClick={() => speak(shapes[current][0])}>🔊</button>
      <h2>What shape is this?</h2>
      <div className="shape-display" aria-label={shapes[current][0]} role="img">
        <span className="shape-emoji">{shapes[current][1]}</span>
      </div>
      <div aria-live="assertive" style={{position:'absolute', left:'-10000px'}}>{announcement}</div>
      <div className="options-container">
        {options.map((opt) => (
          <button key={opt} className="game-button" onClick={() => {
            if (opt === shapes[current][0]) {
              if (sound) playClick();
              setAnnouncement('Correct!');
              next();
            } else {
              setAnnouncement(`Oops, the correct answer is ${shapes[current][0]}`);
              if (sound) speak(`The correct answer is ${shapes[current][0]}`);
            }
          }}>{opt}</button>
        ))}
      </div>
    </div>
  );
};

export default ShapesGame;