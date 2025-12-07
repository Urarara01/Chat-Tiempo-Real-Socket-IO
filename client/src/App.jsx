import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Login from './components/Login';
import Chat from './components/Chat';
import './App.css';

const socket = io('http://localhost:3000');

function App() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [room, setRoom] = useState('general');
  const [joined, setJoined] = useState(false);

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
        />
      )}
    </div>
  );
}

export default App;
