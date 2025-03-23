import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react'; 

const InputField = () => {
  const [message, setMessage] = useState('');

  return (
    <div style={styles.container}>
      <div style={styles.inputField}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
          placeholder="Type a message"
        />
        <button style={styles.button}>
          <ArrowUp size={18} strokeWidth={3} color="white" />
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginTop: '10px',
    position: 'sticky',
    zIndex: 1,
    marginBottom: '20px'
  },
  inputField: {
    display: 'flex',
    alignItems: 'center',
    border: '2px solid #000',
    borderRadius: '25px',
    padding: '6px', 
    width: '80%',
    maxWidth: '600px',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    padding: '8px', 
    fontSize: '16px',
    borderRadius: '20px',
  },
  button: {
    width: '32px', 
    height: '32px', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    marginLeft: '8px',
  },
};

export default InputField;
