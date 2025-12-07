const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const db = require('./database');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

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
        socket.join(room);
        socket.username = username;
        socket.room = room;

        if (!users[room]) users[room] = [];
        users[room].push(username);

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

        db.run(`INSERT INTO messages (content, type, sender, room) VALUES (?, ?, ?, ?)`,
            [messageData.content, messageData.type, messageData.sender, messageData.room],
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
