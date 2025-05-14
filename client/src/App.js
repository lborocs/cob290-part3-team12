import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './Log In/LoginPage';
import TextChatPage from './Text Chat/textChatPage';
import Dashboard from './Data Analytics/dashboard';
import TabLayout from './Navigation/tabs';
import TeamDashboard from './Team Analytics Page/dashboard.jsx';
import CreateAccount from './Create Account/createAccount.jsx';




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
          <Route path="/teamDash" element={<TeamDashboard />} />
          <Route path ="/createAccount" element={<CreateAccount />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
