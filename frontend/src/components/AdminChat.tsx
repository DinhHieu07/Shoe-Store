'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/AdminChat.module.css';
import { Message } from '@/types/message';
import { Conversation } from '@/types/conversation';
import { getConversations, getMessagesWithUser, markConversationAsRead } from '@/services/apiMessage';
import { io, Socket } from 'socket.io-client';
import Toast from './Toast';

export default function AdminChat() {
    const router = useRouter();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [avatar, setAvatar] = useState<string>('');
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
    } | null>(null);
    const [role, setRole] = useState<'admin' | 'customer' | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const customer = localStorage.getItem('customer');
        if (!customer) {
            setToast({ message: 'Vui lòng đăng nhập để tiếp tục', type: 'error' });
            router.replace('/login');
            return;
        }

        try {
            const customerData = JSON.parse(customer);
            const userRole = customerData?.role;
            setRole(userRole);

            if (userRole !== 'admin') {
                setToast({ message: 'Bạn không có quyền truy cập trang này', type: 'error' });
                setTimeout(() => {
                    router.replace('/');
                }, 3000);
                return;
            }

            // Chỉ load conversations và khởi tạo socket nếu là admin
            loadConversations();
            
            const currentUserId = getCurrentUserId();
            if (!currentUserId) {
                return;
            }

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
        } catch (error) {
            console.error('Lỗi khi parse customer data:', error);
            setToast({ message: 'Lỗi khi kiểm tra quyền truy cập', type: 'error' });
            router.replace('/login');
        }
    }, [router]);

    useEffect(() => {
        if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            container.scrollTo({
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const loadConversations = async () => {
        try {
            const data = await getConversations();
            setConversations(data.conversations);
        } catch (error) {
            console.error('Lỗi khi tải danh sách cuộc trò chuyện:', error);
        }
    };

    const loadMessages = async (userId: string) => {
        setIsLoadingMessages(true);
        try {
            const data = await getMessagesWithUser(userId);
            console.log(data);
            setMessages(data.messages);
            setAvatar(data.userAvatar);
            await markConversationAsRead(userId);
            await loadConversations();
        } catch (error) {
            console.error('Lỗi khi tải tin nhắn:', error);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    const handleSelectConversation = (userId: string) => {
        setSelectedUserId(userId);
        loadMessages(userId);
        setMessages([]);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !selectedUserId || isLoading) return;
        if (socketRef.current) {
            const newMessage: Message = {
                senderId: currentUserId,
                receiverId: selectedUserId,
                senderName: 'Admin',
                content: inputValue.trim(),
                timestamp: new Date().toISOString(),
            };
            socketRef.current.emit("sendMessageFromAdmin", newMessage);
            setMessages((prev) => [...prev, newMessage]);
            setInputValue('');
        }
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

    const formatDate = (timestamp: Date | string) => {
        try {
            const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
            const now = new Date();
            const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

            if (diffInDays === 0) {
                return 'Hôm nay';
            } else if (diffInDays === 1) {
                return 'Hôm qua';
            } else if (diffInDays < 7) {
                return `${diffInDays} ngày trước`;
            } else {
                return date.toLocaleDateString('vi-VN');
            }
        } catch {
            return '';
        }
    };

    const getCurrentUserId = () => {
        if (typeof window === 'undefined') return null;
        const customer = localStorage.getItem('customer');
        if (customer) {
            try {
                return JSON.parse(customer)._id;
            } catch {
                return null;
            }
        }
        return null;
    };

    const currentUserId = getCurrentUserId();

    if (role !== 'admin') {
        return (
            <div className={styles.accessDeniedContainer}>
                <div className={styles.accessDeniedCard}>
                    <p className={styles.accessDeniedText}>Bạn không có quyền truy cập trang này.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.adminChatContainer}>
            <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>Tin nhắn</h2>
                </div>
                <div className={styles.conversationsList}>
                    {conversations.length === 0 ? (
                        <div className={styles.emptyConversations}>
                            <i className="bx bx-message"></i>
                            <p>Chưa có cuộc trò chuyện nào</p>
                        </div>
                    ) : (
                        conversations.map((conv) => (
                            <div
                                key={conv.userId}
                                className={`${styles.conversationItem} ${selectedUserId === conv.userId ? styles.active : ''}`}
                                onClick={() => handleSelectConversation(conv.userId)}
                            >
                                <div className={styles.conversationAvatar}>
                                    <img className={styles.conversationAvatarImg} src={conv.userAvatar} alt={conv.userName} />
                                </div>
                                <div className={styles.conversationInfo}>
                                    <div className={styles.conversationHeader}>
                                        <span className={styles.conversationName}>{conv.userName}</span>
                                        <span className={styles.conversationTime}>{formatDate(conv.lastMessageTime)}</span>
                                    </div>
                                    <div className={styles.conversationPreview}>
                                        <span className={styles.lastMessage}>{conv.lastMessage}</span>
                                        {conv.unreadCount > 0 && (
                                            <span className={styles.unreadBadge}>{conv.unreadCount}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className={styles.chatArea}>
                {!selectedUserId ? (
                    <div className={styles.noSelection}>
                        <i className="bx bx-message-rounded"></i>
                        <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.chatHeader}>
                            <div className={styles.chatHeaderInfo}>
                                <div className={styles.chatHeaderAvatar}>
                                    <img className={styles.chatHeaderAvatarImg} src={avatar || 'https://placehold.co/600x400'} alt='Avatar'/>
                                </div>
                                <div>
                                    <h3>{conversations.find(c => c.userId === selectedUserId)?.userName || 'Khách hàng'}</h3>
                                </div>
                            </div>
                        </div>

                        <div className={styles.messagesContainer}>
                            {isLoadingMessages ? (
                                <div className={styles.loadingState}>
                                    <div className={styles.spinner}></div>
                                    <p>Đang tải tin nhắn...</p>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <i className="bx bx-message-rounded-dots"></i>
                                    <p>Chưa có tin nhắn nào</p>
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
                                                        <img className={styles.messageAvatarImg} src={avatar} alt={msg.senderName} />
                                                    </div>
                                                )}
                                                {!showAvatar && !isOwn && <div className={styles.messageAvatarPlaceholder}></div>}
                                                <div className={styles.messageContent}>
                                                    {!isOwn && showAvatar && (
                                                        <div className={styles.senderName}>{msg.senderName || 'Khách hàng'}</div>
                                                    )}
                                                    <div className={`${styles.messageBubble} ${isOwn ? styles.ownBubble : ''}`}>
                                                        <div className={styles.messageText}>{msg.content}</div>
                                                        <div className={styles.messageTime}>{formatTime(msg.timestamp)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesContainerRef}/>
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
                            <button
                                type="submit"
                                className={styles.sendButton}
                                disabled={!inputValue.trim() || isLoading}
                                title="Gửi tin nhắn"
                            >
                                <i className="bx bx-send"></i>
                            </button>
                        </form>
                    </>
                )}
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

