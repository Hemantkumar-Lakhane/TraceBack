import api from './axiosConfig.js';
import { MOCK_CONVERSATIONS, DEMO_USERS } from './mockData.js';
import wsManager from './websocketClient.js';
import { getItemImageUrl } from '../utils/imageUtils.js';

const isDemo = () => (typeof localStorage !== 'undefined' ? localStorage.getItem('tb_is_demo_session') === 'true' : true);

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

/**
 * Robust identity resolver: extracts user details regardless of whether
 * an object, ID, email string, or undefined is passed.
 */
export const resolveViewer = (viewerOrId) => {
  if (viewerOrId && typeof viewerOrId === 'object' && (viewerOrId.id || viewerOrId.name || viewerOrId.email)) {
    return viewerOrId;
  }
  if (viewerOrId !== undefined && viewerOrId !== null) {
    const s = String(viewerOrId).toLowerCase().trim();
    if (s === '2' || s.includes('rohan')) return DEMO_USERS.rohan;
    if (s === '1' || s.includes('aarav')) return DEMO_USERS.student;
    if (s === '3' || s.includes('rajesh') || s.includes('sec')) return DEMO_USERS.security;
    if (s === '4' || s.includes('priya') || s.includes('adm')) return DEMO_USERS.admin;
    if (s === '9' || s.includes('ananya')) return DEMO_USERS.ananya;
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('tb_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.id || parsed.name || parsed.email)) return parsed;
      }
    }
  } catch (e) {}
  return DEMO_USERS.student;
};

/**
 * Determines whether a chat message was authored by the current viewer
 * (outbound = right side with blue ticks, inbound = left side with sender name).
 */
export const isMessageFromViewer = (msg, viewerOrId) => {
  if (!msg) return false;
  const viewer = resolveViewer(viewerOrId);
  if (!viewer) return false;

  // 1. By numerical ID
  const viewerId = viewer.id !== undefined ? Number(viewer.id) : null;
  const msgSenderId = msg.senderId !== undefined
    ? Number(msg.senderId)
    : (msg.sender?.id !== undefined ? Number(msg.sender.id) : null);

  if (viewerId !== null && msgSenderId !== null && !isNaN(viewerId) && !isNaN(msgSenderId)) {
    return viewerId === msgSenderId;
  }

  // 2. By first name comparison (e.g. "Rohan" vs "Aarav")
  const viewerName = (viewer.name || '').toLowerCase().trim();
  const senderName = (msg.senderName || msg.sender?.name || '').toLowerCase().trim();
  if (viewerName && senderName) {
    const vFirst = viewerName.split(' ')[0];
    const sFirst = senderName.split(' ')[0];
    if (vFirst && sFirst && (vFirst === sFirst || viewerName.includes(sFirst) || senderName.includes(vFirst))) {
      return true;
    }
  }

  // 3. By email comparison
  const viewerEmail = (viewer.email || '').toLowerCase().trim();
  const senderEmail = (msg.senderEmail || msg.sender?.email || '').toLowerCase().trim();
  if (viewerEmail && senderEmail && viewerEmail === senderEmail) {
    return true;
  }

  return false;
};

/**
 * Resolves who the other chat participant is relative to the current viewer.
 * In a lost-and-found recovery channel:
 * - If Rohan (Finder) logs in, the other participant is Aarav Sharma (Owner).
 * - If Aarav (Owner) logs in, the other participant is Rohan Verma (Finder).
 */
