/**
 * Building Data — QuickPath
 * Multi-floor navigation: Ground, 1st, 2nd, 3rd, 4th
 *
 * GRAPH STRUCTURE:
 *  - BLUE DOTS  → Destination nodes (user-visible locations)
 *  - YELLOW DOTS → Junction/waypoint nodes (corridor routing)
 *  - EDGES      → Walkable paths (weight = Euclidean distance)
 *
 * Edge weights auto-calculated:
 *   weight = sqrt((x2-x1)² + (y2-y1)²) / SCALE_FACTOR
 *
 * Map image dimensions (verified from actual files):
 *   Ground Floor: 1024×766  (ground_floor.png)
 *   1st Floor:    1080×1080 (1st_floor.png)
 *   2nd Floor:    1192×892  (2nd_floor.png)
 *   3rd Floor:    1192×892  (3rd_floor.png)
 *   4th Floor:    1192×892  (4th_floor.jpeg)
 */

const SCALE_FACTOR = 10; // pixels → approximate meters

// ─── DESTINATION NODES (Blue) ────────────────────────────────────────────────

const destinationNodes = [
  // ── GROUND FLOOR (floor 0) ──
  { id: 'parking', name: 'Parking', type: 'outdoor', x: 20.54, y: 28.42, floor: '0', description: 'Campus parking area', icon: '🅿️', searchTags: ['parking', 'car'] },
  { id: 'iqac', name: 'IQAC', type: 'office', x: 361.30, y: 128.58, floor: '0', description: 'Internal Quality Assurance Cell', icon: '📊', searchTags: ['iqac', 'quality'] },
  { id: 'innovation_hub', name: 'Innovation Hub', type: 'lab', x: 144.24, y: 196.24, floor: '0', description: 'Technology innovation & startup center', icon: '💡', searchTags: ['innovation', 'hub', 'startup'] },
  { id: 'visveswara_hall', name: 'Visveswara Hall', type: 'hall', x: 527.78, y: 196.31, floor: '0', description: 'Main seminar and event hall', icon: '🏛️', searchTags: ['visveswara', 'hall', 'seminar'] },
  { id: 'lab_6', name: 'Lab 6', type: 'lab', x: 361.26, y: 246.54, floor: '0', description: 'Computer Laboratory 6', icon: '🖥️', searchTags: ['lab', 'computer', 'lab6'] },
  { id: 'lift', name: 'Lift', type: 'staircase', x: 613.78, y: 251.47, floor: '0', description: 'Elevator for upper floors', icon: '🛗', searchTags: ['lift', 'elevator'] },
  { id: 'stationary', name: 'Stationary', type: 'outdoor', x: 983.88, y: 316.24, floor: '0', description: 'Stationary and book shop', icon: '📚', searchTags: ['stationary', 'book'] },
  { id: 'girls_toilet', name: 'Girls Toilet', type: 'toilet', x: 666.45, y: 328.91, floor: '0', description: "Women's restroom facility", icon: '🚺', searchTags: ['girls', 'toilet', 'restroom'] },
  { id: 'atrium_lobby', name: 'Atrium Lobby', type: 'corridor', x: 513.50, y: 338.36, floor: '0', description: 'Central lobby and corridor junction', icon: '🏢', searchTags: ['atrium', 'lobby'] },
  { id: 'food_court', name: 'Food Court', type: 'outdoor', x: 936.54, y: 396.77, floor: '0', description: 'Food court with multiple outlets', icon: '🍔', searchTags: ['food', 'court'] },
  { id: 'admin_office', name: 'Administrative Office', type: 'office', x: 649.43, y: 451.67, floor: '0', description: 'College administrative office', icon: '🏢', searchTags: ['admin', 'office'] },
  { id: 'way_for_mba', name: 'Way for MBA', type: 'corridor', x: 736.78, y: 451.80, floor: '0', description: 'Corridor leading to MBA department', icon: '➡️', searchTags: ['mba', 'way'] },
  { id: 'main_gate', name: 'Main Gate', type: 'outdoor', x: 20.06, y: 452.78, floor: '0', description: 'Main entrance gate of NIT campus', icon: '🚪', searchTags: ['main', 'gate', 'entrance'] },
  { id: 'principal_room', name: 'Principal Room', type: 'office', x: 738.63, y: 569.92, floor: '0', description: "Principal's office and meeting room", icon: '👔', searchTags: ['principal', 'room'] },
  { id: 'pk_das_hall', name: 'PK DAS Hall', type: 'hall', x: 697.80, y: 651.07, floor: '0', description: 'PK DAS memorial hall', icon: '🎭', searchTags: ['pk das', 'hall'] },
  { id: 'canteen', name: 'Canteen', type: 'outdoor', x: 678.05, y: 741.56, floor: '0', description: 'Campus canteen and dining area', icon: '🍽️', searchTags: ['canteen', 'food'] },
  { id: 'boys_toilet', name: 'Boys Toilet', type: 'toilet', x: 438, y: 108, floor: '0', description: "Men's restroom facility", icon: '🚹', searchTags: ['boys', 'toilet', 'restroom'] },
  { id: 'staircase_left', name: 'Staircase (Left)', type: 'staircase', x: 408, y: 68, floor: '0', description: 'Left wing staircase to upper floors', icon: '🪜', searchTags: ['stairs', 'staircase', 'left'] },
  { id: 'staircase_right', name: 'Staircase (Right)', type: 'staircase', x: 790, y: 378, floor: '0', description: 'Right wing staircase to upper floors', icon: '🪜', searchTags: ['stairs', 'staircase', 'right'] },
  { id: 'circa', name: 'CIRCA', type: 'office', x: 508, y: 448, floor: '0', description: 'Centre for Innovation, Research & Consultancy', icon: '🔬', searchTags: ['circa', 'research'] },

  // ── 1ST FLOOR (floor 1) ──
  { id: 'B1', name: 'Staircase Left (1F)', type: 'staircase', x: 411.35, y: 248.71, floor: '1', description: 'Left staircase on 1st Floor', icon: '🪜', searchTags: ['stairs', 'staircase', '1st', 'left'] },
  { id: 'B2', name: 'Lab 1', type: 'lab', x: 155.58, y: 294.74, floor: '1', description: 'Laboratory 1 — CSE Department (Left Wing)', icon: '🖥️', searchTags: ['lab', 'lab1', 'laboratory', 'cse'] },
  { id: 'B3', name: 'Library', type: 'hall', x: 584.06, y: 294.86, floor: '1', description: 'Central Library', icon: '📚', searchTags: ['library', 'books'] },
  { id: 'B4', name: 'Staircase Right (1F)', type: 'staircase', x: 690.38, y: 335.21, floor: '1', description: 'Right staircase on 1st Floor', icon: '🪜', searchTags: ['stairs', 'staircase', '1st', 'right'] },
  { id: 'B5', name: 'Lab 2', type: 'lab', x: 759.77, y: 484.66, floor: '1', description: 'Laboratory 2 — AIML Department (Right Wing)', icon: '🖥️', searchTags: ['lab', 'lab2', 'laboratory', 'aiml'] },
  { id: 'B6', name: 'Cybersecurity Lab', type: 'lab', x: 838.45, y: 657.46, floor: '1', description: 'Cybersecurity Laboratory — AIML Department (Right Wing)', icon: '🛡️', searchTags: ['cybersecurity', 'lab', 'aiml'] },
  { id: 'B7', name: 'Department of AIML', type: 'office', x: 798.71, y: 873.62, floor: '1', description: 'AIML Department (Right Wing)', icon: '🤖', searchTags: ['aiml', 'department', 'ai'] },

  // ── 2ND FLOOR (floor 2) — coordinates corrected from uploaded map (1192×892) ──
  { id: 'f2_B1', name: 'Lab 3', type: 'lab', x: 240.50, y: 320.20, floor: '2', description: 'Laboratory 3 — Aeronautical Department (Left Wing)', icon: '🖥️', searchTags: ['lab', 'lab3', '2nd', 'aero', 'aeronautical'] },
  { id: 'f2_B2', name: 'Boys Toilet (2F)', type: 'toilet', x: 650.30, y: 315.80, floor: '2', description: "Men's restroom on 2nd Floor", icon: '🚹', searchTags: ['boys', 'toilet', '2nd'] },
  { id: 'f2_B3', name: 'Girls Toilet (2F)', type: 'toilet', x: 785.10, y: 455.60, floor: '2', description: "Women's restroom on 2nd Floor", icon: '🚺', searchTags: ['girls', 'toilet', '2nd'] },
  { id: 'f2_B4', name: 'Lab 4', type: 'lab', x: 805.40, y: 770.20, floor: '2', description: 'Laboratory 4 — IT Department (Right Wing)', icon: '🖥️', searchTags: ['lab', 'lab4', '2nd', 'it', 'information technology'] },
  { id: 'f2_B5', name: 'Dept. of IT', type: 'office', x: 840.20, y: 540.30, floor: '2', description: 'Department of Information Technology (Right Wing)', icon: '🏢', searchTags: ['it', 'information technology', 'department', '2nd'] },

  // ── 3RD FLOOR (floor 3) — coordinates corrected from uploaded map (1192×892) ──
  { id: 'f3_B1', name: 'Dept. of Food Technology', type: 'office', x: 515.40, y: 260.30, floor: '3', description: 'Department of Food Technology (Left Wing)', icon: '🏢', searchTags: ['food', 'technology', 'department', '3rd'] },
  { id: 'f3_B2', name: 'Boys Toilet (3F)', type: 'toilet', x: 700.60, y: 300.20, floor: '3', description: "Men's restroom on 3rd Floor", icon: '🚹', searchTags: ['boys', 'toilet', '3rd'] },
  { id: 'f3_B3', name: 'Girls Toilet (3F)', type: 'toilet', x: 780.90, y: 360.50, floor: '3', description: "Women's restroom on 3rd Floor", icon: '🚺', searchTags: ['girls', 'toilet', '3rd'] },
  { id: 'f3_B4', name: 'Dept. of Agriculture (3F)', type: 'office', x: 820.10, y: 470.80, floor: '3', description: 'Department of Agriculture (Right Wing)', icon: '🌾', searchTags: ['agriculture', 'department', '3rd'] },
  { id: 'f3_B5', name: 'Dept. of Civil Engineering', type: 'office', x: 880.50, y: 600.40, floor: '3', description: 'Department of Civil Engineering (Right Wing)', icon: '🏗️', searchTags: ['civil', 'engineering', 'department', '3rd'] },
  { id: 'f3_B6', name: 'Exam Cell (3F)', type: 'office', x: 835.30, y: 520.20, floor: '3', description: 'Examination Cell on 3rd Floor', icon: '📝', searchTags: ['exam', 'cell', 'examination', '3rd'] },

  // ── 4TH FLOOR (floor 4) — coordinates corrected from uploaded map (1192×892) ──
  { id: 'f4_B1', name: 'Boys Toilet (4F)', type: 'toilet', x: 690.40, y: 310.20, floor: '4', description: "Men's restroom on 4th Floor", icon: '🚹', searchTags: ['boys', 'toilet', '4th'] },
  { id: 'f4_B2', name: 'Dept. of S&H', type: 'office', x: 790.60, y: 410.80, floor: '4', description: 'Department of Science & Humanities (Entire Floor)', icon: '📖', searchTags: ['department', 'science', 'humanities', 'sh', '4th'] },
  { id: 'f4_B3', name: 'Girls Toilet (4F)', type: 'toilet', x: 820.30, y: 470.50, floor: '4', description: "Women's toilet on 4th Floor", icon: '🚺', searchTags: ['girls', 'toilet', '4th'] },
  { id: 'f4_B4', name: 'Staff Room (4F)', type: 'office', x: 860.10, y: 600.70, floor: '4', description: '1st Year Staff Room on 4th Floor', icon: '👨‍🏫', searchTags: ['staff', 'room', '4th', 'teacher'] },
];

