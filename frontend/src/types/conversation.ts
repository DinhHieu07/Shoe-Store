export interface Conversation {
    userId: string;
    userName: string;
    userAvatar?: string;
    lastMessage: string;
    lastMessageTime: Date | string;
    unreadCount: number;
}