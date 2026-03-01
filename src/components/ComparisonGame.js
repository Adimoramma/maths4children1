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


// comparison questions using numeric values
const ComparisonGame = ({ onHome, sound = true, onPlay, onComplete, onCorrect, correctCount = 0 }) => {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(0);
  const [question, setQuestion] = useState('bigger'); // or "smaller"
  const [announcement, setAnnouncement] = useState('');

  const newQuestion = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    let b = Math.floor(Math.random() * 10) + 1;
    while (b === a) b = Math.floor(Math.random() * 10) + 1;
    setLeft(a);
    setRight(b);
    setQuestion(Math.random() < 0.5 ? 'bigger' : 'smaller');
  };

  React.useEffect(() => {
    newQuestion();
  }, []);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(msg);
    }
  };

  React.useEffect(() => {
    if (sound) speak(`Which number is ${question}? Left is ${left}, right is ${right}`);
  }, [left, right, question, sound]);

  const choose = (side) => {
    if (onPlay) onPlay();
    let correctSide;
    if (question === 'bigger') correctSide = left > right ? 'left' : 'right';
    else correctSide = left < right ? 'left' : 'right';
    if (side === correctSide) {
      if (sound) playClick();
      if (onComplete) onComplete();
      if (onCorrect) onCorrect();
      setAnnouncement('Good job!');
      newQuestion();
    } else {
      setAnnouncement(`Oops, the correct answer was ${correctSide}`);
      if (sound) speak(`The correct answer was ${correctSide}`);
    }
  };


  return (
    <div className="game-container">
      <button className="home-link" onClick={onHome}>🏠 Home</button>
      {correctCount > 0 && <div className="score">⭐ Correct {correctCount} times</div>}
      <button className="game-button" style={{position:'absolute',top:'1rem',right:'1rem'}} onClick={() => speak(`Which number is ${question}?`) }>🔊</button>
      <h2>Which number is {question}?</h2>
      <div className="comparison-display">
        <button className="game-button" onClick={() => choose('left')}>{left}</button>
        <button className="game-button" onClick={() => choose('right')}>{right}</button>
      </div>
      <div aria-live="assertive" style={{position:'absolute', left:'-10000px'}}>{announcement}</div>
    </div>
  );
};

export default ComparisonGame;