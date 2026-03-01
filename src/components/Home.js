import React from 'react';
import './Home.css';

const Home = ({ onSelect, onSettings }) => {
  return (
    <div className="home-container">
      <h1 className="home-title">Math For Kids</h1>
      <span className="sr-only" aria-live="polite">Welcome to Math For Kids! Choose an activity or open settings.</span>
      <div className="home-buttons">
        <button className="home-button" onClick={() => onSelect('counting')} aria-label="Counting game">
          🧮
          <span className="button-label">Count</span>
        </button>
        <button className="home-button" onClick={() => onSelect('shapes')} aria-label="Shapes game">
          🔷
          <span className="button-label">Shapes</span>
        </button>
        <button className="home-button" onClick={() => onSelect('compare')} aria-label="Comparison game">
          📏
          <span className="button-label">Compare</span>
        </button>
      </div>
      <button className="settings-button" onClick={onSettings} aria-label="Settings">⚙️</button>
    </div>
  );
};

export default Home;
