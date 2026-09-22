import { useState } from 'react';
import { siteConfig } from '../../config/public';

const copy = {
  en: { eyebrow: 'Optional first step', title: 'Share the process you want to improve.', body: 'This form is ready for a lead endpoint, but it does not pretend to send anything until one is configured.', name: 'Your name', business: 'Business name', contact: 'Email or WhatsApp', challenge: 'What is getting stuck?', submit: 'Send request', demo: 'Demo capture only — no lead endpoint is configured, so this request was not delivered.', success: 'Your request was received.', error: 'Please try again or email Wakiil directly.', privacy: 'Use business information only. Do not include credentials or private customer data.' },
  so: { eyebrow: 'Tallaabo ikhtiyaari ah', title: 'La wadaag hawsha aad rabto in la hagaajiyo.', body: 'Foomkani wuxuu diyaar u yahay lead endpoint, laakiin ma sheeganayo inuu wax diray ilaa adeeg la xiro.', name: 'Magacaaga', business: 'Magaca ganacsiga', contact: 'Email ama WhatsApp', challenge: 'Maxaa ku xanniban?', submit: 'Dir codsiga', demo: 'Demo oo keliya — lead endpoint lama xirin, sidaas darteed codsigan lama dirin.', success: 'Codsigaaga waa la helay.', error: 'Fadlan mar kale isku day ama email u dir Wakiil.', privacy: 'Isticmaal xog ganacsi oo keliya. Ha gelin sir ama xog macaamiil oo gaar ah.' },
};

export default function LeadCapture({ lang = 'en' }) {
  const c = copy[lang] || copy.en;
  const [form, setForm] = useState({ name: '', business: '', contact: '', challenge: '' });
  const [status, setStatus] = useState('idle');
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!siteConfig.leadEndpoint) { setStatus('demo'); return; }
    setStatus('sending');
    try {
      const response = await fetch(siteConfig.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error('Lead request failed');
      setStatus('success');
      setForm({ name: '', business: '', contact: '', challenge: '' });
    } catch { setStatus('error'); }
  };

  return <section className="lead-capture container"><div className="lead-copy"><div className="eyebrow">{c.eyebrow}</div><h2>{c.title}</h2><p>{c.body}</p></div><form className="lead-form" onSubmit={submit}>{[['name', c.name], ['business', c.business], ['contact', c.contact]].map(([name, label]) => <label key={name}><span>{label}</span><input name={name} value={form[name]} onChange={update} required /></label>)}<label className="lead-wide"><span>{c.challenge}</span><textarea name="challenge" value={form.challenge} onChange={update} rows="4" required /></label><button className="button button-primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? '…' : c.submit} ↗</button><p className="lead-privacy">{c.privacy}</p>{status === 'demo' && <p className="lead-status">{c.demo}</p>}{status === 'success' && <p className="lead-status">{c.success}</p>}{status === 'error' && <p className="lead-status lead-error">{c.error}</p>}</form></section>;
}
