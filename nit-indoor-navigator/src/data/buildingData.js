/**
 * Building Data — QuickPath
 * Fresh graph from annotated floor plan with yellow waypoint dots + dashed lines
 * Blue dots = destination/location nodes (user-selectable)
 * Yellow dots = corridor waypoint nodes (routing only, hidden from user)
 * Coordinate system: 1024×766 pixel space
 */

// ── DESTINATION NODES (blue dots — visible to users) ──
const destinationNodes = [
  { id: 'parking', name: 'Parking', type: 'outdoor', x: 20.54, y: 28.42, description: 'Campus parking area', icon: '🅿️', searchTags: ['parking', 'car'] },
  { id: 'iqac', name: 'IQAC', type: 'office', x: 361.30, y: 128.58, description: 'Internal Quality Assurance Cell', icon: '📊', searchTags: ['iqac', 'quality'] },
  { id: 'innovation_hub', name: 'Innovation Hub', type: 'lab', x: 144.24, y: 196.24, description: 'Technology innovation & startup center', icon: '💡', searchTags: ['innovation', 'hub', 'startup'] },
  { id: 'visveswara_hall', name: 'Visveswara Hall', type: 'hall', x: 527.78, y: 196.31, description: 'Main seminar and event hall', icon: '🏛️', searchTags: ['visveswara', 'hall', 'seminar'] },
  { id: 'lab_6', name: 'Lab 6', type: 'lab', x: 361.26, y: 246.54, description: 'Computer Laboratory 6', icon: '🖥️', searchTags: ['lab', 'computer', 'lab6'] },
  { id: 'lift', name: 'Lift', type: 'staircase', x: 613.78, y: 251.47, description: 'Elevator for upper floors', icon: '🛗', searchTags: ['lift', 'elevator'] },
  { id: 'stationary', name: 'Stationary', type: 'outdoor', x: 983.88, y: 316.24, description: 'Stationary and book shop', icon: '📚', searchTags: ['stationary', 'book'] },
  { id: 'girls_toilet', name: 'Girls Toilet', type: 'toilet', x: 666.45, y: 328.91, description: "Women's restroom facility", icon: '🚺', searchTags: ['girls', 'toilet', 'restroom'] },
  { id: 'atrium_lobby', name: 'Atrium Lobby', type: 'corridor', x: 513.50, y: 338.36, description: 'Central lobby and corridor junction', icon: '🏢', searchTags: ['atrium', 'lobby'] },
  { id: 'food_court', name: 'Food Court', type: 'outdoor', x: 936.54, y: 396.77, description: 'Food court with multiple outlets', icon: '🍔', searchTags: ['food', 'court'] },
  { id: 'admin_office', name: 'Administrative Office', type: 'office', x: 649.43, y: 451.67, description: 'College administrative office', icon: '🏢', searchTags: ['admin', 'office'] },
  { id: 'way_for_mba', name: 'Way for MBA', type: 'corridor', x: 736.78, y: 451.80, description: 'Corridor leading to MBA department', icon: '➡️', searchTags: ['mba', 'way'] },
  { id: 'main_gate', name: 'Main Gate', type: 'outdoor', x: 20.06, y: 452.78, description: 'Main entrance gate of NIT campus', icon: '🚪', searchTags: ['main', 'gate', 'entrance'] },
  { id: 'principal_room', name: 'Principal Room', type: 'office', x: 738.63, y: 569.92, description: "Principal's office and meeting room", icon: '👔', searchTags: ['principal', 'room'] },
  { id: 'pk_das_hall', name: 'PK DAS Hall', type: 'hall', x: 697.80, y: 651.07, description: 'PK DAS memorial hall', icon: '🎭', searchTags: ['pk das', 'hall'] },
  { id: 'canteen', name: 'Canteen', type: 'outdoor', x: 678.05, y: 741.56, description: 'Campus canteen and dining area', icon: '🍽️', searchTags: ['canteen', 'food'] },
  { id: 'boys_toilet', name: 'Boys Toilet', type: 'toilet', x: 438, y: 108, description: "Men's restroom facility", icon: '🚹', searchTags: ['boys', 'toilet', 'restroom'] },
  { id: 'staircase_left', name: 'Staircase (Left)', type: 'staircase', x: 408, y: 68, description: 'Left wing staircase to upper floors', icon: '🪜', searchTags: ['stairs', 'staircase', 'left'] },
  { id: 'staircase_right', name: 'Staircase (Right)', type: 'staircase', x: 790, y: 378, description: 'Right wing staircase to upper floors', icon: '🪜', searchTags: ['stairs', 'staircase', 'right'] },
  { id: 'circa', name: 'CIRCA', type: 'office', x: 508, y: 448, description: 'Centre for Innovation, Research & Consultancy', icon: '🔬', searchTags: ['circa', 'research'] }
];