export const resolveOtherParticipant = (convId, viewerOrId) => {
  const viewer = resolveViewer(viewerOrId);
  const numId = Number(convId);

  if (numId === 1 || !numId) {
    // Conversation 1: MacBook Air (between Aarav Sharma [id: 1] and Rohan Verma [id: 2])
    const isRohan = (
      Number(viewer?.id) === 2 ||
      (viewer?.email && viewer.email.toLowerCase().includes('rohan')) ||
      (viewer?.name && viewer.name.toLowerCase().includes('rohan'))
    );

    if (isRohan) {
      return {
        id: 1,
        name: "Aarav Sharma",
        email: "aarav.sharma@vit.edu",
        role: "STUDENT (Owner)",
        avatar: getCampusAvatar("Aarav Sharma", "STUDENT")
      };
    } else {
      return {
        id: 2,
        name: "Rohan Verma",
        email: "rohan.verma@vit.edu",
        role: "STUDENT (Finder)",
        avatar: getCampusAvatar("Rohan Verma", "STUDENT")
      };
    }
  }

  if (numId === 2) {
    // Conversation 2: Milton Water Bottle (between Aarav Sharma [id: 1] and Ananya Iyer [id: 9])
    const isAnanya = (
      Number(viewer?.id) === 9 ||
      (viewer?.email && viewer.email.toLowerCase().includes('ananya')) ||
      (viewer?.name && viewer.name.toLowerCase().includes('ananya'))
    );

    if (isAnanya) {
      return {
        id: 1,
        name: "Aarav Sharma",
        email: "aarav.sharma@vit.edu",
        role: "STUDENT (Owner)",
        avatar: getCampusAvatar("Aarav Sharma", "STUDENT")
      };
    } else {
      return {
        id: 9,
        name: "Ananya Iyer",
        email: "ananya.iyer@vit.edu",
        role: "STUDENT (Finder)",
        avatar: getCampusAvatar("Ananya Iyer", "STUDENT")
      };
    }
  }

  return {
    id: 0,
    name: "Campus Student",
    email: "student@vit.edu",
    role: "STUDENT",
    avatar: getCampusAvatar("Student", "STUDENT")
  };
};

