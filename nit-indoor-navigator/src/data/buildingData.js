/**
 * Building Data — QuickPath
 * Multi-floor navigation: Ground, 1st, 2nd, 3rd, 4th
 */

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
  { id: 'B2', name: 'Lab 1', type: 'lab', x: 155.58, y: 294.74, floor: '1', description: 'Laboratory 1', icon: '🖥️', searchTags: ['lab', 'lab1', 'laboratory'] },
  { id: 'B3', name: 'Library', type: 'hall', x: 584.06, y: 294.86, floor: '1', description: 'Central Library', icon: '📚', searchTags: ['library', 'books'] },
  { id: 'B4', name: 'Staircase Right (1F)', type: 'staircase', x: 690.38, y: 335.21, floor: '1', description: 'Right staircase on 1st Floor', icon: '🪜', searchTags: ['stairs', 'staircase', '1st', 'right'] },
  { id: 'B5', name: 'Lab 2', type: 'lab', x: 759.77, y: 484.66, floor: '1', description: 'Laboratory 2', icon: '🖥️', searchTags: ['lab', 'lab2', 'laboratory'] },
  { id: 'B6', name: 'Cybersecurity Lab', type: 'lab', x: 838.45, y: 657.46, floor: '1', description: 'Cybersecurity Laboratory', icon: '🛡️', searchTags: ['cybersecurity', 'lab'] },
  { id: 'B7', name: 'Department of AIML', type: 'office', x: 798.71, y: 873.62, floor: '1', description: 'AIML Department', icon: '🤖', searchTags: ['aiml', 'department', 'ai'] },

  // ── 2ND FLOOR (floor 2) ──
  { id: 'f2_B1', name: 'Staircase (2F)', type: 'staircase', x: 240.50, y: 320.20, floor: '2', description: 'Staircase on 2nd Floor', icon: '🪜', searchTags: ['stairs', 'staircase', '2nd'] },
  { id: 'f2_B2', name: 'Seminar Hall', type: 'hall', x: 650.30, y: 315.80, floor: '2', description: 'Seminar Hall on 2nd Floor', icon: '🏛️', searchTags: ['seminar', 'hall', '2nd'] },
  { id: 'f2_B3', name: 'HOD Office', type: 'office', x: 785.10, y: 455.60, floor: '2', description: 'Head of Department Office', icon: '👔', searchTags: ['hod', 'office', '2nd'] },
  { id: 'f2_B4', name: 'Staff Room', type: 'office', x: 805.40, y: 770.20, floor: '2', description: 'Staff Room on 2nd Floor', icon: '🏢', searchTags: ['staff', 'room', '2nd'] },
  { id: 'f2_B5', name: 'Classroom 1', type: 'lab', x: 840.20, y: 540.30, floor: '2', description: 'Classroom 1 on 2nd Floor', icon: '📝', searchTags: ['classroom', '2nd'] },

  // ── 3RD FLOOR (floor 3) ──
  { id: 'f3_B1', name: 'Staircase (3F)', type: 'staircase', x: 515.40, y: 260.30, floor: '3', description: 'Staircase on 3rd Floor', icon: '🪜', searchTags: ['stairs', 'staircase', '3rd'] },
  { id: 'f3_B2', name: 'Conference Room', type: 'hall', x: 700.60, y: 300.20, floor: '3', description: 'Conference Room on 3rd Floor', icon: '🏛️', searchTags: ['conference', 'room', '3rd'] },
  { id: 'f3_B3', name: 'EEE Department', type: 'office', x: 780.90, y: 360.50, floor: '3', description: 'EEE Department', icon: '⚡', searchTags: ['eee', 'department', '3rd'] },
  { id: 'f3_B4', name: 'Placement Cell', type: 'office', x: 820.10, y: 470.80, floor: '3', description: 'Placement Cell', icon: '💼', searchTags: ['placement', 'cell', '3rd'] },
  { id: 'f3_B5', name: 'Research Lab', type: 'lab', x: 880.50, y: 600.40, floor: '3', description: 'Research Laboratory', icon: '🔬', searchTags: ['research', 'lab', '3rd'] },
  { id: 'f3_B6', name: 'Server Room', type: 'lab', x: 835.30, y: 520.20, floor: '3', description: 'Server Room', icon: '🖧', searchTags: ['server', 'room', '3rd'] },

  // ── 4TH FLOOR (floor 4) ──
  { id: 'f4_B1', name: 'Department of S&H', type: 'office', x: 690.40, y: 310.20, floor: '4', description: 'Department of Science & Humanities', icon: '📖', searchTags: ['department', 'science', 'humanities', 'sh', '4th'] },
  { id: 'f4_B2', name: 'Girls Toilet (4F)', type: 'toilet', x: 790.60, y: 410.80, floor: '4', description: 'Girls Toilet on 4th Floor', icon: '🚺', searchTags: ['girls', 'toilet', '4th'] },
  { id: 'f4_B3', name: '1-Year Staff Room', type: 'office', x: 820.30, y: 470.50, floor: '4', description: 'First Year Staff Room', icon: '👨‍🏫', searchTags: ['staff', 'room', '1st year', '4th'] },
  { id: 'f4_B4', name: 'Staircase Right (4F)', type: 'staircase', x: 860.10, y: 600.70, floor: '4', description: 'Right staircase on 4th Floor', icon: '🪜', searchTags: ['stairs', 'staircase', '4th', 'right'] },
];

