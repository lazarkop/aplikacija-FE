/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { AxiosResponse } from 'axios';
import axios from '../../axios';
import mongoose from 'mongoose';

export interface IReaction {
  senderName: string;
  type: string;
}

export interface IMessageData {
  _id: string | mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  receiverId: string;
  receiverUsername: string;
  receiverAvatarColor: string;
  receiverProfilePicture: string;
  senderUsername: string;
  senderId: string;
  senderAvatarColor: string;
  senderProfilePicture: string;
  body: string;
  isRead: boolean;
  gifUrl: string;
  selectedImage: string;
  reaction: IReaction[];
  createdAt: Date | string;
}

class ChatService {
  async getConversationList() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: AxiosResponse<IMessageData[], any> = await axios.get(
      '/chat/message/conversation-list'
    );
    return response;
  }

  async getChatMessages(receiverId) {
    const response = await axios.get(`/chat/message/user/${receiverId}`);
    return response;
  }

  async addChatUsers(body) {
    const response = await axios.post('/chat/message/add-chat-users', body);
    return response;
  }

  async removeChatUsers(body) {
    const response = await axios.post('/chat/message/remove-chat-users', body);
    return response;
  }

  async markMessagesAsRead(senderId, receiverId) {
    const response = await axios.put(`/chat/message/mark-as-read`, {
      senderId,
      receiverId,
    });
    return response;
  }

  async saveChatMessage(body) {
    const response = await axios.post('/chat/message', body);
    return response;
  }

  async updateMessageReaction(body) {
    const response = await axios.put('/chat/message/reaction', body);
    return response;
  }

  async markMessageAsDelete(messageId, senderId, receiverId, type) {
    const response = await axios.delete(
      `/chat/message/mark-as-deleted/${messageId}/${senderId}/${receiverId}/${type}`
    );
    return response;
  }
}

export const chatService = new ChatService();
