import './App.css';
import TextChat from './Text Chat/messages';
import React from 'react';
import ChatsColumn from './Text Chat/chatsColumn';
import TextChatPage from './Text Chat/textChatPage';
import Dashboard from './Data Analytics/dashboard';


function App() {
  return (
    <div className="App">
      <Dashboard />
      {/* <TextChatPage/>  */}
      
    </div>
  );
}

export default App;
