import { useState } from 'react';
import api from './api';

export function useChatbot() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message) => {
    if (!message || !message.trim()) return null;

    // Add user's message to the conversation
    setMessages((m) => [...m, { from: 'user', text: message }]);
    setLoading(true);

    try {
      const resp = await api.post('/ask', { message });
      const data = resp.data || {};

      // Backend returns { response: '...' } or escalation object
      const replyText = data?.response || data?.reply || data?.answer || '';

      const botMsg = {
        from: 'bot',
        text: replyText || 'Sorry, I did not understand that.',
        escalation: !!data?.escalation,
        resources: data?.resources || null,
      };

      setMessages((m) => [...m, botMsg]);
      return data;
    } catch (error) {
      console.error('Chat failed', error);
      setMessages((m) => [...m, { from: 'bot', text: 'Sorry, the assistant is unavailable right now.' }]);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, messages, setMessages, loading };
}