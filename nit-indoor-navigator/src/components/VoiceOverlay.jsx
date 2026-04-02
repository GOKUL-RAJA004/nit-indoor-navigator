import { useState, useEffect } from 'react';
import { useApp } from '../App';
import { startListening, stopListening, isRecognitionSupported } from '../utils/voice';
import { t } from '../data/i18n';

export default function VoiceOverlay() {
  const { T, lang, setShowVoice, onVoiceResult } = useApp();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isRecognitionSupported) {
      setError('Speech recognition is not supported in this browser. Try Chrome.');
      return;
    }
    setListening(true);
    const voiceLang = t(lang, 'voiceLang') || 'en-US';
    startListening(
      voiceLang,
      (text) => { setTranscript(text); setListening(false); setTimeout(() => onVoiceResult(text), 600); },
      () => setListening(false),
      (err) => { setError(String(err)); setListening(false); },
    );
    return () => stopListening();
  }, []);

  return (
    <div className="voice-overlay" onClick={() => { stopListening(); setShowVoice(false); }}>
      <div className="voice-box" onClick={e => e.stopPropagation()}>
        <div className="mic-anim">🎤</div>
        <h3>{listening ? (T('voiceListening') || 'Listening…') : (error || 'Done')}</h3>
        <p>{T('voiceSpeak') || 'Say a destination, e.g. "Take me to Principal Room"'}</p>
        {transcript && <div className="transcript">"{transcript}"</div>}
        {error && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>{error}</p>}
        <button onClick={() => { stopListening(); setShowVoice(false); }}>
          {T('close') || 'Close'}
        </button>
      </div>
    </div>
  );
}
