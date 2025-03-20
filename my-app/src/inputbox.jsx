import React, { useState } from 'react';

const InputField = () => {
  const [message, setMessage] = useState('');

  return (
    <div style={styles.inputField}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={styles.input}
        placeholder="Type a message"
      />
      <button style={styles.button}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="bi bi-send"
          viewBox="0 0 16 16"
        >
          <path d="M15.5 0.5a.5.5 0 0 0-.5.5v10.708L3.707 4.707a1 1 0 0 0-1.414 1.414l10 10a1 1 0 0 0 1.414-1.414L12.207 9H3.5a.5.5 0 0 0-.5.5v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V9a.5.5 0 0 0-.5-.5H6.793l9.707-9.707a.5.5 0 0 0-.707-.707z"/>
        </svg>
      </button>
    </div>
  );
};

const styles = {
  inputField: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc',
  },
  input: {
    flex: 1,
    padding: '5px',
    marginRight: '10px',
  },
  button: {
    padding: '5px 10px',
    backgroundColor: '#007BFF', 
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
};

export default InputField;
