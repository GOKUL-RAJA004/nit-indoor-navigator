/**
 * Graph Extraction & Export Utilities — QuickPath
 *
 * Provides functions to:
 * 1. Export graph data in standard JSON format
 * 2. Find nearest junction node to any point
 * 3. Format path results
 * 4. Compute graph statistics
 *
 * Graph Rules:
 *  - BLUE DOTS  → Destination nodes (user-selected START/END)
 *  - YELLOW DOTS → Junction nodes (graph waypoints)
 *  - EDGES      → Valid walkable paths only
 *  - Movement ONLY along edges, always through junction nodes
 *  - Weights = Euclidean distance: sqrt((x2-x1)² + (y2-y1)²) / 10
 */

import { nodes, edges, eucDist } from '../data/buildingData';

// ─── EXPORT GRAPH AS JSON ────────────────────────────────────────────────────

/**
 * Export the full navigation graph in standard JSON format
 * @returns {{ nodes: Array, edges: Array }}
 */
export function exportGraphJSON() {
  const graphNodes = nodes.map(n => ({
    id: n.id,
    x: n.x,
    y: n.y,
    floor: n.floor,
    type: n.isWaypoint ? 'junction' : 'destination',
    name: n.isWaypoint ? `Junction ${n.id}` : n.name,
    icon: n.icon,
  }));

  const graphEdges = edges.map(e => ({
    from: e.source,
    to: e.target,
    weight: e.weight,
    type: e.edge_type,
    sourceFloor: e.source_floor,
    targetFloor: e.target_floor,
  }));

  return { nodes: graphNodes, edges: graphEdges };
}

// ─── FIND NEAREST JUNCTION ──────────────────────────────────────────────────

/**
 * Find the nearest junction (yellow) node to a given point
 * Used for: connecting blue START/END dots to the graph network
 *
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} floor - Floor level ('0'-'4')
 * @returns {{ node: object, distance: number } | null}
 */
export function findNearestJunction(x, y, floor) {
  const junctions = nodes.filter(n => n.isWaypoint && n.floor === floor);
  let nearest = null, minDist = Infinity;

  for (const j of junctions) {
    const d = Math.sqrt((j.x - x) ** 2 + (j.y - y) ** 2);
    if (d < minDist) { minDist = d; nearest = j; }
  }

  return nearest ? { node: nearest, distance: Math.round(minDist / 10) } : null;
}

/**
 * Find the nearest node (any type) to a given point
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {string} floor - Floor level
 * @returns {object | null}
 */
export function findNearestNode(x, y, floor) {
  let nearest = null, minDist = Infinity;

  for (const n of nodes) {
    if (n.floor !== floor) continue;
    const d = Math.sqrt((n.x - x) ** 2 + (n.y - y) ** 2);
    if (d < minDist) { minDist = d; nearest = n; }
  }

  return nearest;
}

// ─── FORMAT PATH RESULT ─────────────────────────────────────────────────────

/**
 * Format Dijkstra result into standard output format
 * @param {string} startId - Start node ID
 * @param {string} endId - End node ID
 * @param {{ path: string[], distance: number, found: boolean }} result - Dijkstra result
 * @returns {object} Formatted path result
 */
export function formatPathResult(startId, endId, result) {
  if (!result.found) {
    return { start: startId, end: endId, path: [], distance: Infinity, found: false };
  }

  const nm = new Map(nodes.map(n => [n.id, n]));
  const pathDetails = result.path.map(id => {
    const n = nm.get(id);
    return {
      id: n.id,
      name: n.isWaypoint ? `Junction ${n.id}` : n.name,
      type: n.isWaypoint ? 'junction' : 'destination',
      x: n.x, y: n.y,
      floor: n.floor,
    };
  });

  // Calculate segment distances
  const segments = [];
  for (let i = 0; i < result.path.length - 1; i++) {
    segments.push({
      from: result.path[i],
      to: result.path[i + 1],
      distance: eucDist(result.path[i], result.path[i + 1]),
    });
  }

  return {
    start: startId,
    end: endId,
    path: result.path,
    pathDetails,
    segments,
    distance: result.distance,
    walkTimeSeconds: Math.ceil(result.distance / 1.2),
    found: true,
  };
}

// ─── GRAPH STATISTICS ───────────────────────────────────────────────────────

/**
 * Get graph statistics per floor and total
 * @returns {object} Statistics
 */
export function getGraphStats() {
  const floors = ['0', '1', '2', '3', '4'];
  const floorStats = {};

  for (const f of floors) {
    const floorNodes = nodes.filter(n => n.floor === f);
    const floorEdges = edges.filter(e => e.source_floor === f && e.target_floor === f);
    floorStats[f] = {
      destinations: floorNodes.filter(n => !n.isWaypoint).length,
      junctions: floorNodes.filter(n => n.isWaypoint).length,
      edges: floorEdges.length,
    };
  }

  const interFloorEdges = edges.filter(e => e.source_floor !== e.target_floor);

  return {
    totalNodes: nodes.length,
    totalDestinations: nodes.filter(n => !n.isWaypoint).length,
    totalJunctions: nodes.filter(n => n.isWaypoint).length,
    totalEdges: edges.length,
    interFloorEdges: interFloorEdges.length,
    floors: floorStats,
  };
}

// ─── GET EDGES FOR A FLOOR (for visualization) ──────────────────────────────

/**
 * Get all edge line segments for a specific floor
 * @param {string} floor - Floor level
 * @returns {Array<{ from: object, to: object, weight: number }>}
 */
export function getFloorEdges(floor) {
  const nm = new Map(nodes.map(n => [n.id, n]));

  return edges
    .filter(e => e.source_floor === floor && e.target_floor === floor)
    .map(e => {
      const from = nm.get(e.source);
      const to = nm.get(e.target);
      if (!from || !to) return null;
      return { from, to, weight: e.weight, type: e.edge_type };
    })
    .filter(Boolean);
}
