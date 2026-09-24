import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '../../config/public';

const messages = {
  en: {
    launcher: 'Ask Wakiil', close: 'Close', title: 'Wakiil AI', subtitle: 'Public information assistant',
    placeholder: 'Ask about Wakiil…', send: 'Send', warning: 'Please do not enter private customer, shipment, payment, employee, or credential information here.',
    welcome: 'I can explain Wakiil’s services, delivery process, and internal demonstration.',
    offline: 'I can answer general questions about Wakiil from the information on this page.',
    sensitive: 'Please keep private operational details out of this chat. I can explain Wakiil’s public process and services.',
    interested: 'We can continue with a discovery call or a short request form. Choose the next step that works for you.',
    unknown: 'I can help with Wakiil’s services, industries, existing software, security approach, internal demo, and pricing process.',
    book: 'Book a Discovery Call', form: 'Complete the short form',
    suggested: ['What does Wakiil AI automate?', 'Which businesses can use Wakiil?', 'How does Wakiil work with existing software?', 'How do you protect access?', 'What is the delivery workflow demonstration?', 'How does pricing work?'],
    answers: {
      service: 'Wakiil designs controlled AI automation, custom integrations, and workflows that coordinate repeated work from request to resolution. People keep control of consequential decisions.',
      businesses: 'Wakiil can design automation for logistics, restaurants, retail, travel and appointment businesses, clinics, service businesses, agencies, and operations teams. The public site does not claim live deployments in every sector.',
      systems: 'Wakiil works around the business software and processes a team already uses. A project maps the systems of record, permitted data, actions, and failure paths before implementation.',
      security: 'The approach starts with limited access and controlled testing. Sensitive actions can require human approval, current state is checked, and outcomes are recorded. No independent security certification is claimed.',
      demo: 'The MK Deliver example is an internal technical demonstration using a dry-run. No real customer message was sent, and it is not an external customer case study.',
      pricing: 'Pricing is scoped after discovery based on operational scope, system complexity, risk, transaction volume, implementation effort, and ongoing support. Exact pricing is provided after discovery.',
    },
  },
  so: {
    launcher: 'Wakiil weydii', close: 'Xir', title: 'Wakiil AI', subtitle: 'Kaaliye xog guud',
    placeholder: 'Wakiil wax ka weydii…', send: 'Dir', warning: 'Fadlan ha gelin xog gaar ah oo macaamiil, gaarsiin, lacag-bixin, shaqaale, ama sir ah.',
    welcome: 'Waxaan sharxi karaa adeegyada Wakiil, habka hirgelinta, iyo demo-ga gudaha.',
    offline: 'Waxaan ka jawaabi karaa su’aalo guud oo ku saabsan xogta Wakiil ee boggan ku qoran.',
    sensitive: 'Fadlan xogta hawlgalka ee gaarka ah ha gelin chat-kan. Waxaan sharxi karaa habka iyo adeegyada guud ee Wakiil.',
    interested: 'Waxaan ku sii wadi karnaa kulan hordhac ah ama foom gaaban. Dooro tallaabada kugu habboon.',
    unknown: 'Waxaan kaa caawin karaa adeegyada Wakiil, warshadaha, software-ka jira, amniga, demo-ga gudaha, iyo habka qiimeynta.',
    book: 'Qabso kulan hordhac ah', form: 'Buuxi foomka gaaban',
    suggested: ['Wakiil AI maxuu otomaatig gareeyaa?', 'Ganacsiyadee ayaa adeegsan kara Wakiil?', 'Sidee Wakiil ula shaqeeyaa software-ka hadda jira?', 'Sidee gelitaanka loo ilaaliyaa?', 'Waa maxay demo-ga workflow-ga gaarsiinta?', 'Sidee qiimaha loo xisaabiyaa?'],
    answers: {
      service: 'Wakiil wuxuu naqshadeeyaa AI automation la xakameeyo, isku-xirro gaar ah, iyo workflow-yo isku dubbarida shaqada soo noqnoqota laga bilaabo codsi ilaa xal. Dadku waxay hayaan xakameynta go’aamada muhiimka ah.',
      businesses: 'Wakiil wuxuu automation u naqshadayn karaa saadka, makhaayadaha, tafaariiqda, safarka iyo ballamaha, rugaha caafimaadka, adeegyada, hay’adaha, iyo kooxaha hawlgalka. Boggu ma sheeganayo in dhammaantood ay hadda macaamiil yihiin.',
      systems: 'Wakiil wuxuu ku shaqeeyaa software-ka iyo habraacyada ganacsigu hore u isticmaalo. Mashruucu wuxuu marka hore khariidayaa xogta rasmiga ah, xogta la oggol yahay, ficillada, iyo waddooyinka fashilka.',
      security: 'Habku wuxuu ku bilaabmaa gelitaan xaddidan iyo tijaabo la xakameeyo. Ficillada xasaasiga ah waxay u baahan karaan oggolaansho qof, xaaladda hadda jirta waa la hubiyaa, natiijooyinkana waa la diiwaangeliyaa. Shahaado amni oo madax-bannaan lama sheeganayo.',
      demo: 'Tusaalaha MK Deliver waa demo farsamo gudaha ah oo dry-run ah. Farriin macmiil dhab ah lama dirin, mana aha case study macmiil dibadeed.',
      pricing: 'Qiimaha waxaa la dejiyaa kadib discovery, iyadoo lagu salaynayo baaxadda hawsha, kakanaanta nidaamka, khatarta, mugga macaamilka, dadaalka hirgelinta, iyo taageerada. Qiime sax ah waxaa la bixiyaa kadib kulanka.',
    },
  },
};