// ─── WAYPOINT NODES (Yellow) ─────────────────────────────────────────────────

const waypointNodes = [
  // Ground Floor
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

  // 1st Floor
  { id: 'Y1', x: 409.93, y: 292.85, floor: '1' },
  { id: 'Y2', x: 658.48, y: 309.51, floor: '1' },
  { id: 'Y3', x: 533.30, y: 390.92, floor: '1' },
  { id: 'Y4', x: 752.22, y: 561.05, floor: '1' },
  { id: 'Y5', x: 798.70, y: 657.44, floor: '1' },

  // 2nd Floor
  { id: 'f2_Y1', x: 480.60, y: 270.40, floor: '2' },
  { id: 'f2_Y2', x: 620.30, y: 320.50, floor: '2' },
  { id: 'f2_Y3', x: 660.80, y: 480.90, floor: '2' },
  { id: 'f2_Y4', x: 740.50, y: 550.60, floor: '2' },
  { id: 'f2_Y5', x: 800.10, y: 560.30, floor: '2' },
  { id: 'f2_Y6', x: 830.70, y: 630.20, floor: '2' },

  // 3rd Floor
  { id: 'f3_Y1', x: 540.20, y: 300.10, floor: '3' },
  { id: 'f3_Y2', x: 650.80, y: 310.40, floor: '3' },
  { id: 'f3_Y3', x: 720.60, y: 380.20, floor: '3' },
  { id: 'f3_Y4', x: 690.50, y: 450.30, floor: '3' },
  { id: 'f3_Y5', x: 780.20, y: 500.10, floor: '3' },
  { id: 'f3_Y6', x: 820.60, y: 520.40, floor: '3' },
  { id: 'f3_Y7', x: 860.30, y: 580.20, floor: '3' },

  // 4th Floor
  { id: 'f4_Y1', x: 600.20, y: 300.10, floor: '4' },
  { id: 'f4_Y2', x: 680.40, y: 310.30, floor: '4' },
  { id: 'f4_Y3', x: 720.60, y: 360.50, floor: '4' },
  { id: 'f4_Y4', x: 690.50, y: 430.40, floor: '4' },
  { id: 'f4_Y5', x: 750.30, y: 480.60, floor: '4' },
  { id: 'f4_Y6', x: 800.10, y: 500.20, floor: '4' },
  { id: 'f4_Y7', x: 840.70, y: 560.30, floor: '4' },
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

// ─── GROUND FLOOR EDGES ──────────────────────────────────────────────────────

const gfEdges = [
  ['parking', 'w_1', 82], ['w_2', 'w_1', 25], ['w_1', 'w_8', 24],
  ['w_4', 'w_3', 10], ['w_5', 'w_2', 19],
  ['w_7', 'w_6', 22], ['w_6', 'w_8', 15], ['w_8', 'w_9', 8],
  ['w_9', 'w_10', 4],
  ['w_3', 'w_7', 8], ['w_7', 'w_11', 13], ['w_11', 'w_17', 32],
  ['w_6', 'w_12', 12], ['w_12', 'w_13', 5], ['w_13', 'w_15', 12], ['w_15', 'w_18', 15],
  ['w_11', 'w_12', 18],
  ['main_gate', 'w_14', 2], ['w_14', 'w_11', 48],
  ['w_17', 'w_18', 17], ['w_18', 'w_16', 18], ['w_8', 'w_16', 45],
  ['visveswara_hall', 'w_5', 4], ['stationary', 'w_10', 5], ['girls_toilet', 'w_12', 7],
  ['atrium_lobby', 'w_11', 6], ['food_court', 'w_10', 8], ['admin_office', 'w_13', 5],
  ['way_for_mba', 'w_13', 4], ['principal_room', 'w_15', 4], ['pk_das_hall', 'w_15', 8],
  ['canteen', 'w_18', 2], ['iqac', 'w_4', 7], ['innovation_hub', 'w_4', 22],
  ['lab_6', 'w_4', 5], ['lift', 'w_6', 9],
  ['boys_toilet', 'w_7', 17], ['staircase_left', 'w_3', 14], ['staircase_right', 'w_12', 10], ['circa', 'w_11', 5],
];

// ─── 1ST FLOOR EDGES ─────────────────────────────────────────────────────────

const f1Edges = [
  ['B1', 'Y1', 4],    // Staircase Left → Y1 junction
  ['B2', 'Y1', 25],   // Lab 1 → Y1 junction
  ['Y1', 'Y3', 16],   // Y1 → Y3 (Lobby curve)
  ['Y3', 'B3', 11],   // Y3 → Library
  ['B3', 'Y2', 8],    // Library → Y2
  ['Y2', 'B4', 4],    // Y2 → Staircase Right
  ['B4', 'B5', 16],   // Staircase Right → Lab 2
  ['B5', 'Y4', 8],    // Lab 2 → Y4
  ['Y4', 'Y5', 11],   // Y4 → Y5
  ['Y5', 'B6', 4],    // Y5 → Cybersecurity Lab
  ['B6', 'B7', 22],   // Cybersecurity Lab → Dept. of AIML
];

// ─── 2ND FLOOR EDGES ─────────────────────────────────────────────────────────
// Main path: B1 → Y1 → Y2 → Y3 → Y4 → Y5 → Y6 → B4
// Branch: B2↔Y2, B3↔Y3, B5↔Y5

const f2Edges = [
  ['f2_B1', 'f2_Y1', 25],  // Staircase → Y1
  ['f2_Y1', 'f2_Y2', 15],  // Y1 → Y2
  ['f2_Y2', 'f2_B2', 3],   // Y2 → Seminar Hall (branch)
  ['f2_Y2', 'f2_Y3', 17],  // Y2 → Y3
  ['f2_Y3', 'f2_B3', 13],  // Y3 → HOD Office (branch)
  ['f2_Y3', 'f2_Y4', 11],  // Y3 → Y4
  ['f2_Y4', 'f2_Y5', 6],   // Y4 → Y5
  ['f2_Y5', 'f2_B5', 5],   // Y5 → Classroom 1 (branch)
  ['f2_Y5', 'f2_Y6', 8],   // Y5 → Y6
  ['f2_Y6', 'f2_B4', 14],  // Y6 → Staff Room
];

// ─── 3RD FLOOR EDGES ─────────────────────────────────────────────────────────
// Main path: B1 → Y1 → Y2 → Y3 → Y4 → Y5 → Y6 → Y7 → B5
// Branches: B2↔Y2, B3↔Y3, B4↔Y4, B6↔Y6

const f3Edges = [
  ['f3_B1', 'f3_Y1', 5],   // Staircase → Y1
  ['f3_Y1', 'f3_Y2', 11],  // Y1 → Y2
  ['f3_Y2', 'f3_B2', 5],   // Y2 → Conference Room (branch)
  ['f3_Y2', 'f3_Y3', 10],  // Y2 → Y3
  ['f3_Y3', 'f3_B3', 6],   // Y3 → EEE Department (branch)
  ['f3_Y3', 'f3_Y4', 8],   // Y3 → Y4
  ['f3_Y4', 'f3_B4', 13],  // Y4 → Placement Cell (branch)
  ['f3_Y4', 'f3_Y5', 10],  // Y4 → Y5
  ['f3_Y5', 'f3_Y6', 5],   // Y5 → Y6
  ['f3_Y6', 'f3_B6', 2],   // Y6 → Server Room (branch)
  ['f3_Y6', 'f3_Y7', 7],   // Y6 → Y7
  ['f3_Y7', 'f3_B5', 3],   // Y7 → Research Lab
];

// ─── 4TH FLOOR EDGES ─────────────────────────────────────────────────────────
// Main path: Y1 → Y2 → Y3 → Y4 → Y5 → Y6 → Y7
// Branches: B1↔Y2, B2↔Y4, B3↔Y5, B4↔Y7

const f4Edges = [
  ['f4_Y1', 'f4_Y2', 8],   // Y1 → Y2
  ['f4_Y2', 'f4_B1', 1],   // Y2 → Staircase (branch)
  ['f4_Y2', 'f4_Y3', 6],   // Y2 → Y3
  ['f4_Y3', 'f4_Y4', 8],   // Y3 → Y4
  ['f4_Y4', 'f4_B2', 10],  // Y4 → Project Lab (branch)
  ['f4_Y4', 'f4_Y5', 8],   // Y4 → Y5
  ['f4_Y5', 'f4_B3', 7],   // Y5 → Smart Classroom (branch)
  ['f4_Y5', 'f4_Y6', 5],   // Y5 → Y6
  ['f4_Y6', 'f4_Y7', 7],   // Y6 → Y7
  ['f4_Y7', 'f4_B4', 5],   // Y7 → Robotics Lab
];

// ─── STAIRCASE EDGES (inter-floor) ───────────────────────────────────────────
// Chain: GF ↔ 1F ↔ 2F ↔ 3F ↔ 4F

const staircaseEdges = [
  // Ground Floor ↔ 1st Floor
  { source: 'staircase_left',  source_floor: '0', target: 'B1',    target_floor: '1', weight: 15, edge_type: 'staircase_up' },
  { source: 'B1',              source_floor: '1', target: 'staircase_left',  target_floor: '0', weight: 15, edge_type: 'staircase_down' },
  { source: 'staircase_right', source_floor: '0', target: 'B4',    target_floor: '1', weight: 15, edge_type: 'staircase_up' },
  { source: 'B4',              source_floor: '1', target: 'staircase_right', target_floor: '0', weight: 15, edge_type: 'staircase_down' },

  // 1st Floor ↔ 2nd Floor
  { source: 'B1',     source_floor: '1', target: 'f2_B1', target_floor: '2', weight: 15, edge_type: 'staircase_up' },
  { source: 'f2_B1',  source_floor: '2', target: 'B1',    target_floor: '1', weight: 15, edge_type: 'staircase_down' },

  // 2nd Floor ↔ 3rd Floor
  { source: 'f2_B1',  source_floor: '2', target: 'f3_B1', target_floor: '3', weight: 15, edge_type: 'staircase_up' },
  { source: 'f3_B1',  source_floor: '3', target: 'f2_B1', target_floor: '2', weight: 15, edge_type: 'staircase_down' },

  // 3rd Floor ↔ 4th Floor
  { source: 'f3_B1',  source_floor: '3', target: 'f4_B1', target_floor: '4', weight: 15, edge_type: 'staircase_up' },
  { source: 'f4_B1',  source_floor: '4', target: 'f3_B1', target_floor: '3', weight: 15, edge_type: 'staircase_down' },
];

// ─── COMBINED EDGES EXPORT ───────────────────────────────────────────────────

function mkFloorEdges(arr, floor) {
  return arr.map(([s, t, w]) => ({ source: s, source_floor: floor, target: t, target_floor: floor, weight: w, edge_type: 'path' }));
}

export const edges = [
  ...mkFloorEdges(gfEdges, '0'),
  ...mkFloorEdges(f1Edges, '1'),
  ...mkFloorEdges(f2Edges, '2'),
  ...mkFloorEdges(f3Edges, '3'),
  ...mkFloorEdges(f4Edges, '4'),
  ...staircaseEdges,
];

// ─── BUILDINGS & FLOORS ──────────────────────────────────────────────────────

const BASE = import.meta.env.BASE_URL || '/';

export const buildings = [
  {
    id: 'main',
    name: 'Main Academic Block',
    floors: [
      { level: '4', name: '4th Floor', mapImage: `${BASE}4th_floor.jpeg`, mapWidth: 1024, mapHeight: 768 },
      { level: '3', name: '3rd Floor', mapImage: `${BASE}3rd_floor.png`, mapWidth: 1204, mapHeight: 768 },
      { level: '2', name: '2nd Floor', mapImage: `${BASE}2nd_floor.png`, mapWidth: 1069, mapHeight: 856 },
      { level: '1', name: '1st Floor', mapImage: `${BASE}1st_floor.png`, mapWidth: 1080, mapHeight: 1080 },
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
  { from: 'main_gate', to: 'f2_B2', label: 'Main Gate → Seminar Hall (2F)' },
  { from: 'main_gate', to: 'f3_B5', label: 'Main Gate → Research Lab (3F)' },
  { from: 'main_gate', to: 'f4_B3', label: 'Main Gate → 1-Year Staff Room (4F)' },
];
