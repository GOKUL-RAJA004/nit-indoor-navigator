import { useApp } from '../App';
import { supportedLanguages } from '../data/i18n';

export default function SettingsPanel() {
  const { T, lang, setLang, voiceOn, setVoiceOn, setShowSettings } = useApp();

  return (
    <>
      <div className="settings-overlay" onClick={() => setShowSettings(false)} />
      <div className="settings-panel">
        <div className="sp-head">
          <h2>⚙️ {T('settings')}</h2>
          <button className="modal-close" onClick={() => setShowSettings(false)}>✕</button>
        </div>
        <div className="sp-body">
          {/* Language */}
          <div className="sp-section">
            <div className="sp-label">🌐 {T('language')}</div>
            <div className="sp-lang-grid">
              {supportedLanguages.map(l => (
                <button key={l.code}
                  className={`sp-lang-btn ${l.code === lang ? 'active' : ''}`}
                  onClick={() => setLang(l.code)}>
                  {l.label}
                </button>
              ))}
            </div>
            <div className="sp-info" style={{ marginTop: '8px' }}>
              Language affects UI labels, navigation instructions, and voice guidance.
            </div>
          </div>

          {/* Voice */}
          <div className="sp-section">
            <div className="sp-label">🔊 {T('voiceGuidance')}</div>
            <div className="sp-toggle">
              <span className="sp-toggle-label">Auto-read directions aloud</span>
              <button className={`toggle-switch ${voiceOn ? 'on' : ''}`}
                onClick={() => setVoiceOn(p => !p)} />
            </div>
            <div className="sp-info">When enabled, route instructions are spoken aloud using the selected language voice.</div>
          </div>

          {/* Route Preferences */}
          <div className="sp-section">
            <div className="sp-label">🧭 Route Preferences</div>
            <div className="sp-toggle">
              <span className="sp-toggle-label">Shortest Path</span>
              <button className="toggle-switch on" />
            </div>
            <div className="sp-toggle">
              <span className="sp-toggle-label">Accessibility Mode</span>
              <button className="toggle-switch" />
            </div>
            <div className="sp-info">Accessibility mode avoids staircases and suggests elevator routes when available.</div>
          </div>

          {/* About */}
          <div className="sp-section">
            <div className="sp-label">ℹ️ {T('about')}</div>
            <div className="sp-info">
              QuickPath v2.0<br />
              Nehru Institute of Technology (Autonomous), Coimbatore<br /><br />
              Smart campus wayfinding system with multilingual voice-guided
              step-by-step indoor navigation. Built for students, faculty,
              staff, and visitors.<br /><br />
              Supported languages: English, Tamil, Hindi, Malayalam, Telugu, Kannada<br />
              Future: QR location, BLE beacons, Wi-Fi positioning, emergency exits
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
