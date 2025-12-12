import React from 'react';

function Sidebar({ room, setRoom, users, username, onLogout, darkMode, toggleDarkMode }) {
    const rooms = ['general', 'off-topic', 'soporte', 'random'];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div>
                    <h3>Chat</h3>
                    <div className='dark-mode-container'>
                        <input
                            type="checkbox"
                            className="theme-checkbox"
                            id="dark-mode-toggle"
                            checked={darkMode || false}
                            onChange={toggleDarkMode}
                        />
                        <label htmlFor="dark-mode-toggle" className="toggle"></label>
                    </div>
                </div>
                <p>Logueado como: <strong>{username}</strong></p>
            </div>

            <div className="sidebar-section">
                <h4>Salas</h4>
                <ul>
                    {rooms.map((r) => (
                        <li
                            key={r}
                            className={room === r ? 'active' : ''}
                            onClick={() => setRoom(r)}
                        >
                            # {r}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="sidebar-section">
                <h4>Usuarios</h4>
                <ul>
                    {users.map((u, index) => (
                        <li key={index} className={u === username ? 'me' : ''}>
                            {u} {u === username && '(Tú)'}
                        </li>
                    ))}
                </ul>
            </div>

            <button className="logout-btn" onClick={onLogout}>Cerrar sesión</button>
        </div>
    );
}

export default Sidebar;
