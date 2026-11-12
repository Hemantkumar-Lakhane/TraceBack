import api from './axiosConfig';
import { MOCK_CONVERSATIONS } from './mockData';
import wsManager from './websocketClient';
import { getItemImageUrl } from '../utils/imageUtils';

const isDemo = () => localStorage.getItem('tb_is_demo_session') === 'true';

export const getCampusAvatar = (name = '', role = '') => {
  const lower = (name || '').toLowerCase();
  if (lower.includes('rohan')) {
    return 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80';
  }
  if (lower.includes('ananya')) {
    return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';
  }
  if (lower.includes('rajesh') || role === 'SECURITY') {
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
  }
  if (lower.includes('priya') || role === 'ADMIN') {
    return 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
  }
  if (lower.includes('aarav')) {
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80';
};

export const getConversations = async (currentUserId) => {
  if (isDemo()) {
    return MOCK_CONVERSATIONS;
  }

  try {
    const response = await api.get('/api/conversations');
    const rawList = response.data || [];

    // Enrich conversations with real participant info, item names, and last message from MySQL
    const enriched = await Promise.all(rawList.map(async (c) => {
      let lastMsg = null;
      let messageCount = 0;
      try {
        const msgRes = await api.get(`/api/conversations/${c.id}/messages`);
        const msgs = msgRes.data || [];
        messageCount = msgs.length;
        if (msgs.length > 0) {
          lastMsg = msgs[msgs.length - 1];
        }
      } catch (err) {
        console.warn(`Failed to fetch messages for conv #${c.id}`, err);
      }

      const match = c.matchRecord;
      const lostUser = match?.lostReport?.user;
      const foundUser = match?.foundReport?.user;

      // Determine who the other person is relative to current user
      let other = foundUser;
      if (currentUserId && String(foundUser?.id) === String(currentUserId)) {
        other = lostUser;
      } else if (!currentUserId && lostUser?.email?.includes('aarav')) {
        other = foundUser;
      }

      const item = match?.lostReport?.item || match?.foundReport?.item;

      return {
        id: c.id,
        matchId: match?.id || 1,
        itemName: item?.name || 'Space Gray MacBook Pro 14"',
        itemCategory: item?.category || 'ELECTRONICS',
        itemImageUrl: getItemImageUrl(item, true),
        otherParticipant: {
          id: other?.id || 2,
          name: other?.name || 'Rohan Verma',
          email: other?.email || 'rohan.verma@campus.edu',
          role: other?.role === 'STUDENT' ? 'Student Finder' : other?.role === 'SECURITY' ? 'Security Vault Desk' : 'Campus Member',
          avatar: other?.avatar || getCampusAvatar(other?.name, other?.role)
        },
        lastMessage: lastMsg?.content || 'No messages yet',
        lastMessageTime: lastMsg?.timestamp || c.createdAt,
        unreadCount: 0,
        messageCount: messageCount
      };
    }));

    return enriched;
  } catch (error) {
    console.error("Failed to load real conversations from backend, falling back to mock data", error);
    return MOCK_CONVERSATIONS;
  }
};

export const getConversationById = async (id, currentUserId) => {
  if (isDemo()) {
    const list = MOCK_CONVERSATIONS;
    return list.find(c => String(c.id) === String(id)) || list[0];
  }

  try {
    const [msgRes, convsRes] = await Promise.all([
      api.get(`/api/conversations/${id}/messages`),
      api.get('/api/conversations')
    ]);

    const messages = msgRes.data || [];
    const foundConv = (convsRes.data || []).find(c => String(c.id) === String(id));

    const match = foundConv?.matchRecord;
    const lostUser = match?.lostReport?.user;
    const foundUser = match?.foundReport?.user;

    let other = foundUser;
    if (currentUserId && String(foundUser?.id) === String(currentUserId)) {
      other = lostUser;
    }

    const item = match?.lostReport?.item || match?.foundReport?.item;

    const formattedMessages = messages.map(m => {
      const isMe = currentUserId
        ? String(m.sender?.id) === String(currentUserId)
        : m.sender?.email?.includes('aarav') || m.sender?.id === 1;

      return {
        id: m.id,
        content: m.content,
        text: m.content,
        timestamp: m.timestamp,
        senderId: m.sender?.id,
        senderName: m.sender?.name,
        isMe: isMe
      };
    });

    return {
      id: Number(id),
      matchId: match?.id || 1,
      itemName: item?.name || 'Space Gray MacBook Pro 14"',
      itemCategory: item?.category || 'ELECTRONICS',
      itemImageUrl: getItemImageUrl(item, true),
      otherParticipant: {
        id: other?.id || 2,
        name: other?.name || 'Rohan Verma',
        email: other?.email || 'rohan.verma@campus.edu',
        role: other?.role === 'STUDENT' ? 'Student Finder' : other?.role === 'SECURITY' ? 'Security Vault Desk' : 'Campus Member',
        avatar: other?.avatar || getCampusAvatar(other?.name, other?.role)
      },
      messages: formattedMessages
    };
  } catch (error) {
    console.error(`Failed to load messages for conversation #${id}`, error);
    const list = MOCK_CONVERSATIONS;
    return list.find(c => String(c.id) === String(id)) || list[0];
  }
};

/**
 * Send a message via Spring Boot REST API
 * Spring Boot persists the message in MySQL and automatically broadcasts
 * to all active STOMP WebSocket subscribers on /topic/chat/{conversationId}
 */
export const sendMessage = async (conversationId, text, senderId, senderName) => {
  if (isDemo()) {
    return {
      id: Date.now(),
      content: text,
      text,
      timestamp: new Date().toISOString(),
      isMe: true,
      senderName: senderName || 'You'
    };
  }

  const response = await api.post(`/api/conversations/${conversationId}/messages`, { content: text });
  const saved = response.data;

  return {
    id: saved.id,
    content: saved.content,
    text: saved.content,
    timestamp: saved.timestamp,
    senderId: saved.sender?.id || senderId,
    senderName: saved.sender?.name || senderName || 'You',
    isMe: true
  };
};

export const subscribeToChat = (conversationId, onMessageReceived) => {
  if (isDemo()) return null;
  return wsManager.subscribe(`/topic/chat/${conversationId}`, onMessageReceived);
};

export default {
  getConversations,
  getConversationById,
  sendMessage,
  subscribeToChat,
  getCampusAvatar
};
