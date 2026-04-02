import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../App';
import { supportedLanguages } from '../data/i18n';

export default function Header() {
  const { T, lang, setLang, setShowSettings, setShowVoice, setPanelOpen } = useApp();
  const [langOpen, setLangOpen] = useState(false);
  const btnRef = useRef();
  const dropRef = useRef();

  // Close on outside click
  useEffect(() => {
    if (!langOpen) return;
    const handler = (e) => {
      if (btnRef.current?.contains(e.target)) return;
      if (dropRef.current?.contains(e.target)) return;
      setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langOpen]);

  // Position dropdown below the globe button
  const [pos, setPos] = useState({ top: 0, right: 0 });
  useEffect(() => {
    if (langOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }, [langOpen]);

  const currentLang = supportedLanguages.find(l => l.code === lang);

  return (
    <header className="header">
      {/* Mobile panel toggle */}
      <button className="panel-toggle" onClick={() => setPanelOpen(p => !p)} title="Menu">☰</button>

      <div className="header-brand">
        <img src="/logo.png" alt="QuickPath" className="header-logo-img" />
        <div className="header-text">
          <h1>{T('collegeName')}</h1>
          <p>{T('subtitle')}</p>
        </div>
      </div>

      <div className="header-spacer" />

      <div className="header-floor">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
        {T('groundFloor')}
      </div>

      <div className="header-actions">
        {/* Language */}
        <button
          ref={btnRef}
          className={`hdr-btn ${langOpen ? 'active' : ''}`}
          onClick={() => setLangOpen(p => !p)}
          title={T('language')}
        >
          🌐
        </button>

        {/* Voice search */}
        <button className="hdr-btn" onClick={() => setShowVoice(true)} title="Voice Search">
          🎤
        </button>

        {/* Settings */}
        <button className="hdr-btn" onClick={() => setShowSettings(true)} title={T('settings')}>
          ⚙️
        </button>

        {/* Profile */}
        <button className="hdr-btn" title={T('profile')}>
          👤
        </button>
      </div>

      {/* Language dropdown rendered as a PORTAL at document.body level to avoid z-index stacking issues */}
      {langOpen && createPortal(
        <>
          <div className="lang-backdrop" onClick={() => setLangOpen(false)} />
          <div
            ref={dropRef}
            className="lang-dropdown"
            style={{ top: pos.top, right: pos.right }}
          >
            {supportedLanguages.map(l => (
              <button
                key={l.code}
                className={l.code === lang ? 'current' : ''}
                onClick={() => { setLang(l.code); setLangOpen(false); }}
              >
                {l.code === lang && <span className="lang-check">✓</span>}
                {l.label}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </header>
  );
}
