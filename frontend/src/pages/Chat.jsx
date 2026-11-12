import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import {
  Send,
  GitMerge,
  Paperclip,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  User,
  CheckCheck,
  Smile,
  Info
} from 'lucide-react';
import chatService from '../api/chatService';

export const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(1);
  const [activeConv, setActiveConv] = useState(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const loadChatData = async () => {
    try {
      const list = await chatService.getConversations();
      setConversations(list || []);
      if (list && list.length > 0) {
        const conv = await chatService.getConversationById(activeConvId || list[0].id);
        setActiveConv(conv);
      }
    } catch (err) {
      console.error("Chat load error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChatData();
  }, [activeConvId]);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    const text = inputText.trim();
    setInputText('');

    const newMsg = await chatService.sendMessage(activeConv.id, text, user?.id || 1, user?.name || "Aarav Sharma");
    
    // Update active conversation locally
    setActiveConv(prev => ({
      ...prev,
      messages: [...(prev?.messages || []), newMsg]
    }));

    // Simulate finder quick auto-response after 1.5s for rich interactivity!
    if (text.toLowerCase().includes('where') || text.toLowerCase().includes('desk') || text.toLowerCase().includes('claim')) {
      setTimeout(async () => {
        const reply = await chatService.sendMessage(
          activeConv.id,
          "Sounds good! The item is safely stored at Ramanujan Building Security Vault Locker A-12. Once Security approves your claim pass, you can pick it up with your Student ID.",
          4,
          "Rohan Verma (Finder)"
        );
        setActiveConv(prev => ({
          ...prev,
          messages: [...(prev?.messages || []), { ...reply, isMe: false }]
        }));
        toast.info("New message from Rohan Verma");
      }, 1500);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setInputText(promptText);
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Verification Messages
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '0.8125rem' }}>
            Private chat channel between item reporters and finders
          </p>
        </div>

        <Link to="/matches" className="btn btn-outline btn-sm">
          <GitMerge size={14} /> Back to Matches
        </Link>
      </div>

      {/* Main Chat Interface Window */}
      <div className="surface-card" style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'minmax(240px, 300px) 1fr',
        borderRadius: '6px',
        overflow: 'hidden',
        border: '1px solid var(--slate-200)',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* Left Pane: Conversation Threads */}
        <div style={{
          borderRight: '1px solid var(--border-color)',
          backgroundColor: 'var(--card-bg)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--slate-50)' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--slate-700)' }}>
              Active Conversations ({conversations.length})
            </span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.map(c => {
              const isSelected = c.id === activeConvId;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--slate-100)',
                    backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: isSelected ? 'var(--primary)' : 'var(--slate-900)' }}>
                      {c.otherParticipant?.name}
                    </span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)' }}>
                      {c.lastMessageTime ? new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '2px' }}>
                    Regarding: {c.itemName}
                  </div>

                  <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--slate-500)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {c.lastMessage || 'No messages yet'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Active Chat Room */}
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)' }}>
          {/* Room Header */}
          {activeConv && (
            <div style={{
              padding: '12px 20px',
              backgroundColor: 'var(--card-bg)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={activeConv.otherParticipant?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
                  alt="Avatar"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                    {activeConv.otherParticipant?.name}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    {activeConv.otherParticipant?.role} • Regarding: <strong>{activeConv.itemName}</strong>
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to={`/claims/new/${activeConv.matchId || 1}`} className="btn btn-primary btn-sm">
                  <ShieldCheck size={14} /> Submit Claim
                </Link>
                <Link to={`/matches/${activeConv.matchId || 1}`} className="btn btn-secondary btn-sm">
                  Match Details
                </Link>
              </div>
            </div>
          )}

          {/* Safety Disclaimer Banner */}
          <div style={{
            padding: '8px 16px',
            backgroundColor: '#fffbeb',
            borderBottom: '1px solid #fde68a',
            color: '#92400e',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldCheck size={14} color="#b45309" />
            <span>
              <strong>Campus Safety Reminder:</strong> Do NOT share passwords, unlock patterns, or bank info. Verification happens via Security Desk.
            </span>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {activeConv?.messages?.map((msg) => {
              const isMe = msg.isMe || msg.sender?.id === user?.id || msg.senderId === user?.id;
              const displayText = msg.text || msg.content;
              const senderDisplayName = isMe ? 'You' : (msg.sender?.name || msg.senderName || 'Participant');
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                    alignSelf: isMe ? 'flex-end' : 'flex-start'
                  }}
                >
                  <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', marginBottom: '2px', padding: '0 4px' }}>
                    {senderDisplayName}
                  </span>
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      backgroundColor: isMe ? 'var(--primary)' : 'var(--card-bg)',
                      color: isMe ? '#ffffff' : 'var(--text-main)',
                      boxShadow: 'var(--shadow-sm)',
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      border: isMe ? 'none' : '1px solid var(--border-color)'
                    }}
                  >
                    {displayText}
                  </div>
                  <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', marginTop: '2px', padding: '0 4px' }}>
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Suggestions */}
          <div style={{ padding: '6px 16px', backgroundColor: 'var(--card-bg)', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
            <span style={{ fontSize: '0.6875rem', color: 'var(--slate-400)', alignSelf: 'center', whiteSpace: 'nowrap' }}>Quick replies:</span>
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
                  padding: '4px 10px',
                  fontSize: '0.6875rem',
                  color: 'var(--slate-700)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--card-bg)',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              placeholder="Type your verification message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="form-input"
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ borderRadius: '10px', padding: '0.625rem 1.25rem' }}
              disabled={!inputText.trim()}
            >
              <Send size={16} /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
