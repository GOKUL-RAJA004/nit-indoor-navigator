import { useState } from 'react';
import { useApp } from '../App';
import { nodes, edges, popularRoutes, buildings } from '../data/buildingData';
import { fmtTime } from '../utils/navigation';
import { speak, isVoiceSupported } from '../utils/voice';
import { t } from '../data/i18n';

export default function LeftPanel() {
  const {
    T, lang, voiceOn,
    fromId, toId, setFromId, setToId, setModal, swap, calcRoute,
    routeResult, setRouteResult, quickRoute, panelOpen, setPanelOpen,
    setShowVoice, favorites, toggleFav, recent, navigateTo, showToast, setCurrentFloor,
  } = useApp();
  const [tab, setTab] = useState('directions');

  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const fromNode = fromId ? nodeMap.get(fromId) : null;
  const toNode = toId ? nodeMap.get(toId) : null;

  /* Translate node name */
  const locName = (n) => {
    if (!n) return '';
    const key = `loc_${n.id}`;
    const translated = T(key);
    return translated !== key ? translated : n.name;
  };

  /* Translate popular route label */
  const routeLabel = (pr) => {
    const fromN = nodeMap.get(pr.from);
    const toN = nodeMap.get(pr.to);
    return `${locName(fromN)} → ${locName(toN)}`;
  };

  const handleVoiceReadAll = () => {
    if (!routeResult?.instructions?.length) return;
    const voiceLang = t(lang, 'voiceLang') || 'en-US';
    const full = routeResult.instructions.map(i => i.text).join('. ');
    speak(full, voiceLang);
  };

  // ── Admin add-node form state ──
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('lab');

  return (
    <aside className={`left-panel ${panelOpen ? 'open' : ''}`}>
      {/* ── Route inputs ── */}
      <div className="route-inputs">
        <div className="input-row">
          <span className="input-dot start" />
          <button className="input-btn" onClick={() => { setModal('from'); setPanelOpen(false); }}>
            {fromNode ? <>{fromNode.icon} {locName(fromNode)}</> : <span className="placeholder">{T('chooseStart')}</span>}
          </button>
          <button className="swap-btn" onClick={swap} title={T('swap')}>⇅</button>
        </div>
        <div className="input-row">
          <span className="input-dot end" />
          <button className="input-btn" onClick={() => { setModal('to'); setPanelOpen(false); }}>
            {toNode ? <>{toNode.icon} {locName(toNode)}</> : <span className="placeholder">{T('chooseDest')}</span>}
          </button>
          <button className="mic-btn" onClick={() => setShowVoice(true)} title="Voice">🎤</button>
        </div>
        <div className="route-actions">
          <button className="route-btn primary" onClick={() => calcRoute()} disabled={!fromId || !toId}>
            🧭 {T('route')}
          </button>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="panel-tabs">
        {[
          { id: 'directions', label: `📋 ${T('directions')}` },
          { id: 'favorites', label: `⭐ ${T('favorites')}` },
          { id: 'admin', label: `⚙️ ${T('admin')}` },
        ].map(tb => (
          <button
            key={tb.id}
            className={`panel-tab ${tab === tb.id ? 'active' : ''}`}
            onClick={() => setTab(tb.id)}
          >{tb.label}</button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="dir-panel">

        {/* ====== DIRECTIONS TAB ====== */}
        {tab === 'directions' && (
          <>
            <div className="dir-title">
              📋 {T('directions')}
              <span className="floor-chip">🏢 {T('groundFloor')}</span>
            </div>

            {/* No route yet */}
            {!routeResult && (
              <>
                <div className="hint-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                  <p>{T('instructionHint')}</p>
                </div>

                {/* Recent searches */}
                {recent.length > 0 && (
                  <>
                    <div className="pop-title">{T('recentSearches')}</div>
                    <div className="recent-chips">
                      {recent.slice(0, 6).map(id => {
                        const n = nodeMap.get(id);
                        if (!n) return null;
                        return (
                          <button key={id} className="recent-chip" onClick={() => { setToId(id); }}>
                            {n.icon} {locName(n)}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                <div className="pop-title" style={{ marginTop: 14 }}>{T('popularRoutes')}</div>
                {popularRoutes.map((pr, i) => (
                  <div key={i} className="pop-card anim-fade" onClick={() => quickRoute(pr.from, pr.to)}>
                    <span className="pop-dot">🧭</span>
                    <span className="pop-label">{routeLabel(pr)}</span>
                  </div>
                ))}

                {/* Emergency exit shortcut */}
                <div className="pop-card emergency-card" onClick={() => showToast(T('emergencyExit'), 'info')}>
                  <span className="pop-dot" style={{ background: '#fee2e2', color: '#ef4444' }}>🚨</span>
                  <span className="pop-label" style={{ color: '#ef4444' }}>{T('emergencyExit')}</span>
                </div>
              </>
            )}

            {/* Route results */}
            {routeResult && (
              <div className="anim-fade">
                {isVoiceSupported && (
                  <div className="voice-bar" onClick={handleVoiceReadAll}>
                    <span className="v-icon">{voiceOn ? '🔊' : '🔇'}</span>
                    {T('tapToRead')}
                  </div>
                )}

                <div className="route-summary">
                  <div className="stat-pill"><div className="stat-val">{routeResult.distance} {T('meters') || 'm'}</div><div className="stat-lbl">{T('distance')}</div></div>
                  <div className="stat-pill"><div className="stat-val">{fmtTime(routeResult.walkTimeVal, T)}</div><div className="stat-lbl">{T('estimatedTime') || 'Est. Time'}</div></div>
                  <div className="stat-pill"><div className="stat-val">{routeResult.instructions.filter(i => i.distance > 0 || i.type === 'destination').length}</div><div className="stat-lbl">{T('checkpoints') || 'Checkpoints'}</div></div>
                </div>

                {/* Route includes indicator */}
                <div className="route-includes">
                  {routeResult.path.some(id => nodeMap.get(id)?.type === 'staircase') && <span className="ri-tag stair">🪜 {T('staircases')}</span>}
                  {routeResult.path.some(id => nodeMap.get(id)?.type === 'corridor') && <span className="ri-tag">🚶 {T('corridors')}</span>}
                  <span className="ri-tag">{routeResult.instructions.filter(i => i.type === 'navigate').length} {T('turns')}</span>
                </div>

                <ul className="step-list">
                  {routeResult.instructions.map((step, i) => {
                    if (step.isTransition) {
                      return (
                        <div key={i} className="transition-card" onClick={() => setCurrentFloor(step.floor)} style={{ margin: '15px 0', padding: '15px', background: '#e0e7ff', borderRadius: '12px', border: '2px dashed #818cf8', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                          <div style={{ fontSize: '24px', marginBottom: '5px' }}>{step.icon}</div>
                          <div style={{ fontWeight: 600, color: '#3730a3' }}>{step.text}</div>
                          <div style={{ fontSize: '12px', color: '#4f46e5', marginTop: '4px' }}>Click to view next route segment</div>
                        </div>
                      );
                    }
                    return (
                      <li key={i} className={`step-item ${step.type}`} onClick={() => { if(step.floor) setCurrentFloor(step.floor); }} style={{ cursor: 'pointer' }}>
                        <div className="step-icon">{step.icon}</div>
                        <div>
                          <div className="step-text">{step.text}</div>
                          {step.distance > 0 && <div className="step-dist">~{step.distance} {T('meters')} {T('walk')}</div>}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <button className="clear-route-btn" onClick={() => { setFromId(null); setToId(null); setRouteResult(null); }}>
                  ✕ {T('clearRoute')}
                </button>
              </div>
            )}
          </>
        )}

        {/* ====== FAVORITES TAB ====== */}
        {tab === 'favorites' && (
          <div className="anim-fade">
            <div className="dir-title">⭐ {T('favorites')}</div>
            {favorites.length === 0 ? (
              <div className="hint-card">
                <p style={{ fontSize: 28, marginBottom: 8 }}>⭐</p>
                <p>{T('addFavorite')}</p>
              </div>
            ) : (
              favorites.map(id => {
                const n = nodeMap.get(id);
                if (!n) return null;
                return (
                  <div key={id} className="fav-card">
                    <div className={`fav-icon ${n.type}`}>{n.icon}</div>
                    <div className="fav-info">
                      <strong>{locName(n)}</strong>
                      <span>{n.description}</span>
                    </div>
                    <div className="fav-actions">
                      <button className="fav-go" onClick={() => { setToId(id); setTab('directions'); }}>{T('navigate')} →</button>
                      <button className="fav-rm" onClick={() => toggleFav(id)}>✕</button>
                    </div>
                  </div>
                );
              })
            )}

            {/* Quick access */}
            <div className="pop-title" style={{ marginTop: 20 }}>{T('quickAccess')}</div>
            <div className="quick-grid">
              {['main_gate', 'innovation_hub', 'visveswara_hall', 'principal_room', 'canteen', 'food_court'].map(id => {
                const n = nodeMap.get(id);
                if (!n) return null;
                return (
                  <button key={id} className="quick-card" onClick={() => { setToId(id); setTab('directions'); }}>
                    <span className="qc-icon">{n.icon}</span>
                    <span className="qc-name">{locName(n)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ====== ADMIN TAB ====== */}
        {tab === 'admin' && (
          <div className="anim-fade">
            <div className="dir-title">⚙️ {T('admin')}</div>

            {/* Stats */}
            <div className="admin-stats-row">
              <div className="admin-stat"><span className="as-val">{nodes.filter(n => !n.isWaypoint).length}</span><span className="as-lbl">{T('totalLocations')}</span></div>
              <div className="admin-stat"><span className="as-val">{edges.length}</span><span className="as-lbl">{T('totalConnections')}</span></div>
              <div className="admin-stat"><span className="as-val">{buildings.length}</span><span className="as-lbl">{T('totalBuildings')}</span></div>
              <div className="admin-stat"><span className="as-val">{buildings[0].floors.length}</span><span className="as-lbl">{T('totalFloors')}</span></div>
            </div>

            {/* Add node form */}
            <div className="admin-form">
              <div className="pop-title">➕ {T('addNode')}</div>
              <input className="admin-inp" placeholder={T('search')} value={newName} onChange={e => setNewName(e.target.value)} />
              <select className="admin-inp" value={newType} onChange={e => setNewType(e.target.value)}>
                <option value="lab">{T('labs')}</option>
                <option value="hall">{T('halls')}</option>
                <option value="office">{T('offices')}</option>
                <option value="toilet">{T('toilets')}</option>
                <option value="staircase">{T('staircases')}</option>
                <option value="corridor">{T('corridors')}</option>
                <option value="outdoor">{T('outdoor')}</option>
              </select>
              <button className="admin-add-btn" onClick={() => { showToast(`"${newName || 'Untitled'}" added (demo)`, 'success'); setNewName(''); }}>
                ➕ {T('addNode')}
              </button>
            </div>

            {/* Node list */}
            <div className="pop-title" style={{ marginTop: 16 }}>📍 {T('totalLocations')} ({nodes.filter(n => !n.isWaypoint).length})</div>
            <div className="admin-list">
              {nodes.filter(n => !n.isWaypoint).map(n => (
                <div key={n.id} className="admin-row">
                  <span className="ar-icon">{n.icon}</span>
                  <div className="ar-info"><strong>{locName(n)}</strong><span>{n.type} · ({n.x},{n.y})</span></div>
                </div>
              ))}
            </div>

            {/* Future section */}
            <div className="pop-title" style={{ marginTop: 16 }}>🚀 {T('futureFeatures')}</div>
            <div className="future-list">
              <p>📱 QR-based location detection</p>
              <p>📡 BLE beacon / Wi-Fi indoor positioning</p>
              <p>🗣️ Voice assistance navigation</p>
              <p>🚨 Emergency exit navigation</p>
              <p>♿ Accessibility-friendly routes</p>
              <p>🏗️ Multi-building support</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
