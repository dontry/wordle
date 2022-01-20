import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import GameProvider from './GameProvider';
import './index.css';
import words from './assets/words.json';

const answer = words.data[Math.floor(Math.random() * words.data.length)];


ReactDOM.render(
  <React.StrictMode>
    <GameProvider answer={answer}>
      <App />
    </GameProvider >
  </React.StrictMode>,
  document.getElementById('root'),
);