// ─── WAYPOINT / JUNCTION NODES (Yellow dots) ─────────────────────────────────

const waypointNodes = [
  // Ground Floor (unchanged)
  { id: 'w_1', x: 842.67, y: 30.81, floor: '0' },
  { id: 'w_2', x: 597.44, y: 30.98, floor: '0' },
  { id: 'w_3', x: 466.07, y: 195.44, floor: '0' },
  { id: 'w_4', x: 361.11, y: 196.23, floor: '0' },
  { id: 'w_5', x: 565.24, y: 217.35, floor: '0' },
  { id: 'w_6', x: 699.97, y: 272.08, floor: '0' },
  { id: 'w_7', x: 483.44, y: 273.00, floor: '0' },
  { id: 'w_8', x: 849.17, y: 273.18, floor: '0' },
  { id: 'w_9', x: 932.26, y: 275.11, floor: '0' },
  { id: 'w_10', x: 934.13, y: 316.30, floor: '0' },
  { id: 'w_11', x: 511.45, y: 396.34, floor: '0' },
  { id: 'w_12', x: 696.01, y: 396.70, floor: '0' },
  { id: 'w_13', x: 695.97, y: 449.53, floor: '0' },
  { id: 'w_14', x: 38.54, y: 450.65, floor: '0' },
  { id: 'w_15', x: 698.03, y: 569.62, floor: '0' },
  { id: 'w_16', x: 857.62, y: 720.19, floor: '0' },
  { id: 'w_17', x: 511.15, y: 721.06, floor: '0' },
  { id: 'w_18', x: 679.46, y: 721.48, floor: '0' },

  // 1st Floor (unchanged)
  { id: 'Y1', x: 409.93, y: 292.85, floor: '1' },
  { id: 'Y2', x: 658.48, y: 309.51, floor: '1' },
  { id: 'Y3', x: 533.30, y: 390.92, floor: '1' },
  { id: 'Y4', x: 752.22, y: 561.05, floor: '1' },
  { id: 'Y5', x: 798.70, y: 657.44, floor: '1' },

  // 2nd Floor — CORRECTED coordinates from uploaded map
  { id: 'f2_Y1', x: 480.60, y: 270.40, floor: '2' },
  { id: 'f2_Y2', x: 620.30, y: 320.50, floor: '2' },
  { id: 'f2_Y3', x: 660.80, y: 480.90, floor: '2' },
  { id: 'f2_Y4', x: 740.50, y: 550.60, floor: '2' },
  { id: 'f2_Y5', x: 800.10, y: 560.30, floor: '2' },
  { id: 'f2_Y6', x: 830.70, y: 630.20, floor: '2' },

  // 2nd Floor — Staircase access waypoints (no blue dots at staircases on 2F+)
  { id: 'f2_stair_left', x: 590, y: 160, floor: '2' },
  { id: 'f2_stair_right', x: 860, y: 500, floor: '2' },

  // 3rd Floor — CORRECTED coordinates from uploaded map
  { id: 'f3_Y1', x: 540.20, y: 300.10, floor: '3' },
  { id: 'f3_Y2', x: 650.80, y: 310.40, floor: '3' },
  { id: 'f3_Y3', x: 720.60, y: 380.20, floor: '3' },
  { id: 'f3_Y4', x: 690.50, y: 450.30, floor: '3' },
  { id: 'f3_Y5', x: 780.20, y: 500.10, floor: '3' },
  { id: 'f3_Y6', x: 820.60, y: 520.40, floor: '3' },
  { id: 'f3_Y7', x: 860.30, y: 580.20, floor: '3' },

  // 3rd Floor — Staircase access waypoints
  { id: 'f3_stair_left', x: 555, y: 175, floor: '3' },
  { id: 'f3_stair_right', x: 860, y: 485, floor: '3' },

  // 4th Floor — CORRECTED coordinates from uploaded map
  { id: 'f4_Y1', x: 600.20, y: 300.10, floor: '4' },
  { id: 'f4_Y2', x: 680.40, y: 310.30, floor: '4' },
  { id: 'f4_Y3', x: 720.60, y: 360.50, floor: '4' },
  { id: 'f4_Y4', x: 690.50, y: 430.40, floor: '4' },
  { id: 'f4_Y5', x: 750.30, y: 480.60, floor: '4' },
  { id: 'f4_Y6', x: 800.10, y: 500.20, floor: '4' },
  { id: 'f4_Y7', x: 840.70, y: 560.30, floor: '4' },

  // 4th Floor — Staircase access waypoints
  { id: 'f4_stair_left', x: 555, y: 180, floor: '4' },
  { id: 'f4_stair_right', x: 845, y: 480, floor: '4' },
];

