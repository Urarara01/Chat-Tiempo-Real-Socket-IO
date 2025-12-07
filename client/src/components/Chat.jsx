import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

function Chat({ socket, username, room, setRoom, onLogout }) {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [typingUser, setTypingUser] = useState('');

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on('load history', (history) => {
            setMessages(history);
        });

        socket.on('room users', (roomUsers) => {
            setUsers(roomUsers);
        });

        socket.on('typing', (user) => {
            setTypingUser(user);
            setTimeout(() => setTypingUser(''), 3000);
        });

        return () => {
            socket.off('message');
            socket.off('load history');
            socket.off('room users');
            socket.off('typing');
        };
    }, [socket]);

    // Clear messages when switching rooms (optional, or handle via history load)
    useEffect(() => {
        setMessages([]);
    }, [room]);

    return (
        <div className="chat-container">
            <Sidebar
                room={room}
                setRoom={setRoom}
                users={users}
                username={username}
                onLogout={onLogout}
            />
            <div className="chat-main">
                <div className="chat-header">
                    <h3>#{room}</h3>
                    <span className="user-count">{users.length} users online</span>
                </div>
                <MessageList messages={messages} username={username} />
                {typingUser && <div className="typing-indicator">{typingUser} is typing...</div>}
                <MessageInput socket={socket} />
            </div>
        </div>
    );
}

export default Chat;
