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

// CORS middleware riêng cho payment callbacks (cho phép tất cả origins vì đã có MAC verification)
const paymentCallbackCors = cors({
    origin: '*', // Cho phép tất cả origins cho payment callbacks
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Requested-With'],
    credentials: false, // Không cần credentials cho callback
});

// CORS middleware với logic linh hoạt cho các routes khác
const mainCors = cors({
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
});

// Middleware để log tất cả requests đến payment callback
app.use('/api/payment-callback', (req, res, next) => {
    console.log('\n📥 === Payment Callback Middleware ===');
    console.log('Time:', new Date().toISOString());
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('URL:', req.url);
    console.log('Original URL:', req.originalUrl);
    console.log('IP:', req.ip || req.connection.remoteAddress);
    console.log('User-Agent:', req.headers['user-agent']);
    console.log('Origin:', req.headers.origin);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('=====================================\n');
    next();
});

// Áp dụng CORS riêng cho payment callback endpoints
app.use('/api/payment-callback', paymentCallbackCors);

// Áp dụng CORS chính cho các routes khác
app.use(mainCors);
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

// Health check endpoint để test callback URL có accessible không
app.get('/api/payment-callback/zalopay', (req, res) => {
    console.log('✅ Health check: Callback endpoint is accessible');
    res.json({ 
        message: 'Callback endpoint is accessible',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        backendUrl: process.env.BACKEND_URL
    });
});

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