// ─── MERGED NODES EXPORT ─────────────────────────────────────────────────────

export const nodes = [
  ...destinationNodes.map(n => ({ ...n, building: 'main', isWaypoint: false })),
  ...waypointNodes.map(w => ({
    ...w,
    name: 'WP ' + w.id,
    type: 'waypoint',
    building: 'main',
    description: '',
    icon: '📌',
    searchTags: [],
    isWaypoint: true,
  })),
];

// ─── EUCLIDEAN DISTANCE CALCULATOR ───────────────────────────────────────────
// distance = sqrt((x2 - x1)² + (y2 - y1)²) / SCALE_FACTOR

const _coords = new Map();
destinationNodes.forEach(n => _coords.set(n.id, n));
waypointNodes.forEach(n => _coords.set(n.id, n));

/**
 * Calculate edge weight using Euclidean distance between two nodes
 * @param {string} id1 - Source node ID
 * @param {string} id2 - Target node ID
 * @returns {number} Distance in approximate meters
 */
export function eucDist(id1, id2) {
  const a = _coords.get(id1), b = _coords.get(id2);
  if (!a || !b) return 1;
  return Math.round(Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2) / SCALE_FACTOR);
}

// ─── EDGE PAIRS — weights auto-calculated via eucDist() ──────────────────────
// Format: [source, target] — bidirectional path edges

