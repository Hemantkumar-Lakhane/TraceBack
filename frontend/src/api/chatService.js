import api from './axiosConfig';
import { MOCK_CONVERSATIONS } from './mockData';
import wsManager from './websocketClient';

const isDemo = () => localStorage.getItem('tb_is_demo_session') === 'true';

export const getConversations = async () => {
  if (isDemo()) {
    return MOCK_CONVERSATIONS;
  }
  const response = await api.get('/api/conversations');
  return response.data || [];
};

export const getConversationById = async (id) => {
  if (isDemo()) {
    const list = MOCK_CONVERSATIONS;
    return list.find(c => String(c.id) === String(id)) || list[0];
  }
  const response = await api.get(`/api/conversations/${id}/messages`);
  return { id, messages: response.data || [] };
};

export const sendMessage = async (conversationId, text, senderId) => {
  if (isDemo()) {
    return {
      id: Date.now(),
      text,
      timestamp: new Date().toISOString(),
      isMe: true
    };
  }

  // Attempt STOMP WebSocket transmission first
  const wsSent = await wsManager.send(`/app/chat/${conversationId}`, {
    content: text,
    senderId: senderId
  });

  if (wsSent) {
    return {
      id: Date.now(),
      content: text,
      timestamp: new Date().toISOString()
    };
  }

  // Fallback to HTTP REST endpoint
  const response = await api.post(`/api/conversations/${conversationId}/messages`, { content: text });
  return response.data;
};

export const subscribeToChat = (conversationId, onMessageReceived) => {
  if (isDemo()) return null;
  return wsManager.subscribe(`/topic/chat/${conversationId}`, onMessageReceived);
};

export default {
  getConversations,
  getConversationById,
  sendMessage,
  subscribeToChat
};