function getReply(question, copy) {
  const value = question.toLowerCase();
  if (/(password|passwords|credential|shipment\s*(number|id|#)|tracking\s*(number|id|#)|payment\s*(detail|card)|customer\s*(record|data)|phone number|furaha sirta|lambarka gaarsiinta|xog macaamiil)/i.test(value)) return { text: copy.sensitive };
  if (/(book|discovery|call|proposal|contact|interested|talk|start a project|kulan|soo-jeedin|la xiriir|mashruuc)/i.test(value)) return { text: copy.interested, handoff: true };
  if (/(price|pricing|cost|qiim|lacag)/i.test(value)) return { text: copy.answers.pricing };
  if (/(security|protect|access|secure|amni|gelitaan|ilaali)/i.test(value)) return { text: copy.answers.security };
  if (/(demo|delivery|deliver|logistic|gaarsiin|mk deliver)/i.test(value)) return { text: copy.answers.demo };
  if (/(business|industry|industries|clinic|restaurant|retail|travel|who can|ganacsi|warshad|makhaayad|dukaan)/i.test(value)) return { text: copy.answers.businesses };
  if (/(software|system|integration|existing|tools|nidaam|isku xir|qalab)/i.test(value)) return { text: copy.answers.systems };
  if (/(automate|automation|workflow|service|what does|adeeg|maxuu|automation)/i.test(value)) return { text: copy.answers.service };
  return { text: copy.unknown };
}

export default function ChatLauncher({ lang = 'en' }) {
  const c = messages[lang] || messages.en;
  const [open, setOpen] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const bookingHref = siteConfig.bookingUrl || `mailto:${siteConfig.contactEmail}?subject=Wakiil%20discovery%20call`;

  useEffect(() => {
    const openChat = () => setOpen(true);
    window.addEventListener('open-wakiil-chat', openChat);
    return () => window.removeEventListener('open-wakiil-chat', openChat);
  }, []);
  useEffect(() => {
    if (!open) return undefined;
    inputRef.current?.focus();
    const onKey = (event) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const send = (value = input) => {
    const question = value.trim();
    if (!question) return;
    const reply = getReply(question, c);
    setConversation((current) => [...current, { role: 'user', text: question }, { role: 'assistant', ...reply }]);
    setInput('');
  };

  return <>
    {open && <section className="chat-panel" role="dialog" aria-labelledby="wakiil-chat-title" aria-modal="false">
      <div className="chat-header"><div><h2 id="wakiil-chat-title">{c.title}</h2><span>{c.subtitle}</span></div><button className="chat-close" onClick={() => setOpen(false)} aria-label={c.close}>×</button></div>
      <div className="chat-messages" aria-live="polite">{conversation.length === 0 && <p className="chat-intro">{c.welcome}</p>}{conversation.map((message, index) => <div className={`chat-entry chat-${message.role}`} key={`${message.role}-${index}`}><p className="chat-message">{message.text}</p>{message.handoff && <div className="chat-handoff"><a href={bookingHref}>{c.book} ↗</a><a href="#contact-form" onClick={() => setOpen(false)}>{c.form} ↓</a></div>}</div>)}</div>
      {conversation.length === 0 && <div className="chat-suggestions">{c.suggested.map((question) => <button key={question} onClick={() => send(question)}>{question}</button>)}</div>}
      <p className="chat-warning">{c.warning}</p>
      <form className="chat-form" onSubmit={(event) => { event.preventDefault(); send(); }}><input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} placeholder={c.placeholder} aria-label={c.placeholder} /><button type="submit" disabled={!input.trim()}>{c.send}</button></form>
    </section>}
    <button className="chat-launcher" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? c.close : c.launcher}><span className="chat-mark" aria-hidden="true">W</span>{open ? c.close : c.launcher}</button>
  </>;
}