// ── Ground Floor (floor 0) — unchanged ──
const gfEdgePairs = [
  ['parking', 'w_1'], ['w_2', 'w_1'], ['w_1', 'w_8'],
  ['w_4', 'w_3'], ['w_5', 'w_2'],
  ['w_7', 'w_6'], ['w_6', 'w_8'], ['w_8', 'w_9'],
  ['w_9', 'w_10'],
  ['w_3', 'w_7'], ['w_7', 'w_11'], ['w_11', 'w_17'],
  ['w_6', 'w_12'], ['w_12', 'w_13'], ['w_13', 'w_15'], ['w_15', 'w_18'],
  ['w_11', 'w_12'],
  ['main_gate', 'w_14'], ['w_14', 'w_11'],
  ['w_17', 'w_18'], ['w_18', 'w_16'], ['w_8', 'w_16'],
  ['visveswara_hall', 'w_5'], ['stationary', 'w_10'], ['girls_toilet', 'w_12'],
  ['atrium_lobby', 'w_11'], ['food_court', 'w_10'], ['admin_office', 'w_13'],
  ['way_for_mba', 'w_13'], ['principal_room', 'w_15'], ['pk_das_hall', 'w_15'],
  ['canteen', 'w_18'], ['iqac', 'w_4'], ['innovation_hub', 'w_4'],
  ['lab_6', 'w_4'], ['lift', 'w_6'],
  ['boys_toilet', 'w_7'], ['staircase_left', 'w_3'], ['staircase_right', 'w_12'], ['circa', 'w_11'],
];

