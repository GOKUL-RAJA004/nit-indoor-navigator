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
  edges.forEach(e => {
    g.get(e.source)?.push({ neighbor: e.target, weight: e.weight, type: e.edge_type });
    if (e.edge_type === 'path') {
      g.get(e.target)?.push({ neighbor: e.source, weight: e.weight, type: e.edge_type });
    } else if (e.edge_type === 'staircase_up' || e.edge_type === 'staircase_down') {
      // staircases are already provided as bidirectional pairs in buildingData
    }
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
  const e = edges.find(x => (x.source === a && x.target === b) || (x.target === a && x.source === b));
  return e ? e.weight : 0;
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

export function generateInstructions(path, T = null) {
  if (!path || path.length < 2) return [];
  const nm = nodeMap();
  const ins = [];

  const startNode = nm.get(path[0]);
  ins.push({
    icon: '📍', type: 'start', nodeId: path[0], distance: 0,
    text: `${T?.('startsFrom') || 'Start from'} ${locName(startNode, T)}`,
  });

  // Extract a short junction label from waypoint ID
  const getWaypointLabel = (id) => {
    // f2_Y3 → Y3, f4_Y1 → Y1, Y1 → Y1
    const m = id.match(/(?:f\d+_)?(Y\d+)/);
    return m ? m[1] : id;
  };

  const getLandmark = (node) => {
    if (!node.isWaypoint) return locName(node, T);
    if (node.id.includes('Y')) return getWaypointLabel(node.id);
    let minD = Infinity; let closest = null;
    for (const n of nodes) {
      if (!n.isWaypoint && n.floor === node.floor) {
        const d = Math.hypot(n.x - node.x, n.y - node.y);
        if (d < minD) { minD = d; closest = n; }
      }
    }
    return closest ? `${locName(closest, T)} junction` : 'junction';
  };

  const checkpoints = [];
  for (let i = 1; i < path.length - 1; i++) {
    const pr = nm.get(path[i - 1]), cu = nm.get(path[i]), nx = nm.get(path[i + 1]);
    // Floor change: only trigger on DEPARTURE side (current→next changes floor)
    // Skip ARRIVAL side (prev→current changed floor) to avoid duplicate transition cards
    const isDeparture = cu.floor !== nx.floor;
    const isArrival = pr.floor !== cu.floor;
    if (isDeparture) {
      checkpoints.push({ node: cu, dir: 'floor_change' });
    } else if (!isArrival) {
      // Normal same-floor checkpoint
      const dir = turnDir(pr, cu, nx);
      if (dir !== 'straight' || !cu.isWaypoint) {
        checkpoints.push({ node: cu, dir });
      }
    }
    // If isArrival && !isDeparture: skip — this is the landing node after staircase, handled automatically
  }
  checkpoints.push({ node: nm.get(path[path.length - 1]), dir: 'end' });

  let lastNodeIndex = 0;
  for (let i = 0; i < checkpoints.length; i++) {
    const cp = checkpoints[i];
    const cpIndex = path.indexOf(cp.node.id);
    
    let dist = 0;
    for (let j = lastNodeIndex; j < cpIndex; j++) dist += edgeWeight(path[j], path[j + 1]);
    
    const landmarkName = getLandmark(cp.node);
    
    // Time calculation (1.2m/s)
    const timeSecs = Math.ceil(dist / 1.2);
    const timeText = timeSecs < 60 ? `about ${timeSecs} seconds` : `about ${Math.floor(timeSecs / 60)} minute${Math.floor(timeSecs / 60) !== 1 ? 's' : ''}`;

    let landmarkFormat = landmarkName;
    if (cp.node.id.includes('Y')) landmarkFormat = `${landmarkName} junction`;
    
    if (cp.dir === 'end') {
      if (dist > 0) {
        ins.push({
          icon: '🚶', type: 'navigate', nodeId: cp.node.id, distance: dist, floor: cp.node.floor,
          text: `${T?.('continue') || 'Continue'} ${dist} ${T?.('meters') || 'meters'} ${T?.('toward') || 'toward'} ${locName(cp.node, T)}, ${timeText}`
        });
      }
      ins.push({
        icon: '🏁', type: 'destination', nodeId: cp.node.id, distance: 0, floor: cp.node.floor,
        text: `Reach destination: ${locName(cp.node, T)}`
      });
    } else if (cp.dir === 'floor_change') {
      const floorNames = { '0': 'Ground Floor', '1': '1st Floor', '2': '2nd Floor', '3': '3rd Floor', '4': '4th Floor' };
      const nextNode = nodeMap().get(path[cpIndex + 1]);
      const isUp = parseInt(nextNode?.floor || '0') > parseInt(cp.node.floor);
      const targetStrFloor = nextNode?.floor || '0';
      ins.push({
        icon: '🚶', type: 'navigate', nodeId: cp.node.id, distance: dist, floor: nodeMap().get(path[Math.max(0, cpIndex - 1)])?.floor || cp.node.floor,
        text: `Move to staircase, ${timeText}`
      });
      ins.push({
        icon: '🪜', type: 'staircase', nodeId: cp.node.id, distance: 0, isTransition: true, floor: targetStrFloor,
        text: `Go ${isUp ? 'up' : 'down'} to ${floorNames[targetStrFloor] || targetStrFloor + 'F'}`
      });
    } else {
      const verb = i === 0 ? (T?.('move') || 'Move') : (T?.('continue') || 'Continue');
      ins.push({
        icon: '🚶', type: 'navigate', nodeId: cp.node.id, distance: dist, floor: cp.node.floor,
        text: `${verb} ${dist} ${T?.('meters') || 'meters'} ${T?.('toward') || 'toward'} ${landmarkFormat}, ${timeText}`
      });

      let turnText = '';
      if (cp.dir === 'left') turnText = T?.('turnLeftAt') || 'Turn left at';
      else if (cp.dir === 'right') turnText = T?.('turnRightAt') || 'Turn right at';
      else turnText = T?.('proceedToward') || 'Proceed toward';

      let icon = cp.dir === 'left' ? '⬅️' : cp.dir === 'right' ? '➡️' : '⬆️';
      if (cp.node.type === 'staircase') {
         icon = '🪜';
         turnText = 'Move to staircase';
         landmarkFormat = '';
      }

      ins.push({
        icon, type: 'navigate', nodeId: cp.node.id, distance: 0, floor: cp.node.floor,
        text: `${turnText} ${landmarkFormat}`.trim()
      });
    }
    lastNodeIndex = cpIndex;
  }
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
