import React, { useState } from 'react';
import axios from 'axios';

function MessageInput({ socket }) {
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleTyping = () => {
        socket.emit('typing');
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                setPreview(null);
            }
        }
    };

    const handlePaste = (e) => {
        const pastedFile = e.clipboardData.files[0];
        if (pastedFile) {
            e.preventDefault();
            setFile(pastedFile);
            if (pastedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(pastedFile);
            } else {
                setPreview(null);
            }
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
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
                    type: 'image'
                });
                clearFile();
            } catch (err) {
                console.error(err);
            }
        } else if (message.trim()) {
            socket.emit('chat message', { content: message, type: 'text' });
            setMessage('');
        }
    };

    return (
        <div className="input-container">
            {file && (
                <div className="file-preview">
                    {preview ? (
                        <img src={preview} alt="Preview" className="preview-image" />
                    ) : (
                        <div className="file-info">📄 {file.name}</div>
                    )}
                    <button className="remove-file-btn" onClick={clearFile}>×</button>
                </div>
            )}
            <form className="message-input" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleTyping}
                    onPaste={handlePaste}
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
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

export default MessageInput;