// ── 1st Floor (floor 1) — unchanged ──
const f1EdgePairs = [
  ['B1', 'Y1'],    ['B2', 'Y1'],    ['Y1', 'Y3'],
  ['Y3', 'B3'],    ['B3', 'Y2'],    ['Y2', 'B4'],
  ['B4', 'B5'],    ['B5', 'Y4'],    ['Y4', 'Y5'],
  ['Y5', 'B6'],    ['B6', 'B7'],
];

// ── 2nd Floor (floor 2) — REBUILT to follow uploaded map's dashed path ──
// Critical path: B1 → Y1 → Y2 → Y3 → Y4 → Y5 → Y6 → B4
const f2EdgePairs = [
  // Main corridor path (follows black dashed lines on map)
  ['f2_B1', 'f2_Y1'],            // Lab 3 → Y1
  ['f2_Y1', 'f2_Y2'],            // Y1 → Y2 (corridor junction)
  ['f2_Y2', 'f2_Y3'],            // Y2 → Y3 (corridor curves down)
  ['f2_Y3', 'f2_Y4'],            // Y3 → Y4
  ['f2_Y4', 'f2_Y5'],            // Y4 → Y5
  ['f2_Y5', 'f2_Y6'],            // Y5 → Y6
  ['f2_Y6', 'f2_B4'],            // Y6 → Lab 4 (end of corridor)
  // Branch connections (dashed-path branches to destinations)
  ['f2_B2', 'f2_Y2'],            // Boys Toilet → Y2
  ['f2_B3', 'f2_Y4'],            // Girls Toilet → Y4
  ['f2_B5', 'f2_Y5'],            // Dept. of IT → Y5
  // Staircase access paths
  ['f2_stair_left', 'f2_Y1'],    // Left staircase → Y1 (via dashed path down from staircase)
  ['f2_stair_right', 'f2_Y5'],   // Right staircase → Y5 (near right staircase area)
];

