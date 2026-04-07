import { useMemo, useRef, useEffect } from 'react';
import { MapContainer, ImageOverlay, CircleMarker, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../App';
import { nodes, buildings } from '../data/buildingData';

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
        {/* Floor plan image — dynamically loaded per floor */}
        <ImageOverlay url={floorData.mapImage} bounds={bounds} opacity={1} />

        {/* ── ACTIVE ROUTE HIGHLIGHT ── */}
        {pathLine && pathLine.map((segment, si) => (
          <span key={si}>
            {/* Glow */}
            <Polyline positions={segment} pathOptions={{ color: '#3b82f6', weight: 12, opacity: 0.15, lineCap: 'round', lineJoin: 'round' }} />
            {/* Main route line */}
            <Polyline positions={segment} pathOptions={{ color: '#2563eb', weight: 5, opacity: 1, lineCap: 'round', lineJoin: 'round' }} />
            {/* Animated dash */}
            <Polyline positions={segment} pathOptions={{ color: '#fff', weight: 2, opacity: 0.7, dashArray: '10 15', lineCap: 'round' }} className="animated-route" />
          </span>
        ))}

        {/* START marker */}
        {fromNode && fromNode.floor === currentFloor && (
          <CircleMarker center={toLL(fromNode.x, fromNode.y, currentFloor)} radius={12}
            pathOptions={{ fillColor: '#10b981', fillOpacity: 1, color: '#fff', weight: 2 }}>
            <Tooltip direction="top" offset={[0, -12]} className="node-label highlight" permanent>
              📍 {nodeName(fromNode)}
            </Tooltip>
          </CircleMarker>
        )}

        {/* END marker */}
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
