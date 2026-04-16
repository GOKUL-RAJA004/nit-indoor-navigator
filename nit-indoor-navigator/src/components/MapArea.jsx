import { useMemo, useRef, useEffect, Fragment } from 'react';
import { MapContainer, ImageOverlay, CircleMarker, Polyline, Tooltip, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../App';
import { nodes, edges, buildings } from '../data/buildingData';

/* ── Department Zone Labels per floor ── */
const deptZoneLabels = {
  '1': [
    { label: 'CSE Department', sub: '(Left Wing)', x: 220, y: 500, color: '#1e40af' },
    { label: 'AIML Department', sub: '(Right Wing)', x: 780, y: 750, color: '#7c3aed' },
  ],
  '2': [
    { label: 'Aeronautical Dept.', sub: '(Left Wing)', x: 250, y: 450, color: '#0369a1' },
    { label: 'IT Department', sub: '(Right Wing)', x: 870, y: 620, color: '#059669' },
  ],
  '3': [
    { label: 'Food Technology', sub: '(Left Wing)', x: 280, y: 420, color: '#b45309' },
    { label: 'Civil Engineering', sub: '(Right Wing)', x: 980, y: 530, color: '#dc2626' },
  ],
  '4': [
    { label: 'Science & Humanities', sub: '(Entire Floor)', x: 420, y: 450, color: '#6d28d9' },
  ],
};

/* ── helpers to get current floor dimensions ── */
function getFloorData(floorLevel) {
  return buildings[0].floors.find(f => f.level === floorLevel) || buildings[0].floors[buildings[0].floors.length - 1];
}

function getBounds(floorLevel) {
  const fd = getFloorData(floorLevel);
  return [[0, 0], [fd.mapHeight, fd.mapWidth]];
}

function toLL(x, y, floorLevel) {
  const fd = getFloorData(floorLevel);
  return [fd.mapHeight - y, x];
}

function Fitter({ path, currentFloor }) {
  const map = useMap();
  const bounds = getBounds(currentFloor);

  useEffect(() => {
    map.fitBounds(bounds, { padding: [10, 10] });
  }, [map, currentFloor]);

  useEffect(() => {
    if (!path?.length) return;
    const nm = new Map(nodes.map(n => [n.id, n]));
    const pts = path
      .map(id => { const n = nm.get(id); return (n && n.floor === currentFloor) ? toLL(n.x, n.y, currentFloor) : null; })
      .filter(Boolean);
    if (pts.length) map.fitBounds(L.latLngBounds(pts), { padding: [60, 60], maxZoom: map.getZoom() });
  }, [path, map, currentFloor]);

  return null;
}

export default function MapArea() {
  const { T, fromId, toId, routeResult, setPanelOpen, currentFloor, setCurrentFloor } = useApp();
  const mapRef = useRef();
  const nm = useMemo(() => new Map(nodes.map(n => [n.id, n])), []);

  const floorData = getFloorData(currentFloor);
  const bounds = getBounds(currentFloor);
  const W = floorData.mapWidth;
  const H = floorData.mapHeight;

  /* ── Graph network: all walkable path edges on current floor (dashed lines) ── */
  const networkLines = useMemo(() => {
    return edges
      .filter(e => e.source_floor === currentFloor && e.target_floor === currentFloor)
      .map(e => {
        const s = nm.get(e.source), t = nm.get(e.target);
        if (!s || !t) return null;
        return [toLL(s.x, s.y, currentFloor), toLL(t.x, t.y, currentFloor)];
      })
      .filter(Boolean);
  }, [currentFloor, nm]);

  /* ── Junction (yellow) nodes on current floor ── */
  const junctionNodes = useMemo(() => {
    return nodes.filter(n => n.isWaypoint && n.floor === currentFloor);
  }, [currentFloor]);

  /* ── Destination (blue) nodes on current floor ── */
  const destinationMarkers = useMemo(() => {
    return nodes.filter(n => !n.isWaypoint && n.floor === currentFloor);
  }, [currentFloor]);

  /* Path line filtered to current floor only */
  const pathLine = useMemo(() => {
    if (!routeResult?.path?.length) return null;
    const segments = [];
    let current = [];
    routeResult.path.forEach(id => {
      const n = nm.get(id);
      if (n && n.floor === currentFloor) {
        current.push(toLL(n.x, n.y, currentFloor));
      } else {
        if (current.length > 1) segments.push([...current]);
        current = [];
      }
    });
    if (current.length > 1) segments.push(current);
    return segments.length > 0 ? segments : null;
  }, [routeResult, nm, currentFloor]);

  const nodeName = (n) => T(`loc_${n.id}`) !== `loc_${n.id}` ? T(`loc_${n.id}`) : n.name;

  const zoomIn = () => mapRef.current?.setZoom((mapRef.current.getZoom() || 0) + 0.5);
  const zoomOut = () => mapRef.current?.setZoom((mapRef.current.getZoom() || 0) - 0.5);
  const resetView = () => mapRef.current?.fitBounds(bounds, { padding: [10, 10] });

  const fromNode = fromId ? nm.get(fromId) : null;
  const toNode = toId ? nm.get(toId) : null;

  return (
    <div className="map-area">
      <button className="panel-toggle" onClick={() => setPanelOpen(p => !p)}>☰</button>

      <MapContainer
        crs={L.CRS.Simple} bounds={bounds}
        maxBounds={[[-100, -100], [H + 100, W + 100]]}
        maxBoundsViscosity={1} zoom={0} minZoom={-2} maxZoom={3}
        zoomSnap={0.25} zoomDelta={0.5} attributionControl={false}
        style={{ width: '100%', height: '100%' }}
        ref={mapRef}
      >
        <Fitter path={routeResult?.path} currentFloor={currentFloor} />
        {/* Floor plan image */}
        <ImageOverlay url={floorData.mapImage} bounds={bounds} opacity={1} />

        {/* ── DEPARTMENT ZONE LABELS ── */}
        {(deptZoneLabels[currentFloor] || []).map((zone, i) => (
          <Marker
            key={`dept-${currentFloor}-${i}`}
            position={toLL(zone.x, zone.y, currentFloor)}
            icon={L.divIcon({
              className: '',
              html: `<div style="
                background: rgba(255,255,255,0.88);
                backdrop-filter: blur(4px);
                border: 2px solid ${zone.color};
                border-radius: 8px;
                padding: 6px 14px;
                text-align: center;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(0,0,0,0.12);
                pointer-events: none;
              ">
                <div style="font-family: 'Outfit',sans-serif; font-size: 13px; font-weight: 700; color: ${zone.color}; line-height: 1.3;">${zone.label}</div>
                <div style="font-family: 'Inter',sans-serif; font-size: 10px; font-weight: 500; color: #64748b; margin-top: 1px;">${zone.sub}</div>
              </div>`,
              iconSize: [0, 0],
              iconAnchor: [0, 0],
            })}
            interactive={false}
          />
        ))}

        {/* ── GRAPH NETWORK: Walkable paths (black dashed lines) — hidden during active route ── */}
        {!routeResult && networkLines.map((line, i) => (
          <Polyline key={`net-${i}`} positions={line} pathOptions={{
            color: '#64748b', weight: 1.5, opacity: 0.3, dashArray: '4 6'
          }} />
        ))}

        {/* ── GRAPH NETWORK: Junction nodes (yellow dots) ── */}
        {junctionNodes.map(n => (
          <CircleMarker key={n.id} center={toLL(n.x, n.y, currentFloor)} radius={4}
            pathOptions={{ fillColor: '#f59e0b', fillOpacity: 0.8, color: '#d97706', weight: 1 }}>
            <Tooltip direction="top" offset={[0, -6]} className="node-label-small">
              {n.id}
            </Tooltip>
          </CircleMarker>
        ))}

        {/* ── GRAPH NETWORK: Destination nodes (blue dots) — shown when no route ── */}
        {!routeResult && destinationMarkers.map(n => (
          <CircleMarker key={`dest-${n.id}`} center={toLL(n.x, n.y, currentFloor)} radius={6}
            pathOptions={{ fillColor: '#3b82f6', fillOpacity: 0.85, color: '#fff', weight: 1.5 }}>
            <Tooltip direction="top" offset={[0, -8]} className="node-label">
              {n.icon} {nodeName(n)}
            </Tooltip>
          </CircleMarker>
        ))}

        {/* ── ACTIVE ROUTE PATH (blue highlight) ── */}
        {pathLine && pathLine.map((segment, si) => (
          <Fragment key={si}>
            {/* Glow */}
            <Polyline positions={segment} pathOptions={{ color: '#3b82f6', weight: 12, opacity: 0.15, lineCap: 'round', lineJoin: 'round' }} />
            {/* Main route line */}
            <Polyline positions={segment} pathOptions={{ color: '#2563eb', weight: 5, opacity: 1, lineCap: 'round', lineJoin: 'round' }} />
            {/* Animated dash */}
            <Polyline positions={segment} pathOptions={{ color: '#fff', weight: 2, opacity: 0.7, dashArray: '10 15', lineCap: 'round' }} className="animated-route" />
          </Fragment>
        ))}

        {/* START marker (green) */}
        {fromNode && fromNode.floor === currentFloor && (
          <CircleMarker center={toLL(fromNode.x, fromNode.y, currentFloor)} radius={12}
            pathOptions={{ fillColor: '#10b981', fillOpacity: 1, color: '#fff', weight: 2 }}>
            <Tooltip direction="top" offset={[0, -12]} className="node-label highlight" permanent>
              📍 {nodeName(fromNode)}
            </Tooltip>
          </CircleMarker>
        )}

        {/* END marker (red) */}
        {toNode && toNode.floor === currentFloor && (
          <CircleMarker center={toLL(toNode.x, toNode.y, currentFloor)} radius={12}
            pathOptions={{ fillColor: '#ef4444', fillOpacity: 1, color: '#fff', weight: 2 }}>
            <Tooltip direction="top" offset={[0, -12]} className="node-label highlight" permanent>
              🏁 {nodeName(toNode)}
            </Tooltip>
          </CircleMarker>
        )}
      </MapContainer>

      <div className="map-floor-label">
        {floorData.name} – NEHRU INSTITUTE OF TECHNOLOGY
      </div>

      <div className="floor-switcher">
        {buildings[0].floors.map(f => (
          <button key={f.level} className={`floor-sw-btn ${f.level === currentFloor ? 'active' : ''}`} onClick={() => setCurrentFloor(f.level)}>
            {f.name.replace(' Floor', 'F').replace('Ground', 'G')}
          </button>
        ))}
      </div>

      <div className="map-controls">
        <button className="map-ctrl-btn" onClick={zoomIn} title={T('zoomIn')}>+</button>
        <button className="map-ctrl-btn" onClick={zoomOut} title={T('zoomOut')}>−</button>
        <button className="map-ctrl-btn" onClick={resetView} title={T('resetView')}>⌖</button>
      </div>
    </div>
  );
}
