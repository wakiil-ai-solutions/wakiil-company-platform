import { useState } from 'react';
import { siteConfig } from '../../config/public';

const copy = {
  en: {
    eyebrow: 'Discovery request', title: 'Tell us where work is getting stuck.',
    body: 'Share the operation you want to improve. We will understand the process before recommending a pilot.',
    name: 'Full name', business: 'Business name', contact: 'Email or WhatsApp contact', market: 'Country or market',
    challenge: 'Main operational challenge', nextStep: 'Preferred next step', options: ['Book a Discovery Call', 'Ask a question first', 'Request a scoped proposal'],
    submit: 'Send my request', demo: 'Demo mode: no lead endpoint is configured, so this request was not delivered.',
    success: 'Your request was received.', error: 'We could not send your request. Please email Wakiil directly.',
    privacy: 'Please share business contact details only. Do not include passwords, payment details, or private customer information.',
  },
  so: {
    eyebrow: 'Codsi kulan hordhac ah', title: 'Noo sheeg meesha shaqadu ku xanniban tahay.',
    body: 'La wadaag hawsha aad rabto in la hagaajiyo. Habka ayaan fahmaynaa ka hor inta aanan kugula talin tijaabo.',
    name: 'Magaca oo buuxa', business: 'Magaca ganacsiga', contact: 'Email ama WhatsApp', market: 'Dalka ama suuqa',
    challenge: 'Caqabadda hawlgalka', nextStep: 'Tallaabada xigta ee aad doorbidayso', options: ['Qabso kulan hordhac ah', 'Marka hore su’aal weydii', 'Codso soo-jeedin baaxad leh'],
    submit: 'Dir codsigayga', demo: 'Habka demo-ga: lead endpoint lama xirin, sidaas darteed codsigan lama dirin.',
    success: 'Codsigaaga waa la helay.', error: 'Codsiga lama diri karin. Fadlan email toos ah u dir Wakiil.',
    privacy: 'Fadlan wadaag xogta xiriirka ganacsiga oo keliya. Ha gelin furaha sirta, xog lacag-bixin, ama xog macaamiil oo gaar ah.',
  },
};

const emptyForm = { name: '', business: '', contact: '', market: '', challenge: '', nextStep: '' };

export default function LeadCapture({ lang = 'en', id = 'contact-form' }) {
  const c = copy[lang] || copy.en;
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState('idle');
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!siteConfig.leadEndpoint) { setStatus('demo'); return; }
    setStatus('sending');
    try {
      const response = await fetch(siteConfig.leadEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, language: lang }),
      });
      if (!response.ok) throw new Error('Lead request failed');
      setStatus('success');
      setForm(emptyForm);
    } catch { setStatus('error'); }
  };

  return <section className="lead-capture" id={id}>
    <div className="lead-copy"><div className="eyebrow">{c.eyebrow}</div><h3>{c.title}</h3><p>{c.body}</p></div>
    <form className="lead-form" onSubmit={submit}>
      <label><span>{c.name}</span><input name="name" autoComplete="name" value={form.name} onChange={update} required /></label>
      <label><span>{c.business}</span><input name="business" autoComplete="organization" value={form.business} onChange={update} required /></label>
      <label><span>{c.contact}</span><input name="contact" autoComplete="email" value={form.contact} onChange={update} required /></label>
      <label><span>{c.market}</span><input name="market" autoComplete="country-name" value={form.market} onChange={update} required /></label>
      <label className="lead-wide"><span>{c.challenge}</span><textarea name="challenge" value={form.challenge} onChange={update} rows="4" required /></label>
      <label className="lead-wide"><span>{c.nextStep}</span><select name="nextStep" value={form.nextStep} onChange={update} required><option value="">—</option>{c.options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
      <button className="button button-primary" type="submit" disabled={status === 'sending'}>{status === 'sending' ? '…' : c.submit}<span aria-hidden="true">↗</span></button>
      <p className="lead-privacy">{c.privacy}</p>
      <p className={`lead-status ${status === 'error' ? 'lead-error' : ''}`} aria-live="polite">{status === 'demo' ? c.demo : status === 'success' ? c.success : status === 'error' ? c.error : ''}</p>
    </form>
  </section>;
}
