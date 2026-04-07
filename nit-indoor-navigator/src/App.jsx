import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import MapArea from './components/MapArea';
import LocationModal from './components/LocationModal';
import SettingsPanel from './components/SettingsPanel';
import VoiceOverlay from './components/VoiceOverlay';
import Toast from './components/Toast';
import SplashScreen from './components/SplashScreen';
import { t } from './data/i18n';
import { dijkstra, generateInstructions, walkTime, fmtTime, searchNodes } from './utils/navigation';
import { nodes } from './data/buildingData';
import { speak, speakInstructions, stopSpeaking, startListening, stopListening, parseVoiceCommand } from './utils/voice';

export const AppCtx = createContext();
export const useApp = () => useContext(AppCtx);

export default function App() {
  // -- splash
  const [splash, setSplash] = useState(true);
  useEffect(() => { setTimeout(() => setSplash(false), 2200); }, []);

  // -- global state
  const [lang, setLang] = useState(() => localStorage.getItem('nit-lang') || 'ta');
  const [voiceOn, setVoiceOn] = useState(() => localStorage.getItem('nit-voice') !== 'off');
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nit-favs') || '[]'); } catch { return []; }
  });
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nit-recent') || '[]'); } catch { return []; }
  });

  // persist
  useEffect(() => { localStorage.setItem('nit-lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('nit-voice', voiceOn ? 'on' : 'off'); }, [voiceOn]);
  useEffect(() => { localStorage.setItem('nit-favs', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('nit-recent', JSON.stringify(recent)); }, [recent]);

  // -- navigation
  const [fromId, setFromId] = useState(null);
  const [toId, setToId] = useState(null);
  const [routeResult, setRouteResult] = useState(null);

  // -- UI
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);        // 'from' | 'to' | null
  const [showSettings, setShowSettings] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentFloor, setCurrentFloor] = useState('0');

  // translation helper
  const T = useCallback((key) => t(lang, key), [lang]);

  // toast helper
  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // toggle favorite
  const toggleFav = (id) => {
    setFavorites(prev => {
      if (prev.includes(id)) { showToast(T('removeFavorite')); return prev.filter(x => x !== id); }
      showToast(T('addFavorite') + ' ⭐', 'success');
      return [...prev, id];
    });
  };

  // add to recent
  const addRecent = (id) => {
    setRecent(prev => [id, ...prev.filter(x => x !== id)].slice(0, 8));
  };

  // calculate route
  const calcRoute = useCallback((from = fromId, to = toId) => {
    if (!from || !to) { showToast(T('noRoute'), 'error'); return; }
    if (from === to) { showToast(T('noRoute'), 'error'); return; }
    const r = dijkstra(from, to);
    if (!r.found) { showToast('No path found', 'error'); return; }
    const ins = generateInstructions(r.path, T);
    const wt = walkTime(r.distance);
    setRouteResult({ ...r, instructions: ins, walkTimeVal: wt });
    
    // auto-switch to the starting floor
    const startNode = nodes.find(n => n.id === from);
    if (startNode) setCurrentFloor(startNode.floor);

    showToast(T('routeFound'), 'success');
    addRecent(to);

    if (voiceOn) {
      const voiceLang = t(lang, 'voiceLang') || 'en-US';
      speakInstructions(ins, voiceLang);
    }
  }, [fromId, toId, T, lang, voiceOn]);

  // quick route (from popular)
  const quickRoute = (from, to) => {
    setFromId(from);
    setToId(to);
    setTimeout(() => {
      const r = dijkstra(from, to);
      if (!r.found) return;
      const ins = generateInstructions(r.path, T);
      const wt = walkTime(r.distance);
      setRouteResult({ ...r, instructions: ins, walkTimeVal: wt });
      
      const startNode = nodes.find(n => n.id === from);
      if (startNode) setCurrentFloor(startNode.floor);

      showToast(T('routeFound'), 'success');
      if (voiceOn) speakInstructions(ins, t(lang, 'voiceLang') || 'en-US');
    }, 100);
  };

  // navigate to (from home quick-tap)
  const navigateTo = (destId) => {
    setToId(destId);
    addRecent(destId);
  };

  // swap
  const swap = () => {
    setFromId(toId); setToId(fromId); setRouteResult(null); stopSpeaking();
  };

  // Re-generate instructions when language changes
  useEffect(() => {
    if (routeResult?.path?.length) {
      const ins = generateInstructions(routeResult.path, T);
      setRouteResult(prev => prev ? { ...prev, instructions: ins } : null);
    }
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // voice search handler
  const onVoiceResult = (transcript) => {
    if (!transcript) {
      setShowVoice(false);
      return;
    }
    const lcTrans = transcript.toLowerCase();
    const visible = nodes.filter(n => !n.isWaypoint);
    let bestMatch = null;

    // Search transcript for any matches of location names (English + Native language + Tags)
    for (const n of visible) {
      const nameEn = n.name.toLowerCase();
      const key = `loc_${n.id}`;
      const translated = T(key);
      const nameLocal = translated !== key ? translated.toLowerCase() : '';

      if (
        lcTrans.includes(nameEn) ||
        (nameLocal && lcTrans.includes(nameLocal)) ||
        n.searchTags.some(t => lcTrans.includes(t.toLowerCase()))
      ) {
        bestMatch = n; break;
      }
    }

    if (bestMatch) {
      const destName = T(`loc_${bestMatch.id}`) !== `loc_${bestMatch.id}` ? T(`loc_${bestMatch.id}`) : bestMatch.name;
      setToId(bestMatch.id);
      addRecent(bestMatch.id);
      showToast(`Destination: ${destName}`, 'success');

      // Auto-trigger navigation
      const startNode = fromId || 'main_gate';
      if (!fromId) {
        setFromId('main_gate');
        showToast('Defaulting start to Main Gate.', 'info');
      }
      setTimeout(() => calcRoute(startNode, bestMatch.id), 100);
    } else {
      showToast(`${T('noResults')}: "${transcript}"`, 'error');
    }
    setShowVoice(false);
  };

  // select handler from modal
  const onSelectLocation = (id) => {
    if (modal === 'from') setFromId(id);
    else if (modal === 'to') { setToId(id); addRecent(id); }
    setModal(null);
    setRouteResult(null); stopSpeaking();
  };

  if (splash) return <SplashScreen />;

  const ctx = {
    lang, setLang, T,
    voiceOn, setVoiceOn,
    fromId, setFromId, toId, setToId,
    routeResult, setRouteResult, calcRoute, quickRoute, swap, navigateTo,
    favorites, toggleFav, recent,
    showToast,
    modal, setModal, onSelectLocation,
    showSettings, setShowSettings,
    showVoice, setShowVoice, onVoiceResult,
    panelOpen, setPanelOpen,
    currentFloor, setCurrentFloor,
  };

  return (
    <AppCtx.Provider value={ctx}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />
        <div className="main-layout">
          {/* Mobile shade */}
          {panelOpen && <div className="mobile-shade" onClick={() => setPanelOpen(false)} />}
          <LeftPanel />
          <MapArea />
        </div>
      </div>
      {modal && <LocationModal />}
      {showSettings && <SettingsPanel />}
      {showVoice && <VoiceOverlay />}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </AppCtx.Provider>
  );
}
