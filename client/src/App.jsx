import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './components/Login';
import Chat from './components/Chat';
import './App.css';
import './DarkModeToggle.css';

const socket = io('http://localhost:3000');

function App() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [room, setRoom] = useState('general');
  const [joined, setJoined] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    if (username && joined) {
      socket.emit('join room', { username, room });
    }
  }, [username, room, joined]);

  const handleLogin = (name) => {
    setUsername(name);
    localStorage.setItem('username', name);
    setJoined(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername('');
    setJoined(false);
    socket.disconnect();
    socket.connect();
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', newMode);
      return newMode;
    });
  };

  return (
    <div className="app-container">
      {!joined ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Chat
          socket={socket}
          username={username}
          room={room}
          setRoom={setRoom}
          onLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
    </div>
  );
}

export default App;
