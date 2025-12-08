import React from 'react';

function Sidebar({ room, setRoom, users, username, onLogout }) {
    const rooms = ['general', 'off-topic', 'soporte', 'random'];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3>Chat</h3>
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
                            {u} {u === username && '(You)'}
                        </li>
                    ))}
                </ul>
            </div>

            <button className="logout-btn" onClick={onLogout}>Cerrar sesión</button>
        </div>
    );
}

export default Sidebar;