// ── WAYPOINT NODES (yellow dots — hidden from users, used for corridor routing) ──
const waypointNodes = [
  { id: 'w_1', x: 842.67, y: 30.81 },
  { id: 'w_2', x: 597.44, y: 30.98 },
  { id: 'w_3', x: 466.07, y: 195.44 },
  { id: 'w_4', x: 361.11, y: 196.23 },
  { id: 'w_5', x: 565.24, y: 217.35 },
  { id: 'w_6', x: 699.97, y: 272.08 },
  { id: 'w_7', x: 483.44, y: 273.00 },
  { id: 'w_8', x: 849.17, y: 273.18 },
  { id: 'w_9', x: 932.26, y: 275.11 },
  { id: 'w_10', x: 934.13, y: 316.30 },
  { id: 'w_11', x: 511.45, y: 396.34 },
  { id: 'w_12', x: 696.01, y: 396.70 },
  { id: 'w_13', x: 695.97, y: 449.53 },
  { id: 'w_14', x: 38.54, y: 450.65 },
  { id: 'w_15', x: 698.03, y: 569.62 },
  { id: 'w_16', x: 857.62, y: 720.19 },
  { id: 'w_17', x: 511.15, y: 721.06 },
  { id: 'w_18', x: 679.46, y: 721.48 }
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

// ── EDGES — follow the dashed lines through yellow waypoints ──
export const edges = [
  // Outer / upper perimeter
  ['parking', 'w_1', 82],
  ['w_2', 'w_1', 25],
  ['w_1', 'w_8', 24],
  
  // Mid horizontal 1
  ['w_4', 'w_3', 10],
  ['w_5', 'w_2', 19],
  
  // Main horizontal corridor
  ['w_7', 'w_6', 22],
  ['w_6', 'w_8', 15],
  ['w_8', 'w_9', 8],
  
  // Right side to food court
  ['w_9', 'w_10', 4],
  
  // Central vertical
  ['w_3', 'w_7', 8],
  ['w_7', 'w_11', 13],
  ['w_11', 'w_17', 32],
  
  // Right vertical
  ['w_6', 'w_12', 12],
  ['w_12', 'w_13', 5],
  ['w_13', 'w_15', 12],
  ['w_15', 'w_18', 15],
  
  // Cross corridor below Visveswara
  ['w_11', 'w_12', 18],
  
  // Main gate diagonal
  ['main_gate', 'w_14', 2],
  ['w_14', 'w_11', 48],
  
  // Bottom horizontal routes
  ['w_17', 'w_18', 17],
  ['w_18', 'w_16', 18],
  ['w_8', 'w_16', 45],
  
  // Connect blue destination nodes to nearest yellow waypoints
  ['visveswara_hall', 'w_5', 4],
  ['stationary', 'w_10', 5],
  ['girls_toilet', 'w_12', 7],
  ['atrium_lobby', 'w_11', 6],
  ['food_court', 'w_10', 8],
  ['admin_office', 'w_13', 5],
  ['way_for_mba', 'w_13', 4],
  ['principal_room', 'w_15', 4],
  ['pk_das_hall', 'w_15', 8],
  ['canteen', 'w_18', 2],
  ['iqac', 'w_4', 7],
  ['innovation_hub', 'w_4', 22],
  ['lab_6', 'w_4', 5],
  ['lift', 'w_6', 9],
  
  // Missing nodes connected to nearest appropriate logic
  ['boys_toilet', 'w_7', 17],
  ['staircase_left', 'w_3', 14],
  ['staircase_right', 'w_12', 10],
  ['circa', 'w_11', 5]
];

export const buildings = [
  {
    id: 'main',
    name: 'Main Academic Block',
    floors: [
      { level: 0, name: 'Ground Floor', mapImage: '/ground_floor.png', mapWidth: 1024, mapHeight: 766 },
    ],
  },
];

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

export const popularRoutes = [
  { from: 'main_gate', to: 'principal_room', label: 'Main Gate → Principal Room' },
  { from: 'parking', to: 'innovation_hub', label: 'Parking → Innovation Hub' },
  { from: 'innovation_hub', to: 'circa', label: 'Innovation Hub → CIRCA' },
  { from: 'lab_6', to: 'pk_das_hall', label: 'Lab 6 → PK DAS Hall' },
  { from: 'main_gate', to: 'canteen', label: 'Main Gate → Canteen' },
  { from: 'food_court', to: 'visveswara_hall', label: 'Food Court → Visveswara Hall' },
];
