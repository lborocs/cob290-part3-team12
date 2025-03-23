import './App.css';
import TextChat from './Text Chat/messages';
import React from 'react';
import ChatsColumn from './Text Chat/chatsColumn';



function App() {
  return (
    <div className="App">
     <TextChat/>
      <ChatsColumn/>
    </div>
  );
}

export default App;
