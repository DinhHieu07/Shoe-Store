require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db.js');
const { connectRedis } = require('./config/redis.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/route.js');
const http = require('http');
const { Server } = require('socket.io');
const chatSocket = require('./socket/chatSocket.js');

const app = express();

// CORS middleware với logic linh hoạt
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://dinhduchieu.id.vn',
            'https://dinhduchieu.id.vn/',
            'http://localhost:3000',
            'http://localhost:3000/',
            process.env.FRONTEND_URL,
            process.env.FRONTEND_URL?.replace(/\/$/, ''), // Remove trailing slash
        ].filter(Boolean);

        // Cho phép requests không có origin (mobile apps, Postman, etc)
        if (!origin) return callback(null, true);
        
        // Kiểm tra origin có trong danh sách cho phép không
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('❌ CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Connect to MongoDB
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            const allowedOrigins = [
                'https://dinhduchieu.id.vn',
                'https://dinhduchieu.id.vn/',
                'http://localhost:3000',
                'http://localhost:3000/',
                process.env.FRONTEND_URL,
                process.env.FRONTEND_URL?.replace(/\/$/, ''), // Remove trailing slash
            ].filter(Boolean);
            
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.log('❌ Socket.io CORS blocked origin:', origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    },
    // Cho phép fallback sang polling nếu WebSocket không hoạt động
    transports: ['websocket', 'polling'],
    allowEIO3: true,
});
chatSocket(io);

app.use('/api', routes);

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await connectRedis();
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
})();