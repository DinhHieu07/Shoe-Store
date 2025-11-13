const Message = require('../models/Message');
const User = require('../models/User');
const Conversation = require('../models/Conversation');

const onlineUsers = new Map();

const chatSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("🔗 New connection:", socket.id);

        socket.on("addUser", async (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log("✅ User online:", userId);
        });

        socket.on("sendMessage", async ({ senderId, receiverId, senderName, content, timestamp }) => {
            if (receiverId === "admin") {
                const admin = await User.findOne({ role: "admin" });
                if (!admin) {
                    console.log("❌ Admin not found");
                    return;
                }
                receiverId = admin._id.toString();
            }

            const conversation = await Conversation.findOne({ userId: senderId });
            if (!conversation) {
                const user = await User.findById(senderId);
                if (!user) {
                    console.log("❌ User not found");
                    return;
                }
                const newConversation = new Conversation({ userId: senderId, userName: user.fullname, userAvatar: user.avatar, lastMessage: content, lastMessageTime: new Date(), unreadCount: 1 });
                await newConversation.save();
            }
            
            const newMessage = new Message({ 
                senderId, 
                receiverId, 
                senderName: senderName || 'Khách hàng',
                content,
                timestamp: timestamp ? new Date(timestamp) : new Date()
            });
            await newMessage.save();

            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receiveMessage", newMessage);
            }
        });

        socket.on("sendMessageFromAdmin", async ({ senderId, receiverId, senderName, content, timestamp }) => {
            const newMessage = new Message({ 
                senderId, 
                receiverId, 
                senderName: senderName || 'Admin',
                content,
                timestamp: timestamp ? new Date(timestamp) : new Date()
            });
            await newMessage.save();
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receiveMessage", newMessage);
            }
        });

        socket.on("markAsRead", async (userId) => {
            await Message.updateMany({ receiverId: userId }, { isRead: true });
        });

        socket.on("disconnect", () => {
            for (let [userId, socketId] of onlineUsers) {
                if (socketId === socket.id) onlineUsers.delete(userId);
            }
            console.log("❌ User disconnected:", socket.id);
        });
    });
}

module.exports = chatSocket;