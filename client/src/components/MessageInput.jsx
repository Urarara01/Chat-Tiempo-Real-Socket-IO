import React, { useState } from 'react';
import axios from 'axios';

function MessageInput({ socket }) {
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);

    const handleTyping = () => {
        socket.emit('typing');
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const res = await axios.post('http://localhost:3000/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                socket.emit('chat message', {
                    content: res.data.filePath,
                    type: 'image' // Simplified: assume images for now, can extend to files
                });
                setFile(null);
            } catch (err) {
                console.error(err);
            }
        } else if (message.trim()) {
            socket.emit('chat message', { content: message, type: 'text' });
            setMessage('');
        }
    };

    return (
        <form className="message-input" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleTyping}
            />
            <input
                type="file"
                id="file-upload"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*"
            />
            <label htmlFor="file-upload" className="file-btn">
                📷
            </label>
            <button type="submit">Send</button>
        </form>
    );
}

export default MessageInput;
