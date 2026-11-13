import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import {
  Send,
  GitMerge,
  Paperclip,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  User,
  CheckCheck,
  Smile,
  Info,
  Search,
  Lock,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import chatService, { getCampusAvatar } from '../api/chatService';
import { getItemImageUrl } from '../utils/imageUtils';
import { CAMPUS_CONFIG } from '../config/campusConfig';

export const Chat = () => {
  const { user } = useAuth();
  const { isDark, isLuxury } = useTheme();
  const { toast } = useToast();

  const { id: paramConvId } = useParams();
  const [searchParams] = useSearchParams();
  const queryConvId = searchParams.get('conversationId') || searchParams.get('id');
  const targetRouteId = paramConvId || queryConvId;

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(() => (targetRouteId ? Number(targetRouteId) : 1));
  const [activeConv, setActiveConv] = useState(null);
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showMobileList, setShowMobileList] = useState(false);

  const messagesEndRef = useRef(null);
  const chatScrollContainerRef = useRef(null);

  // Sync if URL param changes (e.g. user clicked notification to /chat/1)
  useEffect(() => {
    if (targetRouteId) {
      const num = Number(targetRouteId);
      if (!isNaN(num) && num !== activeConvId) {
        setActiveConvId(num);
      }
    }
  }, [targetRouteId]);

  // Load real conversations from backend
  const loadChatData = async () => {
    try {
      const list = await chatService.getConversations(user?.id);
      setConversations(list || []);
      const defaultId = (list && list.length > 0) ? list[0].id : 1;
      const targetId = targetRouteId ? Number(targetRouteId) : (activeConvId || defaultId);
      setActiveConvId(targetId);
      const conv = await chatService.getConversationById(targetId, user?.id);
      setActiveConv(conv);
    } catch (err) {
      console.error("Chat load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChatData();
  }, [user?.id]);

  // When active conversation changes, fetch its messages
  useEffect(() => {
    let isCancelled = false;
    const fetchActive = async () => {
      if (!activeConvId) return;
      try {
        const conv = await chatService.getConversationById(activeConvId, user?.id);
        if (!isCancelled) {
          setActiveConv(conv);
        }
      } catch (e) {
        console.error("Error switching conversation", e);
      }
    };
    fetchActive();
    return () => { isCancelled = true; };
  }, [activeConvId, user?.id]);

  // Real-time STOMP WebSocket subscription
  useEffect(() => {
    let stompSub = null;
    let isCancelled = false;

    if (activeConvId) {
      chatService.subscribeToChat(activeConvId, (incomingMsg) => {
        if (!incomingMsg || isCancelled) return;
        setActiveConv(prev => {
          if (!prev) return prev;
          const msgList = prev.messages || [];
          if (msgList.some(m => m.id === incomingMsg.id)) return prev;

          const isFromMe = incomingMsg.sender?.id === user?.id ||
            incomingMsg.senderId === user?.id ||
            incomingMsg.isMe;

          const newFormatted = {
            id: incomingMsg.id || Date.now(),
            text: incomingMsg.content || incomingMsg.text,
            content: incomingMsg.content || incomingMsg.text,
            senderName: incomingMsg.sender?.name || incomingMsg.senderName || (isFromMe ? 'You' : 'Participant'),
            timestamp: incomingMsg.timestamp || new Date().toISOString(),
            isMe: isFromMe
          };

          return {
            ...prev,
            messages: [...msgList, newFormatted]
          };
        });
      })?.then?.(sub => {
        if (isCancelled && sub) sub.unsubscribe();
        else stompSub = sub;
      });
    }

    return () => {
      isCancelled = true;
      if (stompSub && typeof stompSub.unsubscribe === 'function') {
        stompSub.unsubscribe();
      }
    };
  }, [activeConvId, user?.id]);

  // Auto-scroll to bottom like WhatsApp
  const scrollToBottom = (smooth = true) => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [activeConv?.id]);

  useEffect(() => {
    scrollToBottom(true);
  }, [activeConv?.messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const text = inputText.trim();
    setInputText('');

    try {
      const newMsg = await chatService.sendMessage(
        activeConv.id,
        text,
        user?.id || 1,
        user?.name || "Aarav Sharma"
      );

      // Append only if not already rendered from the real-time WebSocket broadcast
      setActiveConv(prev => {
        if (!prev) return prev;
        const msgList = prev.messages || [];
        if (newMsg?.id && msgList.some(m => m.id === newMsg.id)) {
          return prev;
        }
        return {
          ...prev,
          messages: [...msgList, newMsg]
        };
      });

      // Update thread list snippet on the left
      setConversations(prev => prev.map(c => {
        if (c.id === activeConv.id) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: new Date().toISOString()
          };
        }
        return c;
      }));
    } catch (err) {
      console.error("Message send failure", err);
      toast.error("Failed to deliver message. Check backend connectivity.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setInputText(promptText);
  };

  const filteredConversations = conversations.filter(c => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      c.otherParticipant?.name?.toLowerCase().includes(q) ||
      c.itemName?.toLowerCase().includes(q) ||
      c.lastMessage?.toLowerCase().includes(q)
    );
  });

  // Dynamic message bubble color tokens (Instagram Luxury Palette vs Classic)
  const bubbleMeBg = isLuxury
    ? (isDark ? '#1C2C3E' : '#E8F3FF') // soft baby blue wash
    : (isDark ? '#005c4b' : '#d9fdd3');

  const bubbleMeText = isLuxury
    ? (isDark ? '#F5EFE6' : '#1A2938')
    : (isDark ? '#e9edef' : '#111b21');

  const bubbleOtherBg = isLuxury
    ? (isDark ? '#231812' : '#FFFFFF') // dark cocoa bean or pure alabaster
    : (isDark ? '#202c33' : '#ffffff');

  const bubbleOtherText = isLuxury
    ? (isDark ? '#F5EFE6' : '#281810') // deep espresso brown
    : (isDark ? '#e9edef' : '#111b21');

  const chatCanvasBg = isLuxury
    ? (isDark ? '#160F0B' : '#F6EFE6') // deep espresso or warm cream canvas from snap
    : (isDark ? '#0b101b' : '#f0f2f5');

  return (
    <div className="animate-fade-in" style={{
      height: 'calc(100vh - 100px)',
      maxHeight: 'calc(100vh - 100px)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Compact Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.625rem',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--slate-900)', margin: 0 }}>
            Verification Messages
          </h1>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.6875rem',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '9999px',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#dcfce7',
            color: isDark ? '#34d399' : '#15803d'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            Online
          </span>
        </div>

        <Link to="/matches" className="btn btn-outline btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
          <GitMerge size={13} /> Back to Matches
        </Link>
      </div>

      {/* Main WhatsApp-Style Frame */}
      <div className={`surface-card chat-layout-frame ${showMobileList ? 'mobile-show-list' : 'mobile-show-room'}`}>
        {/* Left Pane: Conversation Threads */}
        <div className="chat-left-pane">
          {/* Top of Left Pane: User Header & Search */}
          <div style={{
            padding: '12px 14px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--slate-50)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                Chats
              </span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--slate-500)', fontWeight: 500 }}>
                {conversations.length} Active Channel{conversations.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Thread Search Box */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)' }} />
              <input
                type="text"
                placeholder="Search chats or items..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px 6px 30px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--card-bg)',
                  fontSize: '0.75rem',
                  color: 'var(--text-main)',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Scrollable Conversation List */}
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            {filteredConversations.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.8125rem' }}>
                No active conversations found.
              </div>
            ) : (
              filteredConversations.map(c => {
                const isSelected = c.id === activeConvId;
                const formattedTime = c.lastMessageTime
                  ? new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '';

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setActiveConvId(c.id);
                      setShowMobileList(false);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: isSelected ? (isDark ? 'rgba(37, 99, 235, 0.16)' : '#eff6ff') : 'transparent',
                      borderLeft: isSelected ? '3px solid #2563eb' : '3px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    {/* Participant Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img
                        src={c.otherParticipant?.avatar || getCampusAvatar(c.otherParticipant?.name, c.otherParticipant?.role)}
                        alt={c.otherParticipant?.name}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1px solid var(--border-color)'
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        border: '2px solid var(--card-bg)'
                      }}></span>
                    </div>

                    {/* Metadata */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                        <h4 style={{
                          fontSize: '0.875rem',
                          fontWeight: isSelected ? 700 : 600,
                          color: isSelected ? '#2563eb' : 'var(--slate-900)',
                          margin: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {c.otherParticipant?.name || 'Rohan Verma'}
                        </h4>
                        <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', flexShrink: 0, marginLeft: '6px' }}>
                          {formattedTime}
                        </span>
                      </div>

                      <div style={{
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        color: 'var(--slate-600)',
                        marginBottom: '3px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        📦 {c.itemName}
                      </div>

                      <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--slate-500)',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CheckCheck size={12} color="#94a3b8" />
                        <span>{c.lastMessage}</span>
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: WhatsApp Chat Room Canvas */}
        <div className="chat-right-pane" style={{ backgroundColor: chatCanvasBg }}>
          {/* WhatsApp Room Header */}
          <div style={{
            padding: '10px 14px',
            backgroundColor: 'var(--card-bg)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Mobile Back to List Button */}
              <button
                onClick={() => setShowMobileList(true)}
                className="chat-mobile-back-btn"
                title="Back to conversation list"
              >
                <ArrowLeft size={18} />
              </button>

              <div style={{ position: 'relative' }}>
                <img
                  src={activeConv?.otherParticipant?.avatar || getCampusAvatar(activeConv?.otherParticipant?.name, activeConv?.otherParticipant?.role)}
                  alt="Avatar"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '1px solid var(--border-color)'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  border: '1.5px solid var(--card-bg)'
                }}></span>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--slate-900)', margin: 0 }}>
                  {activeConv?.otherParticipant?.name || 'Rohan Verma'}
                </h4>
                {activeConv?.itemName && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                    {activeConv.itemName}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link
                to={`/claims/new/${activeConv?.matchId || 1}`}
                className="btn btn-primary btn-sm"
                style={{ padding: '6px 12px', fontSize: '0.75rem', gap: '5px' }}
              >
                <ShieldCheck size={14} /> Claim Voucher
              </Link>
              <Link
                to={`/matches/${activeConv?.matchId || 1}`}
                className="btn btn-outline btn-sm"
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              >
                View Match
              </Link>
            </div>
          </div>

          {/* WhatsApp Scrollable Message History Area */}
          <div
            ref={chatScrollContainerRef}
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {/* Centered Date Badge */}
            <div style={{ textAlign: 'center', margin: '4px 0 12px' }}>
              <span style={{
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                color: 'var(--slate-500)',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                TODAY • NOVEMBER 12, 2026
              </span>
            </div>

            {/* Message Bubbles */}
            {activeConv?.messages?.map((msg) => {
              const isMe = msg.isMe || msg.sender?.id === user?.id || msg.senderId === user?.id;
              const displayText = msg.text || msg.content;
              const formattedTime = msg.timestamp
                ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Now';

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '68%',
                    alignSelf: isMe ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      padding: '8px 12px 6px',
                      borderRadius: isMe ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                      backgroundColor: isMe ? bubbleMeBg : bubbleOtherBg,
                      color: isMe ? bubbleMeText : bubbleOtherText,
                      boxShadow: '0 1px 1px rgba(0, 0, 0, 0.08)',
                      fontSize: '0.875rem',
                      lineHeight: 1.45,
                      wordBreak: 'break-word',
                      border: isMe
                        ? (isLuxury
                            ? (isDark ? '1px solid rgba(142, 197, 255, 0.25)' : '1px solid #BAE0FF')
                            : (isDark ? '1px solid rgba(0, 92, 75, 0.4)' : '1px solid rgba(16, 185, 129, 0.2)'))
                        : '1px solid var(--border-color)',
                      position: 'relative'
                    }}
                  >
                    {/* Sender Name for inbound messages */}
                    {!isMe && (
                      <div style={{
                        fontSize: '0.71875rem',
                        fontWeight: 700,
                        color: isLuxury ? (isDark ? '#8EC5FF' : '#1D6FB8') : '#2563eb',
                        marginBottom: '2px'
                      }}>
                        {msg.senderName || activeConv?.otherParticipant?.name || 'Rohan Verma'}
                      </div>
                    )}

                    <div>{displayText}</div>

                    {/* Timestamp & Double Blue Ticks */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '4px',
                      fontSize: '0.65625rem',
                      color: isMe ? (isDark ? '#BFAEA0' : '#667781') : 'var(--slate-400)',
                      marginTop: '3px'
                    }}>
                      <span>{formattedTime}</span>
                      {isMe && <CheckCheck size={13} color={isLuxury ? '#8EC5FF' : '#53bdeb'} />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Chips Bar */}
          <div style={{
            padding: '6px 14px',
            backgroundColor: 'var(--card-bg)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            flexShrink: 0
          }}>
            {[
              "Where is it stored right now?",
              "Does it have an identifying mark or sticker?",
              "I just submitted an ownership verification claim."
            ].map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickPrompt(prompt)}
                style={{
                  background: 'var(--slate-100)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '3px 10px',
                  fontSize: '0.6875rem',
                  color: 'var(--slate-700)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.15s ease'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* WhatsApp Bottom Message Input Dock */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '10px 16px',
              backgroundColor: 'var(--card-bg)',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexShrink: 0
            }}
          >
            {/* Attachment Button */}
            <button
              type="button"
              title="Attach Document / Photo"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--slate-500)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                borderRadius: '50%'
              }}
              onClick={() => toast.info("Photo attachments are handled through Claim Verification.")}
            >
              <Paperclip size={18} />
            </button>

            {/* Input field */}
            <input
              type="text"
              placeholder="Type a message (Press Enter to send)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                padding: '9px 16px',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                backgroundColor: isDark ? '#111827' : '#f8fafc',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              title="Send Message"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: inputText.trim()
                  ? (isLuxury ? (isDark ? '#8EC5FF' : '#3B2418') : '#2563eb')
                  : 'var(--slate-200)',
                color: inputText.trim()
                  ? (isLuxury && isDark ? '#160F0B' : '#ffffff')
                  : 'var(--slate-400)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputText.trim() ? 'pointer' : 'default',
                transition: 'background-color 0.15s ease'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
