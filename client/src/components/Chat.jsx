import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function Chat({ socket, username, room, setRoom, onLogout, darkMode, toggleDarkMode }) {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [typingUser, setTypingUser] = useState('');

    const typingTimeoutRef = useRef(null);

    // Escuchar eventos del socket
    useEffect(() => {
        // Escuchar mensajes
        socket.on('message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        // Cargar historial de mensajes
        socket.on('load history', (history) => {
            setMessages(history);
        });

        // Escuchar usuarios en la sala
        socket.on('room users', (roomUsers) => {
            setUsers(roomUsers);
        });

        // Escuchar usuarios en la sala
        socket.on('typing', (user) => {
            setTypingUser(user);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setTypingUser(''), 1500);
        });

        // Limpiar eventos al desmontar el componente
        return () => {
            socket.off('message');
            socket.off('load history');
            socket.off('room users');
            socket.off('typing');
        };
    }, [socket]);

    // Limpiar mensajes al cambiar de sala
    useEffect(() => {
        setMessages([]);
    }, [room]);

    // Renderizar
    return (
        <div className="chat-container">
            <Sidebar
                room={room}
                setRoom={setRoom}
                users={users}
                username={username}
                onLogout={onLogout}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
            />
            <div className="chat-main">
                <div className="chat-header">
                    <h3>#{room}</h3>
                    <span className="user-count">{users.length} usuarios en línea</span>
                </div>
                <MessageList messages={messages} username={username} />
                {typingUser && <div className="typing-indicator">{typingUser} está escribiendo...</div>}
                <MessageInput socket={socket} />
            </div>
        </div>
    );
}

export default Chat;
