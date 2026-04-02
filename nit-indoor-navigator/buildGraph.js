const fs = require('fs');

const B = {
  parking: { id: 'parking', name: 'Parking', type: 'outdoor', icon: '🅿️', x: 20.54, y: 28.42, searchTags: ['parking'] },
  iqac: { id: 'iqac', name: 'IQAC', type: 'office', icon: '📊', x: 361.30, y: 128.58, searchTags: ['iqac'] },
  innovation_hub: { id: 'innovation_hub', name: 'Innovation Hub', type: 'lab', icon: '💡', x: 144.24, y: 196.24, searchTags: ['innovation'] },
  visveswara_hall: { id: 'visveswara_hall', name: 'Visveswara Hall', type: 'hall', icon: '🏛️', x: 527.78, y: 196.31, searchTags: ['visveswara'] },
  lab_6: { id: 'lab_6', name: 'Lab 6', type: 'lab', icon: '🖥️', x: 361.26, y: 246.54, searchTags: ['lab'] },
  lift: { id: 'lift', name: 'Lift', type: 'staircase', icon: '🛗', x: 613.78, y: 251.47, searchTags: ['lift'] },
  stationary: { id: 'stationary', name: 'Stationary', type: 'outdoor', icon: '📚', x: 983.88, y: 316.24, searchTags: ['stationary'] },
  girls_toilet: { id: 'girls_toilet', name: 'Girls Toilet', type: 'toilet', icon: '🚺', x: 666.45, y: 328.91, searchTags: ['girls'] },
  atrium_lobby: { id: 'atrium_lobby', name: 'Atrium Lobby', type: 'corridor', icon: '🏢', x: 513.50, y: 338.36, searchTags: ['atrium'] },
  food_court: { id: 'food_court', name: 'Food Court', type: 'outdoor', icon: '🍔', x: 936.54, y: 396.77, searchTags: ['food'] },
  admin_office: { id: 'admin_office', name: 'Admin Office', type: 'office', icon: '🏢', x: 649.43, y: 451.67, searchTags: ['admin'] },
  way_for_mba: { id: 'way_for_mba', name: 'Way for MBA', type: 'corridor', icon: '➡️', x: 736.78, y: 451.80, searchTags: ['mba'] },
  main_gate: { id: 'main_gate', name: 'Main Gate', type: 'outdoor', icon: '🚪', x: 20.06, y: 452.78, searchTags: ['main'] },
  principal_room: { id: 'principal_room', name: 'Principal Room', type: 'office', icon: '👔', x: 738.63, y: 569.92, searchTags: ['principal'] },
  pk_das_hall: { id: 'pk_das_hall', name: 'PK DAS Hall', type: 'hall', icon: '🎭', x: 697.80, y: 651.07, searchTags: ['pk'] },
  canteen: { id: 'canteen', name: 'Canteen', type: 'outdoor', icon: '🍽️', x: 678.05, y: 741.56, searchTags: ['canteen'] },
  // Missing ones: Keep original approx locs
  boys_toilet: { id: 'boys_toilet', name: 'Boys Toilet', type: 'toilet', icon: '🚹', x: 438, y: 108, searchTags: ['boys'] },
  staircase_left: { id: 'staircase_left', name: 'Staircase (Left)', type: 'staircase', icon: '🪜', x: 408, y: 68, searchTags: ['staircase'] },
  staircase_right: { id: 'staircase_right', name: 'Staircase (Right)', type: 'staircase', icon: '🪜', x: 790, y: 378, searchTags: ['staircase'] },
  circa: { id: 'circa', name: 'CIRCA', type: 'office', icon: '🔬', x: 508, y: 448, searchTags: ['circa'] }
};

