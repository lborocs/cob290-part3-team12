import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Import the main App component
import './index.css'; // Optional global styles

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Mounts to <div id="root"> in index.html
);