// ── 3rd Floor (floor 3) — REBUILT to follow uploaded map's dashed path ──
// Critical path: B1 → Y1 → Y2 → Y3 → Y4 → Y5 → Y6 → Y7 → B5
const f3EdgePairs = [
  // Main corridor path (follows black dashed lines on map)
  ['f3_B1', 'f3_Y1'],            // Food Technology → Y1
  ['f3_Y1', 'f3_Y2'],            // Y1 → Y2
  ['f3_Y2', 'f3_Y3'],            // Y2 → Y3 (corridor curves down)
  ['f3_Y3', 'f3_Y4'],            // Y3 → Y4
  ['f3_Y4', 'f3_Y5'],            // Y4 → Y5
  ['f3_Y5', 'f3_Y6'],            // Y5 → Y6
  ['f3_Y6', 'f3_Y7'],            // Y6 → Y7
  ['f3_Y7', 'f3_B5'],            // Y7 → Civil Engineering (end of corridor)
  // Branch connections (dashed-path branches to destinations)
  ['f3_B2', 'f3_Y2'],            // Boys Toilet → Y2
  ['f3_B3', 'f3_Y3'],            // Girls Toilet → Y3
  ['f3_B4', 'f3_Y5'],            // Agriculture → Y5
  ['f3_B6', 'f3_Y6'],            // Exam Cell → Y6
  // Staircase access paths
  ['f3_stair_left', 'f3_Y1'],    // Left staircase → Y1
  ['f3_stair_right', 'f3_Y6'],   // Right staircase → Y6
];

