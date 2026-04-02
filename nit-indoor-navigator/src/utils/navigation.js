/**
 * Navigation Engine — QuickPath
 * Dijkstra shortest path through yellow waypoint network
 * Waypoint nodes are hidden from search results and simplified in instructions
 */
import { nodes, edges } from '../data/buildingData';

/* ── graph ── */
export function buildGraph() {
  const g = new Map();
  nodes.forEach(n => g.set(n.id, []));
  edges.forEach(([a, b, w]) => {
    g.get(a)?.push({ neighbor: b, weight: w });
    g.get(b)?.push({ neighbor: a, weight: w });
  });
  return g;
}

/* ── dijkstra ── */
export function dijkstra(startId, endId) {
  const g = buildGraph();
  const dist = new Map(), prev = new Map(), visited = new Set(), q = [];
  nodes.forEach(n => { dist.set(n.id, Infinity); prev.set(n.id, null); });
  dist.set(startId, 0);
  q.push({ id: startId, d: 0 });

  while (q.length) {
    q.sort((a, b) => a.d - b.d);
    const cur = q.shift();
    if (visited.has(cur.id)) continue;
    visited.add(cur.id);
    if (cur.id === endId) break;
    for (const { neighbor, weight } of g.get(cur.id) || []) {
      if (visited.has(neighbor)) continue;
      const nd = dist.get(cur.id) + weight;
      if (nd < dist.get(neighbor)) {
        dist.set(neighbor, nd);
        prev.set(neighbor, cur.id);
        q.push({ id: neighbor, d: nd });
      }
    }
  }

  const path = [];
  let c = endId;
  while (c) { path.unshift(c); c = prev.get(c); }
  if (path[0] !== startId) return { path: [], distance: Infinity, found: false };
  return { path, distance: dist.get(endId), found: true };
}

/* ── helpers ── */
const nodeMap = () => new Map(nodes.map(n => [n.id, n]));

function edgeWeight(a, b) {
  const e = edges.find(([x, y]) => (x === a && y === b) || (y === a && x === b));
  return e ? e[2] : 0;
}

function turnDir(prev, cur, next) {
  const a1 = Math.atan2(cur.y - prev.y, cur.x - prev.x);
  const a2 = Math.atan2(next.y - cur.y, next.x - cur.x);
  let d = (a2 - a1) * 180 / Math.PI;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  if (Math.abs(d) < 30) return 'straight';
  return d > 0 ? 'right' : 'left';
}

/** Get translated node name */
function locName(node, T) {
  if (!T) return node.name;
  const key = `loc_${node.id}`;
  const translated = T(key);
  return translated !== key ? translated : node.name;
}

/* ── instruction generator (skips waypoint nodes in text, keeps for geometry) ── */
export function generateInstructions(path, T = null) {
  if (!path || path.length < 2) return [];
  const nm = nodeMap();
  const ins = [];

  // Filter to only visible (non-waypoint) nodes for instructions
  const visible = path.filter(id => !nm.get(id)?.isWaypoint);
  if (visible.length < 2) return [];

  // Compute cumulative distance between visible nodes
  function distBetween(fromId, toId) {
    const fi = path.indexOf(fromId), ti = path.indexOf(toId);
    let total = 0;
    for (let j = fi; j < ti; j++) total += edgeWeight(path[j], path[j + 1]);
    return total;
  }

  // Start
  const startNode = nm.get(visible[0]);
  ins.push({
    icon: '📍', type: 'start', nodeId: visible[0], distance: 0,
    text: `${T?.('startsFrom') || 'Start from'} ${locName(startNode, T)}`,
  });

  // Middle steps (only visible nodes)
  for (let i = 1; i < visible.length - 1; i++) {
    const pr = nm.get(visible[i - 1]), cu = nm.get(visible[i]), nx = nm.get(visible[i + 1]);
    const d = distBetween(visible[i - 1], visible[i]);
    const dir = turnDir(pr, cu, nx);
    const name = locName(cu, T);

    let icon = '⬆️', text = '';
    if (cu.type === 'staircase') {
      icon = '🪜'; text = `${T?.('staircaseAhead') || 'Staircase ahead'} – ${name}`;
    } else if (cu.type === 'corridor' || cu.type === 'outdoor') {
      icon = '🚶';
      const dirText = dir === 'left' ? (T?.('turnLeft') || 'Turn left')
        : dir === 'right' ? (T?.('turnRight') || 'Turn right')
        : (T?.('goStraight') || 'Go straight');
      text = `${dirText} ${T?.('through') || 'through'} ${name}`;
    } else {
      if (dir === 'left') { icon = '⬅️'; text = `${T?.('turnLeft') || 'Turn left'} ${T?.('at') || 'at'} ${name}`; }
      else if (dir === 'right') { icon = '➡️'; text = `${T?.('turnRight') || 'Turn right'} ${T?.('at') || 'at'} ${name}`; }
      else { text = `${T?.('goStraight') || 'Go straight'} ${T?.('past') || 'past'} ${name}`; }
    }
    ins.push({ icon, type: 'navigate', nodeId: visible[i], distance: d, text });
  }

  // Walk to final
  const lastDist = distBetween(visible[visible.length - 2], visible[visible.length - 1]);
  const endNode = nm.get(visible[visible.length - 1]);

  if (lastDist) {
    ins.push({
      icon: '🚶', type: 'navigate', nodeId: visible[visible.length - 1], distance: lastDist,
      text: `${T?.('walkFor') || 'Walk straight for'} ${lastDist}${T?.('meters') || 'm'}`,
    });
  }

  // Arrival
  ins.push({
    icon: '🏁', type: 'destination', nodeId: visible[visible.length - 1], distance: 0,
    text: `${T?.('arriveAt') || 'Arrive at'} ${locName(endNode, T)} – ${T?.('destReached') || 'Destination reached'}!`,
  });

  return ins;
}

export const walkTime = (d) => Math.ceil(d / 1.2);
export const fmtTime = (s, T) => {
  const sec = T?.('seconds') || 'sec';
  const min = T?.('minutes') || 'min';
  return s < 60 ? `${s} ${sec}` : `${Math.floor(s / 60)} ${min} ${s % 60 ? s % 60 + ' ' + sec : ''}`;
};
export const getNode = (id) => nodes.find(n => n.id === id);

/** Search only returns visible (non-waypoint) nodes */
export function searchNodes(q) {
  const visible = nodes.filter(n => !n.isWaypoint);
  if (!q?.trim()) return visible;
  const lc = q.toLowerCase().trim();
  return visible.filter(n =>
    n.name.toLowerCase().includes(lc) ||
    n.description.toLowerCase().includes(lc) ||
    n.searchTags.some(t => t.includes(lc))
  );
}
