import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './Log In/LoginPage';
import TextChatPage from './Text Chat/textChatPage';
import Dashboard from './Data Analytics/dashboard';
import TabLayout from './Navigation/tabs';



function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<TabLayout />}>
            <Route path="/textchat" element={<TextChatPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<LoginPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
