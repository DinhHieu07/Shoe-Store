const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

const getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
        }).sort({ createdAt: 1 });
        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lấy tin nhắn thất bại" });
    }
}   

const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversations = await Conversation.find();
        res.status(200).json({ success: true, conversations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lấy danh sách cuộc trò chuyện thất bại" });
    }
}

const getMessagesWithUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
        }
        const avatar = user.avatar;
        const messages = await Message.find({ $or: [{ senderId: userId }, { receiverId: userId }] });
        res.status(200).json({ success: true, messages, userAvatar: avatar });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Lấy tin nhắn với người dùng thất bại" });
    }
}

const markConversationAsRead = async (req, res) => {
    try {
        const userId = req.params.userId;
        await Conversation.updateOne({ userId: userId }, { $set: { unreadCount: 0 } });
        res.status(200).json({ success: true, message: "Đánh dấu cuộc trò chuyện đã đọc thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Đánh dấu cuộc trò chuyện đã đọc thất bại" });
    }
}

module.exports = { getMessages, getConversations, getMessagesWithUser, markConversationAsRead };