import React, { useState } from 'react';

function Login({ onLogin }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onLogin(name);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Welcome to Chat</h2>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                />
                <button type="submit">Unirse al chat</button>
            </form>
        </div>
    );
}

export default Login;