// Seed storage helpers for durable demo conversations
const getLocalMessages = (convId) => {
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem(`tb_chat_msgs_${convId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    }
  } catch (e) {
    console.warn("Error reading local chat messages", e);
  }

  if (Number(convId) === 1) {
    return [
      {
        id: 1,
        senderId: 2,
        senderName: "Rohan Verma",
        content: "Namaste Aarav! I found a MacBook Air on desk #14 in the 3rd floor Central Library reading hall.",
        text: "Namaste Aarav! I found a MacBook Air on desk #14 in the 3rd floor Central Library reading hall.",
        timestamp: "2026-09-24T16:10:00Z",
        status: "READ"
      },
      {
        id: 2,
        senderId: 1,
        senderName: "Aarav Sharma",
        content: "Hello Rohan! Oh thank you so much! Does it have a GitHub sticker on the top shell?",
        text: "Hello Rohan! Oh thank you so much! Does it have a GitHub sticker on the top shell?",
        timestamp: "2026-09-24T16:15:00Z",
        status: "READ"
      },
      {
        id: 3,
        senderId: 2,
        senderName: "Rohan Verma",
        content: "Yes, exactly! It has the black and white Octocat sticker.",
        text: "Yes, exactly! It has the black and white Octocat sticker.",
        timestamp: "2026-09-24T16:18:00Z",
        status: "READ"
      },
      {
        id: 4,
        senderId: 1,
        senderName: "Aarav Sharma",
        content: "That is 100% mine! Should we meet up or did you hand it over to campus security?",
        text: "That is 100% mine! Should we meet up or did you hand it over to campus security?",
        timestamp: "2026-09-24T16:22:00Z",
        status: "READ"
      },
      {
        id: 5,
        senderId: 2,
        senderName: "Rohan Verma",
        content: "I deposited it at VIT Pune Central Security Office Locker A-12 for safe custody! You can submit a verification claim right through TraceBack.",
        text: "I deposited it at VIT Pune Central Security Office Locker A-12 for safe custody! You can submit a verification claim right through TraceBack.",
        timestamp: "2026-09-24T16:45:00Z",
        status: "READ"
      }
    ];
  }

  return [
    {
      id: 201,
      senderId: 9,
      senderName: "Ananya Iyer",
      content: "Hi Aarav! I turned in your silver Milton bottle to the Mechanical Workshop security desk.",
      text: "Hi Aarav! I turned in your silver Milton bottle to the Mechanical Workshop security desk.",
      timestamp: "2026-09-23T11:20:00Z",
      status: "READ"
    }
  ];
};

const saveLocalMessages = (convId, messages) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`tb_chat_msgs_${convId}`, JSON.stringify(messages));
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(`tb_chat_updated_${convId}`, { detail: messages }));
    }
  } catch (e) {
    console.warn("Error saving chat messages", e);
  }
};

export const getConversations = async (currentViewer) => {
  const viewer = resolveViewer(currentViewer);

  if (isDemo()) {
    return MOCK_CONVERSATIONS.map(c => {
      const other = resolveOtherParticipant(c.id, viewer);
      const msgs = getLocalMessages(c.id);
      const lastMsg = msgs[msgs.length - 1];

      return {
        ...c,
        otherParticipant: other,
        lastMessage: lastMsg?.text || lastMsg?.content || c.lastMessage,
        lastMessageTime: lastMsg?.timestamp || c.lastMessageTime
      };
    });
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

      // Determine who the other person is relative to current viewer
      const isViewerLost = (
        (viewer?.id && String(lostUser?.id) === String(viewer.id)) ||
        (viewer?.email && lostUser?.email && viewer.email.toLowerCase() === lostUser.email.toLowerCase())
      );
      const isViewerFound = (
        (viewer?.id && String(foundUser?.id) === String(viewer.id)) ||
        (viewer?.email && foundUser?.email && viewer.email.toLowerCase() === foundUser.email.toLowerCase())
      );

      const other = isViewerLost ? foundUser : (isViewerFound ? lostUser : (viewer?.role === 'ADMIN' ? foundUser : (foundUser || lostUser)));
      const item = match?.lostReport?.item || match?.foundReport?.item;

      return {
        id: c.id,
        matchId: match?.id || c.id,
        itemName: item?.name || 'Lost & Found Item',
        itemCategory: item?.category || 'OTHER',
        itemImageUrl: getItemImageUrl(item, true),
        otherParticipant: {
          id: other?.id,
          name: other?.name || (isViewerLost ? 'Item Finder' : 'Item Owner'),
          email: other?.email || '',
          role: other?.role === 'STUDENT' ? (isViewerLost ? 'Student (Finder)' : 'Student (Owner)') : (other?.role || 'Campus Member'),
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
    if (isDemo()) {
      return MOCK_CONVERSATIONS.map(c => {
        const other = resolveOtherParticipant(c.id, viewer);
        const msgs = getLocalMessages(c.id);
        const lastMsg = msgs[msgs.length - 1];
        return {
          ...c,
          otherParticipant: other,
          lastMessage: lastMsg?.text || lastMsg?.content || c.lastMessage,
          lastMessageTime: lastMsg?.timestamp || c.lastMessageTime
        };
      });
    }
    console.warn("Backend conversations fetch failed", error);
    return [];
  }
};

export const getConversationById = async (id, currentViewer) => {
  const viewer = resolveViewer(currentViewer);

  if (isDemo()) {
    const list = MOCK_CONVERSATIONS;
    const base = list.find(c => String(c.id) === String(id)) || list[0];
    const msgs = getLocalMessages(id);
    const other = resolveOtherParticipant(id, viewer, base);

    const formattedMessages = msgs.map(m => ({
      ...m,
      isMe: isMessageFromViewer(m, viewer)
    }));

    return {
      ...base,
      otherParticipant: other,
      messages: formattedMessages
    };
  }

  try {
    const [msgRes, convsRes] = await Promise.all([
      api.get(`/api/conversations/${id}/messages`),
      api.get('/api/conversations')
    ]);

    const messages = msgRes.data || [];
    const convList = convsRes.data || [];
    const foundConv = convList.find(c => String(c.id) === String(id) || String(c.matchRecord?.id) === String(id));

    const match = foundConv?.matchRecord;
    const lostUser = match?.lostReport?.user;
    const foundUser = match?.foundReport?.user;

    const isViewerLost = (
      (viewer?.id && String(lostUser?.id) === String(viewer.id)) ||
      (viewer?.email && lostUser?.email && viewer.email.toLowerCase() === lostUser.email.toLowerCase())
    );
    const isViewerFound = (
      (viewer?.id && String(foundUser?.id) === String(viewer.id)) ||
      (viewer?.email && foundUser?.email && viewer.email.toLowerCase() === foundUser.email.toLowerCase())
    );

    const other = isViewerLost ? foundUser : (isViewerFound ? lostUser : (viewer?.role === 'ADMIN' ? foundUser : (foundUser || lostUser)));
    const item = match?.lostReport?.item || match?.foundReport?.item;

    const formattedMessages = messages.map(m => {
      return {
        id: m.id,
        content: m.content,
        text: m.content,
        timestamp: m.timestamp,
        senderId: m.sender?.id,
        senderName: m.sender?.name,
        isMe: isMessageFromViewer(m, viewer)
      };
    });

    return {
      id: foundConv ? Number(foundConv.id) : Number(id),
      matchId: match?.id,
      itemName: item?.name || 'Lost & Found Item',
      itemCategory: item?.category || 'OTHER',
      itemImageUrl: getItemImageUrl(item, true),
      otherParticipant: {
        id: other?.id,
        name: other?.name || (isViewerLost ? 'Item Finder' : 'Item Owner'),
        email: other?.email || '',
        role: other?.role === 'STUDENT' ? (isViewerLost ? 'Student (Finder)' : 'Student (Owner)') : (other?.role || 'Campus Member'),
        avatar: other?.avatar || getCampusAvatar(other?.name, other?.role)
      },
      messages: formattedMessages
    };
  } catch (error) {
    console.warn(`Backend message load failed for conv #${id}`, error);
    if (isDemo()) {
      const list = MOCK_CONVERSATIONS;
      const base = list.find(c => String(c.id) === String(id)) || list[0];
      const msgs = getLocalMessages(id);
      const other = resolveOtherParticipant(id, viewer, base);

      const formattedMessages = msgs.map(m => ({
        ...m,
        isMe: isMessageFromViewer(m, viewer)
      }));

      return {
        ...base,
        otherParticipant: other,
        messages: formattedMessages
      };
    }
    // Return null in real mode so unauthorized or non-existent conversation is handled cleanly
    return null;
  }
};

