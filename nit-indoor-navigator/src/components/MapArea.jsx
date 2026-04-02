import { useMemo, useRef, useEffect } from 'react';
import { MapContainer, ImageOverlay, CircleMarker, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../App';
import { nodes, edges, buildings } from '../data/buildingData';

const W = 1024, H = 766;
const BOUNDS = [[0, 0], [H, W]];
const toLL = (x, y) => [H - y, x];

function Fitter({ path }) {
  const map = useMap();
  useEffect(() => { map.fitBounds(BOUNDS, { padding: [10, 10] }); }, [map]);
  useEffect(() => {
    if (!path?.length) return;
    const nm = new Map(nodes.map(n => [n.id, n]));
    const pts = path.map(id => { const n = nm.get(id); return n ? toLL(n.x, n.y) : null; }).filter(Boolean);
    if (pts.length) map.fitBounds(L.latLngBounds(pts), { padding: [60, 60], maxZoom: map.getZoom() });
  }, [path, map]);
  return null;
}

export default function MapArea() {
  const { T, fromId, toId, routeResult, setPanelOpen } = useApp();
  const mapRef = useRef();
  const nm = useMemo(() => new Map(nodes.map(n => [n.id, n])), []);

  /* Full path line through ALL nodes including waypoints — this traces the corridors */
  const pathLine = useMemo(() => {
    if (!routeResult?.path?.length) return null;
    return routeResult.path.map(id => {
      const n = nm.get(id);
      return n ? toLL(n.x, n.y) : null;
    }).filter(Boolean);
  }, [routeResult, nm]);

  const nodeName = (n) => T(`loc_${n.id}`) !== `loc_${n.id}` ? T(`loc_${n.id}`) : n.name;

  const zoomIn = () => mapRef.current?.setZoom((mapRef.current.getZoom() || 0) + 0.5);
  const zoomOut = () => mapRef.current?.setZoom((mapRef.current.getZoom() || 0) - 0.5);
  const resetView = () => mapRef.current?.fitBounds(BOUNDS, { padding: [10, 10] });

  const fromNode = fromId ? nm.get(fromId) : null;
  const toNode = toId ? nm.get(toId) : null;

  return (
    <div className="map-area">
      <button className="panel-toggle" onClick={() => setPanelOpen(p => !p)}>☰</button>

      <MapContainer
        crs={L.CRS.Simple} bounds={BOUNDS}
        maxBounds={[[-50, -50], [H + 50, W + 50]]}
        maxBoundsViscosity={1} zoom={0} minZoom={-1} maxZoom={3}
        zoomSnap={0.25} zoomDelta={0.5} attributionControl={false}
        style={{ width: '100%', height: '100%' }}
        ref={mapRef}
      >
        <Fitter path={routeResult?.path} />
        {/* Floor plan image already contains blue dots (nodes), yellow dots (waypoints), and dashed lines (paths) */}
        <ImageOverlay url="/ground_floor.png" bounds={BOUNDS} opacity={1} />

        {/* ── ACTIVE ROUTE HIGHLIGHT (only shown when user selects a route) ── */}
        {pathLine && (
          <>
            {/* Glow */}
            <Polyline positions={pathLine} pathOptions={{ color: '#3b82f6', weight: 12, opacity: 0.15, lineCap: 'round', lineJoin: 'round' }} />
            {/* Main route line */}
            <Polyline positions={pathLine} pathOptions={{ color: '#2563eb', weight: 5, opacity: 1, lineCap: 'round', lineJoin: 'round' }} />
            {/* Animated white dash overlay for movement effect */}
            <Polyline positions={pathLine} pathOptions={{ color: '#fff', weight: 2, opacity: 0.7, dashArray: '10 15', lineCap: 'round' }} className="animated-route" />
          </>
        )}

        {/* START marker — only when a start location is selected */}
        {fromNode && (
          <CircleMarker center={toLL(fromNode.x, fromNode.y)} radius={12}
            pathOptions={{ fillColor: '#10b981', fillOpacity: 1, color: '#fff', weight: 2 }}>
            <Tooltip direction="top" offset={[0, -12]} className="node-label highlight" permanent>
              📍 {nodeName(fromNode)}
            </Tooltip>
          </CircleMarker>
        )}

        {/* END marker — only when a destination is selected */}
        {toNode && (
          <CircleMarker center={toLL(toNode.x, toNode.y)} radius={12}
            pathOptions={{ fillColor: '#ef4444', fillOpacity: 1, color: '#fff', weight: 2 }}>
            <Tooltip direction="top" offset={[0, -12]} className="node-label highlight" permanent>
              🏁 {nodeName(toNode)}
            </Tooltip>
          </CircleMarker>
        )}
      </MapContainer>

      <div className="map-floor-label">
        {T('groundFloor')} – NEHRU INSTITUTE OF TECHNOLOGY
      </div>

      <div className="floor-switcher">
        {buildings[0].floors.map(f => (
          <button key={f.level} className={`floor-sw-btn ${f.level === 0 ? 'active' : ''}`}>
            {f.name.replace('Floor', 'F')}
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
