import { useEffect, useMemo, useState } from 'react';

type ChatMessage = {
  role: 'user' | 'bot';
  content: string;
};

const API_BASE_URL = 'http://localhost:3001';
const ORG_ID = 'demo-org';

export function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/webchat/session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orgId: ORG_ID,
            sourceUrl: window.location.href,
            landingUrl: window.location.href,
            userAgent: navigator.userAgent,
          }),
        });
        const data = await response.json();
        setSessionId(data.sessionId);
        if (data.welcomeMessage) {
          setMessages([{ role: 'bot', content: data.welcomeMessage }]);
        }
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, []);

  const canSend = useMemo(() => Boolean(input.trim()) && Boolean(sessionId) && !loading, [input, sessionId, loading]);

  const sendMessage = async () => {
    if (!canSend || !sessionId) return;

    const text = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/webchat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: ORG_ID,
          sessionId,
          message: text,
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'bot', content: data.replyPreview ?? 'Sin respuesta.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="chat-card">
        <div className="chat-header">
          <h1 className="chat-title">Demo Webchat</h1>
          <p className="chat-subtitle">Prueba visual del add-on inmobiliario</p>
        </div>

        <div className="chat-body">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              {message.content}
            </div>
          ))}
        </div>

        <div className="chat-footer">
          <input
            className="chat-input"
            placeholder="Escribí tu mensaje..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                void sendMessage();
              }
            }}
          />
          <button className="chat-button" onClick={() => void sendMessage()} disabled={!canSend}>
            Enviar
          </button>
        </div>

        <div className="meta-box">
          <div>orgId: {ORG_ID}</div>
          <div>sessionId: {sessionId ?? 'creando...'}</div>
          <div>api: {API_BASE_URL}</div>
        </div>
      </div>
    </div>
  );
}
