import React from 'react';
import './Game.css';

const Settings = ({ onHome, soundOn, toggleSound, highContrast, toggleContrast, stats }) => {
  return (
    <div className="game-container">
      <button className="home-link" onClick={onHome}>🏠 Home</button>
      <h2>Settings</h2>
      <p>
        Sound: <button className="game-button" onClick={toggleSound}>{soundOn ? 'On' : 'Off'}</button>
      </p>
      <p>
        High Contrast: <button className="game-button" onClick={toggleContrast}>{highContrast ? 'On' : 'Off'}</button>
      </p>
      <div className="progress">
        <h3>Learning Progress</h3>
        <ul>
          <li>Counting: played {stats.counting.plays}, completed {stats.counting.completed}</li>
          <li>Shapes: played {stats.shapes.plays}, completed {stats.shapes.completed}</li>
          <li>Comparison: played {stats.compare.plays}, correct {stats.compare.correct}, completed {stats.compare.completed}</li>
        </ul>
        <button className="game-button" onClick={() => {
          if (window.confirm('Clear all progress?')) {
            localStorage.removeItem('maths1-5-stats');
            // announce before reload
            const live = document.getElementById('reset-announcement');
            if (live) live.textContent = 'Progress cleared.';
            setTimeout(() => window.location.reload(), 500);
          }
        }}>Reset Progress</button>
      <div id="reset-announcement" aria-live="assertive" style={{position:'absolute', left:'-10000px'}}></div>
      </div>
    </div>
  );
};

export default Settings;