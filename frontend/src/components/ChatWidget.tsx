'use client';
import { useState, useEffect, useRef } from 'react';
import styles from '@/styles/ChatWidget.module.css';
import { getMessages } from '@/services/apiMessage';
import { Message } from '@/types/message';
import { io, Socket } from 'socket.io-client';

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const checkLogin = () => {
            const customer = localStorage.getItem('customer');
            if (customer) {
                try {
                    const customerData = JSON.parse(customer);
                    setIsLoggedIn(true);
                    if (customerData.role === 'admin') {
                        setIsAdmin(true);
                    }
                    setCurrentUserId(customerData._id);
                    return customerData;
                } catch {
                    setIsLoggedIn(false);
                    setCurrentUserId(null);
                    return null;
                }
            } else {
                setIsLoggedIn(false);
                setCurrentUserId(null);
                return null;
            }
        };
        
        const customerData = checkLogin();
        if (customerData && customerData._id) {
            const loadMessages = async () => {
                try {
                    const data = await getMessages();
                    setMessages(data.messages || []);
                } catch (error) {
                    console.error('Lỗi khi tải tin nhắn:', error);
                }
            };
            loadMessages();
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!isLoggedIn || !currentUserId) return;

        // Tạo socket connection
        const socket = io(process.env.NEXT_PUBLIC_API_URL, {
            transports: ['websocket', 'polling'],
            withCredentials: true,
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            socket.emit("addUser", currentUserId);
        });

        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return () => {
            socket.off("receiveMessage");
            socket.off("connect");
            socket.off("disconnect");
            socket.off("connect_error");
            socket.disconnect();
            socketRef.current = null;
        };
    }, [isLoggedIn, currentUserId]);

    useEffect(() => {
        if (isOpen && isLoggedIn && messages.length > 0) {
            markAsRead();
            setUnreadCount(0);
        }
    }, [isOpen, isLoggedIn, messages.length]);

    useEffect(() => {
        if (isOpen && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    if (!isLoggedIn) return null;

    // Admin không hiển thị widget chat, sẽ dùng trang riêng
    if (isAdmin) return null;

    const markAsRead = async () => {
        if (socketRef.current) {
            socketRef.current.emit("markAsRead", currentUserId);
        }
        setUnreadCount(0);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !currentUserId || !socketRef.current) return;

        let senderName = 'Khách hàng';
        if (typeof window !== 'undefined') {
            const customer = localStorage.getItem('customer');
            if (customer) {
                try {
                    const customerData = JSON.parse(customer);
                    senderName = customerData.fullname || 'Khách hàng';
                } catch {
                    // Giữ giá trị mặc định
                }
            }
        }

        const newMessage: Message = {
            senderId: currentUserId,
            receiverId: "admin",
            senderName: senderName,
            content: inputValue.trim(),
            timestamp: new Date().toISOString(),
        };
        socketRef.current.emit("sendMessage", newMessage);
        setMessages((prev) => [...prev, newMessage]);
        setInputValue('');
    };

    const formatTime = (timestamp: Date | string) => {
        try {
            const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        } catch {
            return '';
        }
    };

    return (
        <div className={styles.chatContainer}>
            <button className={styles.chatButton} onClick={() => setIsOpen(!isOpen)} aria-label="Mở chat" title="Mở chat">
                <i className="bx bx-message-rounded"></i>
                {unreadCount > 0 && (
                    <span className={styles.badge} aria-label={`${unreadCount} tin nhắn chưa đọc`}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.chatHeader}>
                        <div className={styles.headerInfo}>
                            <div className={styles.headerAvatar}>
                                <i className="bx bx-support"></i>
                            </div>
                            <div>
                                <h3>Hỗ trợ khách hàng</h3>
                                <p>Chúng tôi sẽ phản hồi sớm nhất</p>
                            </div>
                        </div>
                        <button className={styles.closeBtn} onClick={() => setIsOpen(false)} title="Đóng chat" aria-label="Đóng chat">
                            <i className="bx bx-x"></i>
                        </button>
                    </div>

                    <div className={styles.messagesContainer}>
                        {isLoading && messages.length === 0 ? (
                            <div className={styles.loadingState}>
                                <div className={styles.spinner}></div>
                                <p>Đang tải tin nhắn...</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>
                                    <i className="bx bx-message-rounded-dots"></i>
                                </div>
                                <p className={styles.emptyTitle}>Chưa có tin nhắn nào</p>
                                <p className={styles.emptySubtitle}>Hãy bắt đầu cuộc trò chuyện với chúng tôi!</p>
                            </div>
                        ) : (
                            <div className={styles.messagesList}>
                                {messages.map((msg, index) => {
                                    const isOwn = msg.senderId === currentUserId;
                                    const showAvatar = !isOwn && (index === 0 || messages[index - 1].senderId !== msg.senderId);
                                    return (
                                        <div key={msg._id || index} className={`${styles.messageItem} ${isOwn ? styles.ownMessage : ''}`}>
                                            {showAvatar && (
                                                <div className={styles.messageAvatar}>
                                                    <i className="bx bx-user"></i>
                                                </div>
                                            )}
                                            {!showAvatar && !isOwn && <div className={styles.messageAvatarPlaceholder}></div>}
                                            <div className={styles.messageContent}>
                                                {!isOwn && showAvatar && (
                                                    <div className={styles.senderName}>{msg.senderName || 'Admin'}</div>
                                                )}
                                                <div className={`${styles.messageBubble} ${isOwn ? styles.ownBubble : ''}`}>
                                                    <div className={styles.messageText}>{msg.content}</div>
                                                    <div className={styles.messageTime}>{formatTime(msg.timestamp)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    <form className={styles.inputForm} onSubmit={handleSend}>
                        <input
                            type="text"
                            className={styles.messageInput}
                            placeholder="Nhập tin nhắn..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" className={styles.sendButton} disabled={!inputValue.trim() || isLoading} title="Gửi tin nhắn" aria-label="Gửi tin nhắn">
                            <i className="bx bx-send"></i>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

