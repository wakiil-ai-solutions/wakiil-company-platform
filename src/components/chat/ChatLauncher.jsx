import { useEffect, useState } from 'react';
import { siteConfig } from '../../config/public';

const text = {
  en: {
    launcher: 'Ask Wakiil',
    close: 'Close',
    title: 'Wakiil Assistant',
    subtitle: 'Public information assistant',
    placeholder: 'Ask about Wakiil…',
    send: 'Send',
    warning: 'Do not enter private customer, shipment, payment, employee, or credential information.',
    offline: 'The public assistant is not connected yet. Please use the contact page or email Wakiil directly.',
    fallback: 'I can answer questions about Wakiil’s public services, process, security approach, and demonstration.',
    suggestions: ['What does Wakiil automate?', 'How does a project start?', 'How is the demo labelled?'],
  },
  so: {
    launcher: 'Wakiil weydii',
    close: 'Xir',
    title: 'Kaaliyaha Wakiil',
    subtitle: 'Kaaliye xog guud',
    placeholder: 'Wakiil wax ka weydii…',
    send: 'Dir',
    warning: 'Ha gelin xog gaar ah oo macaamiil, shipment, lacag, shaqaale, ama sir ah.',
    offline: 'Kaaliyaha guud weli kuma xirna adeeg. Fadlan isticmaal bogga xiriirka ama email u dir Wakiil.',
    fallback: 'Waxaan ka jawaabi karaa adeegyada guud ee Wakiil, habka shaqada, amniga, iyo demo-ga.',
    suggestions: ['Wakiil maxuu otomaatig gareeyaa?', 'Sidee mashruucu ku bilaabmaa?', 'Sidee demo-ga loo calaamadeeyay?'],
  },
};

export default function ChatLauncher({ lang = 'en' }) {
  const c = text[lang] || text.en;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener('open-wakiil-chat', openChat);
    return () => window.removeEventListener('open-wakiil-chat', openChat);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = async (value = input) => {
    const question = value.trim();
    if (!question || sending) return;
    setMessages((current) => [...current, { role: 'user', content: question }]);
    setInput('');
    setSending(true);

    if (!siteConfig.chatEndpoint) {
      window.setTimeout(() => {
        setMessages((current) => [...current, { role: 'assistant', content: c.offline }]);
        setSending(false);
      }, 350);
      return;
    }

    try {
      const response = await fetch(siteConfig.chatEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, language: lang }),
      });
      if (!response.ok) throw new Error('Assistant request failed');
      const data = await response.json();
      setMessages((current) => [...current, { role: 'assistant', content: data.reply || c.fallback }]);
    } catch {
      setMessages((current) => [...current, { role: 'assistant', content: c.fallback }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {open && (
        <section className="chat-panel" role="dialog" aria-label={c.title} aria-modal="false">
          <div className="chat-header">
            <div>
              <strong>{c.title}</strong>
              <span>{c.subtitle}</span>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label={c.close}>×</button>
          </div>
          <div className="chat-messages" aria-live="polite">
            {messages.length === 0 && <p className="chat-intro">{c.fallback}</p>}
            {messages.map((message, index) => <p className={`chat-message chat-${message.role}`} key={`${message.role}-${index}`}>{message.content}</p>)}
            {sending && <p className="chat-message chat-assistant">…</p>}
          </div>
          {messages.length === 0 && <div className="chat-suggestions">{c.suggestions.map((suggestion) => <button key={suggestion} onClick={() => send(suggestion)}>{suggestion}</button>)}</div>}
          <p className="chat-warning">{c.warning}</p>
          <form className="chat-form" onSubmit={(event) => { event.preventDefault(); send(); }}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={c.placeholder} aria-label={c.placeholder} />
            <button type="submit" disabled={sending}>{c.send}</button>
          </form>
        </section>
      )}
      <button className="chat-launcher" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={open ? c.close : c.launcher}>
        <span aria-hidden="true">{open ? '×' : '+'}</span>{open ? c.close : c.launcher}
      </button>
    </>
  );
}
