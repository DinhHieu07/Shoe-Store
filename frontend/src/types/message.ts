export interface Message {
    _id?: string;
    senderId: string;
    receiverId: string;
    senderName: string;
    content: string;
    timestamp: Date | string;
    isRead?: boolean;
}