import React, { useEffect, useRef } from 'react';

function MessageList({ messages, username }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="message-list">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`message ${msg.sender === username ? 'own' : ''} ${msg.sender === 'System' ? 'system' : ''}`}
                >
                    {msg.sender !== 'System' && <div className="message-sender">{msg.sender}</div>}
                    <div className="message-content">
                        {msg.type === 'image' ? (
                            <img src={`http://localhost:3000${msg.content}`} alt="Shared" className="shared-image" />
                        ) : (
                            <p>{msg.content}</p>
                        )}
                        <span className="message-time">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default MessageList;