// ── 4th Floor (floor 4) — REBUILT to follow uploaded map's dashed path ──
// Critical path: Y1 → Y2 → Y3 → Y4 → Y5 → Y6 → Y7
const f4EdgePairs = [
  // Main corridor path (follows black dashed lines on map)
  ['f4_Y1', 'f4_Y2'],            // Y1 → Y2
  ['f4_Y2', 'f4_Y3'],            // Y2 → Y3
  ['f4_Y3', 'f4_Y4'],            // Y3 → Y4 (corridor turns down)
  ['f4_Y4', 'f4_Y5'],            // Y4 → Y5
  ['f4_Y5', 'f4_Y6'],            // Y5 → Y6
  ['f4_Y6', 'f4_Y7'],            // Y6 → Y7
  // Branch connections (dashed-path branches to destinations)
  ['f4_B1', 'f4_Y2'],            // Boys Toilet → Y2 (adjacent, ~10px apart)
  ['f4_B2', 'f4_Y5'],            // S&H Access → Y5
  ['f4_B3', 'f4_Y6'],            // Girls Toilet → Y6
  ['f4_B4', 'f4_Y7'],            // Staff Room → Y7 (end of corridor)
  // Staircase access paths
  ['f4_stair_left', 'f4_Y1'],    // Left staircase → Y1
  ['f4_stair_right', 'f4_Y6'],   // Right staircase → Y6
];

// ─── STAIRCASE EDGES (inter-floor, fixed weight = 15m per flight) ────────────
// Both left AND right staircase chains, covering all 5 floors

const staircaseEdges = [
  // ── LEFT STAIRCASE CHAIN ──
  // Ground Floor ↔ 1st Floor
  { source: 'staircase_left',  source_floor: '0', target: 'B1',              target_floor: '1', weight: 15, edge_type: 'staircase_up' },
  { source: 'B1',              source_floor: '1', target: 'staircase_left',  target_floor: '0', weight: 15, edge_type: 'staircase_down' },
  // 1st Floor ↔ 2nd Floor
  { source: 'B1',              source_floor: '1', target: 'f2_stair_left',   target_floor: '2', weight: 15, edge_type: 'staircase_up' },
  { source: 'f2_stair_left',   source_floor: '2', target: 'B1',             target_floor: '1', weight: 15, edge_type: 'staircase_down' },
  // 2nd Floor ↔ 3rd Floor
  { source: 'f2_stair_left',   source_floor: '2', target: 'f3_stair_left',  target_floor: '3', weight: 15, edge_type: 'staircase_up' },
  { source: 'f3_stair_left',   source_floor: '3', target: 'f2_stair_left',  target_floor: '2', weight: 15, edge_type: 'staircase_down' },
  // 3rd Floor ↔ 4th Floor
  { source: 'f3_stair_left',   source_floor: '3', target: 'f4_stair_left',  target_floor: '4', weight: 15, edge_type: 'staircase_up' },
  { source: 'f4_stair_left',   source_floor: '4', target: 'f3_stair_left',  target_floor: '3', weight: 15, edge_type: 'staircase_down' },

  // ── RIGHT STAIRCASE CHAIN (was missing in original code!) ──
  // Ground Floor ↔ 1st Floor
  { source: 'staircase_right', source_floor: '0', target: 'B4',              target_floor: '1', weight: 15, edge_type: 'staircase_up' },
  { source: 'B4',              source_floor: '1', target: 'staircase_right', target_floor: '0', weight: 15, edge_type: 'staircase_down' },
  // 1st Floor ↔ 2nd Floor
  { source: 'B4',              source_floor: '1', target: 'f2_stair_right',  target_floor: '2', weight: 15, edge_type: 'staircase_up' },
  { source: 'f2_stair_right',  source_floor: '2', target: 'B4',             target_floor: '1', weight: 15, edge_type: 'staircase_down' },
  // 2nd Floor ↔ 3rd Floor
  { source: 'f2_stair_right',  source_floor: '2', target: 'f3_stair_right', target_floor: '3', weight: 15, edge_type: 'staircase_up' },
  { source: 'f3_stair_right',  source_floor: '3', target: 'f2_stair_right', target_floor: '2', weight: 15, edge_type: 'staircase_down' },
  // 3rd Floor ↔ 4th Floor
  { source: 'f3_stair_right',  source_floor: '3', target: 'f4_stair_right', target_floor: '4', weight: 15, edge_type: 'staircase_up' },
  { source: 'f4_stair_right',  source_floor: '4', target: 'f3_stair_right', target_floor: '3', weight: 15, edge_type: 'staircase_down' },
];

