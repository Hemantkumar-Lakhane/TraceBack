import api from './axiosConfig';
import { MOCK_CONVERSATIONS } from './mockData';

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

export const sendMessage = async (conversationId, text) => {
  if (isDemo()) {
    return {
      id: Date.now(),
      text,
      timestamp: new Date().toISOString(),
      isMe: true
    };
  }
  const response = await api.post(`/api/conversations/${conversationId}/messages`, { content: text });
  return response.data;
};

export default {
  getConversations,
  getConversationById,
  sendMessage
};
