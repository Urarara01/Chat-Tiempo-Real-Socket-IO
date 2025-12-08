const express = require('express'); // Importa el módulo express
const app = express(); // Crea una aplicación express
const http = require('http'); // Importa el módulo http
const server = http.createServer(app); // Crea un servidor HTTP
const { Server } = require("socket.io"); // Importa el módulo socket.io
const cors = require('cors'); // Importa el módulo cors
const multer = require('multer'); // Importa el módulo multer
const path = require('path'); // Importa el módulo path
const db = require('./database'); // Importa el módulo database

app.use(cors()); // Permite peticiones cross-origin
app.use(express.json()); // Permite peticiones JSON
app.use('/uploads', express.static('uploads')); // Permite peticiones estáticas

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.post('/upload', upload.single('file'), (req, res) => {
    if (req.file) {
        res.json({ filePath: `/uploads/${req.file.filename}`, fileName: req.file.originalname, type: req.file.mimetype });
    } else {
        res.status(400).send('No file uploaded');
    }
});

const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for development
        methods: ["GET", "POST"]
    }
});

let users = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join room', ({ username, room }) => {
        // Leave previous room if any
        if (socket.room) {
            socket.leave(socket.room);
            if (users[socket.room]) {
                users[socket.room] = users[socket.room].filter(u => u !== socket.username);
                io.to(socket.room).emit('room users', users[socket.room]);
            }
        }

        socket.join(room);
        socket.username = username;
        socket.room = room;

        if (!users[room]) users[room] = [];

        // Prevent duplicates in the new room
        if (!users[room].includes(username)) {
            users[room].push(username);
        }

        io.to(room).emit('room users', users[room]);

        // Load history
        db.all("SELECT * FROM messages WHERE room = ? ORDER BY timestamp ASC", [room], (err, rows) => {
            if (err) return console.error(err.message);
            socket.emit('load history', rows);
        });

        socket.to(room).emit('message', {
            sender: 'System',
            content: `${username} has joined the chat`,
            type: 'text',
            timestamp: new Date()
        });
    });

    socket.on('chat message', (msg) => {
        const messageData = {
            content: msg.content,
            type: msg.type || 'text',
            sender: socket.username,
            room: socket.room,
            timestamp: new Date()
        };

        db.run(`INSERT INTO messages (content, type, sender, room, timestamp) VALUES (?, ?, ?, ?, ?)`,
            [messageData.content, messageData.type, messageData.sender, messageData.room, messageData.timestamp.toISOString()],
            function (err) {
                if (err) return console.error(err.message);
                io.to(socket.room).emit('message', messageData);
            });
    });

    socket.on('typing', () => {
        socket.to(socket.room).emit('typing', socket.username);
    });

    socket.on('disconnect', () => {
        if (socket.room && users[socket.room]) {
            users[socket.room] = users[socket.room].filter(u => u !== socket.username);
            io.to(socket.room).emit('room users', users[socket.room]);
            io.to(socket.room).emit('message', {
                sender: 'System',
                content: `${socket.username} has left the chat`,
                type: 'text',
                timestamp: new Date()
            });
        }
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