// ─── COMBINED EDGES (auto-calculated Euclidean weights) ──────────────────────

function mkFloorEdges(pairs, floor) {
  return pairs.map(([s, t]) => ({
    source: s, source_floor: floor, target: t, target_floor: floor,
    weight: eucDist(s, t), edge_type: 'path'
  }));
}

export const edges = [
  ...mkFloorEdges(gfEdgePairs, '0'),
  ...mkFloorEdges(f1EdgePairs, '1'),
  ...mkFloorEdges(f2EdgePairs, '2'),
  ...mkFloorEdges(f3EdgePairs, '3'),
  ...mkFloorEdges(f4EdgePairs, '4'),
  ...staircaseEdges,
];

// ─── BUILDINGS & FLOORS ──────────────────────────────────────────────────────
// Image dimensions verified from actual uploaded files

const BASE = import.meta.env.BASE_URL;

export const buildings = [
  {
    id: 'main',
    name: 'Main Academic Block',
    floors: [
      { level: '4', name: '4th Floor', mapImage: `${BASE}4th_floor.jpeg`, mapWidth: 1192, mapHeight: 892 },
      { level: '3', name: '3rd Floor', mapImage: `${BASE}3rd_floor.png`,  mapWidth: 1192, mapHeight: 892 },
      { level: '2', name: '2nd Floor', mapImage: `${BASE}2nd_floor.png`,  mapWidth: 1192, mapHeight: 892 },
      { level: '1', name: '1st Floor', mapImage: `${BASE}1st_floor.png`,  mapWidth: 1080, mapHeight: 1080 },
      { level: '0', name: 'Ground Floor', mapImage: `${BASE}ground_floor.png`, mapWidth: 1024, mapHeight: 766 },
    ],
  },
];

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export const categories = [
  { id: 'all',       name: 'All',        icon: '📍', color: '#4f6bed' },
  { id: 'lab',       name: 'Labs',       icon: '🖥️', color: '#10b981' },
  { id: 'hall',      name: 'Halls',      icon: '🏛️', color: '#f59e0b' },
  { id: 'office',    name: 'Offices',    icon: '🏢', color: '#3b82f6' },
  { id: 'toilet',    name: 'Toilets',    icon: '🚻', color: '#ec4899' },
  { id: 'staircase', name: 'Staircases', icon: '🪜', color: '#8b5cf6' },
  { id: 'corridor',  name: 'Corridors',  icon: '➡️', color: '#64748b' },
  { id: 'outdoor',   name: 'Outdoor',    icon: '🌳', color: '#059669' },
];

// ─── POPULAR ROUTES ──────────────────────────────────────────────────────────

export const popularRoutes = [
  { from: 'main_gate', to: 'principal_room', label: 'Main Gate → Principal Room' },
  { from: 'parking', to: 'innovation_hub', label: 'Parking → Innovation Hub' },
  { from: 'main_gate', to: 'B7', label: 'Main Gate → Dept. of AIML (1F)' },
  { from: 'main_gate', to: 'f2_B4', label: 'Main Gate → Lab 4 (2F)' },
  { from: 'main_gate', to: 'f3_B5', label: 'Main Gate → Dept. of Civil Engineering (3F)' },
  { from: 'main_gate', to: 'f4_B2', label: 'Main Gate → Dept. of S&H (4F)' },
];
