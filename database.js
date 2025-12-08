const sqlite3 = require('sqlite3').verbose(); // Importa el módulo sqlite3 
const db = new sqlite3.Database('./chat.db'); // Crea una base de datos SQLite

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    type TEXT,
    sender TEXT,
    room TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
}); // Crea una tabla de mensajes si no existe

module.exports = db;
