import React from 'react';

function Sidebar({ room, setRoom, users, username, onLogout }) {
    const rooms = ['general', 'off-topic', 'soporte', 'random'];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3>Chat App</h3>
                <p>Logged in as: <strong>{username}</strong></p>
            </div>

            <div className="sidebar-section">
                <h4>Rooms</h4>
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
                <h4>Users</h4>
                <ul>
                    {users.map((u, index) => (
                        <li key={index} className={u === username ? 'me' : ''}>
                            {u} {u === username && '(You)'}
                        </li>
                    ))}
                </ul>
            </div>

            <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
    );
}

export default Sidebar;