/**
 * Send a message via Spring Boot REST API
 * Spring Boot persists the message in MySQL and automatically broadcasts
 * to all active STOMP WebSocket subscribers on /topic/chat/{conversationId}
 */
export const sendMessage = async (conversationId, text, senderId, senderName) => {
  const viewer = resolveViewer({ id: senderId, name: senderName });
  const newMsg = {
    id: Date.now(),
    senderId: viewer?.id || senderId || 1,
    senderName: viewer?.name || senderName || 'You',
    content: text,
    text,
    timestamp: new Date().toISOString(),
    status: 'READ'
  };

  if (isDemo()) {
    const msgs = getLocalMessages(conversationId);
    msgs.push(newMsg);
    saveLocalMessages(conversationId, msgs);
    return {
      ...newMsg,
      isMe: true
    };
  }

  try {
    const response = await api.post(`/api/conversations/${conversationId}/messages`, { content: text });
    const saved = response.data;

    return {
      id: saved.id,
      content: saved.content,
      text: saved.content,
      timestamp: saved.timestamp,
      senderId: saved.sender?.id || senderId,
      senderName: saved.sender?.name || senderName || 'You',
      isMe: true,
      status: 'READ'
    };
  } catch (err) {
    // Durable fallback
    const msgs = getLocalMessages(conversationId);
    msgs.push(newMsg);
    saveLocalMessages(conversationId, msgs);
    return {
      ...newMsg,
      isMe: true
    };
  }
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
  getCampusAvatar,
  resolveViewer,
  resolveOtherParticipant,
  isMessageFromViewer
};