const Y = {
  w_1: { id: 'w_1', x: 842.67, y: 30.81 },
  w_2: { id: 'w_2', x: 597.44, y: 30.98 },
  w_3: { id: 'w_3', x: 466.07, y: 195.44 },
  w_4: { id: 'w_4', x: 361.11, y: 196.23 },
  w_5: { id: 'w_5', x: 565.24, y: 217.35 },
  w_6: { id: 'w_6', x: 699.97, y: 272.08 },
  w_7: { id: 'w_7', x: 483.44, y: 273.00 },
  w_8: { id: 'w_8', x: 849.17, y: 273.18 },
  w_9: { id: 'w_9', x: 932.26, y: 275.11 },
  w_10: { id: 'w_10', x: 934.13, y: 316.30 },
  w_11: { id: 'w_11', x: 511.45, y: 396.34 },
  w_12: { id: 'w_12', x: 696.01, y: 396.70 },
  w_13: { id: 'w_13', x: 695.97, y: 449.53 },
  w_14: { id: 'w_14', x: 38.54, y: 450.65 },
  w_15: { id: 'w_15', x: 698.03, y: 569.62 },
  w_16: { id: 'w_16', x: 857.62, y: 720.19 },
  w_17: { id: 'w_17', x: 511.15, y: 721.06 },
  w_18: { id: 'w_18', x: 679.46, y: 721.48 }
};

// Edges - meticulously trace image corridors
const edgesRaw = [
  // Top boundary (Y1 - Y2 has no direct line, it actually connects somehow else)
  // Let's connect based on proximity to form paths:
  ['w_2', 'w_1'],
  ['w_1', 'w_8'],
  ['w_4', 'w_3'],
  ['w_3', 'w_7'],
  ['w_4', 'iqac'], 
  ['w_4', 'innovation_hub'],
  ['w_4', 'lab_6'],
  ['w_7', 'w_6'],
  ['w_6', 'w_8'],
  ['w_8', 'w_9'],
  ['w_9', 'w_10'],
  ['w_6', 'lift'],
  ['w_6', 'w_12'],
  ['w_12', 'w_13'],
  ['w_13', 'w_15'],
  ['w_15', 'w_18'],
  ['w_18', 'w_17'],
  ['w_18', 'w_16'],
  ['w_16', 'w_8'], // Rightmost line
  ['w_7', 'w_11'],
  ['w_11', 'w_17'],
  ['w_11', 'w_12'],
  ['w_14', 'w_11'], // diagonal
  ['main_gate', 'w_14'],
  ['parking', 'w_14'], // or 'parking' to 'w_2'. Let's do parking -> w_14 -> w_11.
  
  // Connect blue nodes to nearest
  ['visveswara_hall', 'w_5'],
  ['w_5', 'w_2'],
  ['stationary', 'w_10'],
  ['girls_toilet', 'w_12'],
  ['atrium_lobby', 'w_11'],
  ['food_court', 'w_10'],
  ['admin_office', 'w_13'],
  ['way_for_mba', 'w_13'],
  ['principal_room', 'w_15'],
  ['pk_das_hall', 'w_15'],
  ['canteen', 'w_18'],

  // Old nodes
  ['boys_toilet', 'w_7'],
  ['staircase_left', 'w_3'],
  ['staircase_right', 'w_12'],
  ['circa', 'w_11']
];

const dist = (p1, p2) => Math.round(Math.sqrt((p2.x-p1.x)**2 + (p2.y-p1.y)**2) / 10);

const finalEdges = edgesRaw.map(e => {
  const p1 = B[e[0]] || Y[e[0]];
  const p2 = B[e[1]] || Y[e[1]];
  if (!p1 || !p2) return null;
  return `  ['${e[0]}', '${e[1]}', ${dist(p1, p2) || 1}],`;
}).filter(Boolean);

let code = `
// ── DESTINATION NODES (blue dots — visible to users) ──
const destinationNodes = [
${Object.values(B).map(n => `  { id: '${n.id}', name: '${n.name}', type: '${n.type}', x: ${n.x}, y: ${n.y}, description: '', icon: '${n.icon}', searchTags: ${JSON.stringify(n.searchTags)} },`).join('\n')}
];

// ── WAYPOINT NODES (yellow dots — hidden from users, used for corridor routing) ──
const waypointNodes = [
${Object.values(Y).map(w => `  { id: '${w.id}', x: ${w.x}, y: ${w.y} },`).join('\n')}
];

export const nodes = [
  ...destinationNodes.map(n => ({ ...n, floor: 0, building: 'main', isWaypoint: false })),
  ...waypointNodes.map(w => ({
    ...w,
    name: 'WP ' + w.id,
    type: 'waypoint',
    floor: 0,
    building: 'main',
    description: '',
    icon: '📌',
    searchTags: [],
    isWaypoint: true,
  })),
];

export const edges = [
${finalEdges.join('\n')}
];
`;

fs.writeFileSync('graphData.js', code);
