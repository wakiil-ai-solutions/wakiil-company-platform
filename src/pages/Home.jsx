import { useEffect, useState } from 'react';
import { homeContent } from '../data/home-content';
import { siteConfig } from '../config/public';
import LeadCapture from '../components/sections/LeadCapture';

function ControlLayer({ content }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % content.flow.length), 1900);
    return () => window.clearInterval(timer);
  }, [content.flow.length]);

  return <section className="control-layer" aria-label={content.flowTitle}>
    <div className="control-layer-head"><span className="eyebrow">{content.flowTitle}</span><span className="control-state" aria-live="polite">{content.flow[active][1]}</span></div>
    <ol className="control-flow">{content.flow.map(([label, state], index) => <li className={index === active ? 'is-active' : index < active ? 'is-complete' : ''} key={label} aria-current={index === active ? 'step' : undefined}><span className="control-node">{index < active ? '✓' : String(index + 1).padStart(2, '0')}</span><span className="control-label">{label}</span><small>{state}</small></li>)}</ol>
    <div className="control-layer-foot"><span>WAKIIL AI</span><span>{String(active + 1).padStart(2, '0')} / {String(content.flow.length).padStart(2, '0')}</span></div>
  </section>;
}

function Heading({ eyebrow, title, body }) {
  return <div className="section-heading"><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{body && <p>{body}</p>}</div>;
}

export default function Home({ c, lang = 'en' }) {
  const h = homeContent[lang] || homeContent.en;
  const bookingHref = siteConfig.bookingUrl || `mailto:${siteConfig.contactEmail}?subject=Wakiil%20discovery%20call`;

  return <main className="home-page">
    <section className="home-hero container">
      <div className="hero-copy">
        <div className="eyebrow">{h.hero.eyebrow}</div>
        <h1>{h.hero.title}</h1>
        <p className="hero-solution">{h.hero.solution}</p>
        <p className="hero-intro">{h.hero.support}</p>
        <div className="hero-actions"><a className="button button-primary" href={bookingHref}>{h.hero.primary}<span aria-hidden="true">↗</span></a><a className="button button-ghost" href="#how-it-works">{h.hero.secondary}<span aria-hidden="true">↓</span></a></div>
        <ul className="hero-trust">{h.hero.trust.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
      </div>
      <div className="hero-visual"><ControlLayer content={h.hero} /><div className="visual-caption"><span>WAKIIL AI</span><span>{lang === 'so' ? 'Codsi ilaa xal' : 'Request to resolution'}</span></div></div>
    </section>

    <section className="problem-section section" id="problem"><div className="container problem-layout">
      <div className="problem-copy"><Heading eyebrow={h.problems.eyebrow} title={h.problems.title} body={h.problems.intro} /><p className="problem-solution">{h.problems.solution}</p></div>
      <ul className="problem-list">{h.problems.items.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul>
    </div></section>

    <section className="section container" id="solutions"><Heading eyebrow={h.capabilities.eyebrow} title={h.capabilities.title} body={h.capabilities.intro} /><div className="home-capabilities">{h.capabilities.items.map((item, index) => <article className="home-capability" key={item.title}><span className="capability-index">0{index + 1}</span><h3>{item.title}</h3><p>{item.body}</p><ul>{item.examples.map((example) => <li key={example}>{example}</li>)}</ul></article>)}</div></section>

    <section className="industry-section section" id="industries"><div className="container"><Heading eyebrow={h.industries.eyebrow} title={h.industries.title} body={h.industries.intro} /><div className="industry-layout"><ol className="industry-list">{h.industries.categories.map((category, index) => <li key={category}><span>0{index + 1}</span>{category}</li>)}</ol><aside className="industry-operations"><div className="eyebrow">{h.industries.problemsTitle}</div><ul>{h.industries.problems.map((problem) => <li key={problem}>{problem}<span aria-hidden="true">↗</span></li>)}</ul></aside></div></div></section>

    <section className="logistics-section section container" id="logistics"><div className="logistics-intro"><div className="eyebrow">{h.logistics.eyebrow}</div><h2>{h.logistics.title}</h2><p>{h.logistics.intro}</p><div className="verified-wedge"><span>MKD-0066</span><p>{h.logistics.wedge}</p></div></div><div className="roadmap"><div className="eyebrow">{h.logistics.roadmapTitle}</div><ol>{h.logistics.roadmap.map((item, index) => <li className={index === 0 ? 'roadmap-verified' : 'roadmap-expansion'} key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong>{index < h.logistics.roadmap.length - 1 && <i aria-hidden="true">→</i>}</li>)}</ol><p>{h.logistics.expansion}</p></div></section>

    <section className="comparison-section section"><div className="container"><Heading eyebrow={h.comparison.eyebrow} title={h.comparison.title} /><div className="comparison-layout"><article className="comparison-basic"><div className="eyebrow">{h.comparison.chatbot}</div><ol>{h.comparison.chatbotFlow.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></article><article className="comparison-wakiil"><div className="eyebrow">{h.comparison.automation}</div><ol>{h.comparison.automationFlow.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></article></div><p className="comparison-note">{h.comparison.body}</p></div></section>

    <section className="process-section section" id="how-it-works"><div className="container"><Heading eyebrow={h.process.eyebrow} title={h.process.title} body={h.process.intro} /><ol className="process-home-grid">{h.process.steps.map(([number, title, body]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></li>)}</ol><a className="text-link" href="#/method">{c.nav.method} <span aria-hidden="true">↗</span></a></div></section>

    <section className="proof-home section container" id="proof"><div className="proof-home-intro"><div className="eyebrow">{h.proof.eyebrow}</div><h2>{h.proof.title}</h2><p className="proof-disclaimer">{h.proof.disclaimer}</p><a className="button button-ghost" href="#/demo">{h.proof.button}<span aria-hidden="true">↗</span></a></div><div className="proof-home-evidence"><ol>{h.proof.steps.map((step, index) => <li key={step}><span>0{index + 1}</span>{step}</li>)}</ol><div className="proof-controls"><div className="eyebrow">{lang === 'so' ? 'Xakameyn la muujiyay' : 'Controls demonstrated'}</div><ul>{h.proof.controls.map((item) => <li key={item}>{item}</li>)}</ul></div></div></section>

    <section className="security-home section" id="security"><div className="container"><div className="security-home-heading"><Heading eyebrow={h.security.eyebrow} title={h.security.title} /><p>{h.security.body}</p></div><ul className="security-home-controls">{h.security.controls.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul><p className="security-home-note">{h.security.note}</p><a className="text-link" href="#/security">{c.nav.security} <span aria-hidden="true">↗</span></a></div></section>

    <section className="home-contact section" id="contact"><div className="container home-contact-layout"><div className="home-contact-copy"><div className="eyebrow">{h.closing.eyebrow}</div><h2>{h.closing.title}</h2><p>{h.closing.body}</p><a className="button button-primary" href={bookingHref}>{h.closing.cta}<span aria-hidden="true">↗</span></a><p className="pricing-note">{h.closing.pricing}</p></div><LeadCapture lang={lang} /></div></section>
  </main>;
}
