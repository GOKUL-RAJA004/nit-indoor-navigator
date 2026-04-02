import { useState, useMemo } from 'react';
import { useApp } from '../App';
import { nodes, categories } from '../data/buildingData';
import { searchNodes } from '../utils/navigation';

export default function LocationModal() {
  const { T, modal, onSelectLocation, setModal, favorites, toggleFav } = useApp();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');

  const list = useMemo(() => {
    let r = searchNodes(q);
    if (cat !== 'all') r = r.filter(n => n.type === cat);
    return r;
  }, [q, cat]);

  return (
    <div className="modal-overlay" onClick={() => setModal(null)}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{modal === 'from' ? T('chooseStart') : T('chooseDest')}</h2>
          <button className="modal-close" onClick={() => setModal(null)}>✕</button>
        </div>

        <div className="modal-search">
          <input
            type="text" placeholder={T('search')} value={q}
            onChange={e => setQ(e.target.value)} autoFocus
          />
        </div>

        <div className="modal-cats">
          {categories.map(c => (
            <button key={c.id} className={`m-chip ${cat === c.id ? 'active' : ''}`}
              onClick={() => setCat(c.id)}>
              <span>{c.icon}</span> {T(c.id) || c.name}
            </button>
          ))}
        </div>

        <div className="modal-list">
          {list.length === 0 && <div className="modal-empty">🔍 {T('noResults')}</div>}
          {list.map(n => {
            const locKey = `loc_${n.id}`;
            const name = T(locKey) !== locKey ? T(locKey) : n.name;
            return (
            <div key={n.id} className="modal-item">
              <div className={`modal-item-icon ${n.type}`}>{n.icon}</div>
              <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => onSelectLocation(n.id)}>
                <h4>{name}</h4>
                <p>{n.description}</p>
              </div>
              <button
                className="fav-star-btn"
                onClick={(e) => { e.stopPropagation(); toggleFav(n.id); }}
                title={favorites.includes(n.id) ? T('removeFavorite') : T('addFavorite')}
                style={{
                  border: 'none', background: 'none', fontSize: '18px', cursor: 'pointer',
                  color: favorites.includes(n.id) ? '#f59e0b' : '#cbd5e1',
                  transition: 'color .15s', flexShrink: 0,
                }}
              >
                {favorites.includes(n.id) ? '★' : '☆'}
              </button>
            </div>
            );})}

        </div>
      </div>
    </div>
  );
}
