import React, { useState, useEffect, useRef } from 'react';
import { useChatbot } from '../services/chatbot';

function ChatWidget() {
  const { sendMessage, messages, loading } = useChatbot();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const containerRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput('');
  };

  // when opening the widget we record a chat session start (simple counter/history)
  const handleOpen = () => {
    setOpen(true);
    try {
      const raw = localStorage.getItem('chat_sessions');
      const arr = raw ? JSON.parse(raw) : [];
      arr.unshift({ started_at: new Date().toISOString() });
      localStorage.setItem('chat_sessions', JSON.stringify(arr.slice(0, 500)));
    } catch (e) { console.warn('save chat session failed', e); }
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [messages, open]);

  return (
    <div>
      {/* Floating launcher */}
      <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 9999 }}>
        {open ? (
          <div style={{ width: 320, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', borderRadius: 12, overflow: 'hidden', background: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#2563eb', color: 'white' }}>
              <div style={{ fontWeight: 700 }}>Assistant</div>
              <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>Close</button>
            </div>

            <div ref={containerRef} style={{ maxHeight: 280, overflowY: 'auto', padding: '0.75rem', background: '#f8fafc' }}>
              {messages.length === 0 && (
                <div style={{ color: '#6b7280', fontSize: 13 }}>Hi — ask me about symptoms, predictions, or how to use the app.</div>
              )}
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', marginTop: i === 0 ? 0 : 8, justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '78%', padding: '0.5rem 0.75rem', borderRadius: 8, background: m.from === 'user' ? '#2563eb' : '#fff', color: m.from === 'user' ? 'white' : '#111', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ marginTop: 8, color: '#6b7280', fontSize: 13 }}>Assistant is typing...</div>
              )}
            </div>

            {/* Show escalation resources (if present) below messages */}
            {messages.length > 0 && (
              (() => {
                const last = messages[messages.length - 1];
                if (last?.escalation && last?.resources) {
                  return (
                    <div style={{ padding: '0.5rem 0.75rem', background: '#fff7ed', border: '1px solid #ffedd5', margin: '0.5rem' }}>
                      <div style={{ fontWeight: 700, color: '#92400e' }}>Escalation resources</div>
                      <div style={{ marginTop: 6, fontSize: 13, color: '#7c2d12' }}>{JSON.stringify(last.resources)}</div>
                    </div>
                  );
                }
                return null;
              })()
            )}

            <form onSubmit={handleSend} style={{ display: 'flex', padding: '0.5rem', gap: '0.5rem' }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
                style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #e5e7eb' }}
              />
              <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '0 0.75rem', cursor: 'pointer' }}>Send</button>
            </form>
          </div>
        ) : (
          <button onClick={handleOpen} style={{ width: 56, height: 56, borderRadius: '50%', background: '#2563eb', border: 'none', color: 'white', boxShadow: '0 8px 24px rgba(37,99,235,0.24)', cursor: 'pointer' }}>
            💬
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatWidget;