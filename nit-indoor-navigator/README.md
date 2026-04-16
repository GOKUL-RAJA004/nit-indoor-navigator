# 🏫 NIT Indoor Navigator — QuickPath

**Smart campus wayfinding system for Nehru Institute of Technology (Autonomous), Coimbatore**

A multi-floor indoor navigation web app with voice-guided, step-by-step directions in 6 languages. Built for students, faculty, staff, and visitors to navigate the campus effortlessly.

![React](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646cff?style=flat&logo=vite)
![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat&logo=leaflet)
![Languages](https://img.shields.io/badge/Languages-6-f59e0b?style=flat)

---

## ✨ Features

- **🗺️ Multi-Floor Navigation** — 5 floors (Ground through 4th) with individual floor plan maps
- **🧭 Dijkstra Routing** — Shortest path algorithm across a graph of 85+ connected nodes
- **🪜 Staircase Transitions** — Seamless inter-floor routing with visual transition cards
- **🗣️ Voice Guidance** — Text-to-Speech reads directions aloud in your selected language
- **🎤 Voice Search** — Say a destination and get instant navigation (Speech Recognition)
- **🌐 6 Languages** — Tamil, English, Hindi, Malayalam, Telugu, Kannada
- **⭐ Favorites & Recent** — Save frequent destinations, quick-access shortcuts
- **📱 Responsive Design** — Works on desktop, tablet, and mobile devices
- **🎨 Clean UI** — Professional blue & white academic theme with smooth animations

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **Maps** | Leaflet + react-leaflet |
| **Routing Algorithm** | Dijkstra's Shortest Path |
| **Voice** | Web Speech API (TTS + STT) |
| **Styling** | Vanilla CSS with design tokens |
| **Fonts** | Google Fonts (Inter, Outfit, Noto Sans family) |
| **Deployment** | Netlify / Firebase / GitHub Pages |

## 📁 Project Structure

```
src/
├── App.jsx                    # Root component — global state & context
├── main.jsx                   # React DOM entry
├── index.css                  # Full design system (514 lines)
│
├── components/
│   ├── Header.jsx             # Top bar: branding, language, voice, settings
│   ├── LeftPanel.jsx          # Side panel: routes, directions, favorites, admin
│   ├── MapArea.jsx            # Leaflet map: floor plans, route lines, markers
│   ├── LocationModal.jsx      # Search & select location dialog
│   ├── SettingsPanel.jsx      # Settings drawer
│   ├── VoiceOverlay.jsx       # Voice search modal
│   ├── SplashScreen.jsx       # Loading splash screen
│   └── Toast.jsx              # Notification toasts
│
├── data/
│   ├── buildingData.js        # Nodes, edges, floors, categories, popular routes
│   └── i18n.js                # 6-language translations (~600 lines)
│
├── utils/
│   ├── navigation.js          # Dijkstra, instruction generation, search
│   └── voice.js               # TTS, STT, voice command parsing
│
└── pages/
    └── FavoritesPage.jsx      # Placeholder (favorites built into LeftPanel)
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/GOKUL-RAJA004/nit-indoor-navigator.git

# Navigate to the project
cd nit-indoor-navigator

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173/nit-indoor-navigator/`

### Build for Production

```bash
npm run build
```

Output is in the `dist/` folder, ready for deployment.

## 🗺️ Navigation System

### Graph Structure

The campus is modeled as a weighted graph:

- **Destination Nodes** (42) — Rooms, labs, halls, offices visible to users
- **Waypoint Nodes** (43) — Hidden corridor junction points for accurate routing
- **Edges** (85+) — Weighted connections representing walking distance in meters

### How Routing Works

1. User selects **Start** and **Destination** points
2. **Dijkstra's algorithm** finds the shortest path through the graph
3. **Instruction generator** produces turn-by-turn directions with:
   - Distance in meters between checkpoints
   - Turn directions (left/right/straight) using angle calculations
   - Landmark references for orientation
   - Floor transition cards for staircase crossings
4. **Voice engine** reads instructions aloud (if enabled)

### Floors

| Floor | Map File | Key Locations |
|-------|----------|---------------|
| Ground | `ground_floor.png` | Main Gate, Innovation Hub, Visveswara Hall, Principal Room, Canteen |
| 1st | `1st_floor.png` | Library, Cybersecurity Lab, Dept. of AIML |
| 2nd | `2nd_floor.png` | Seminar Hall, HOD Office, Classroom 1 |
| 3rd | `3rd_floor.png` | Conference Room, EEE Dept, Placement Cell, Research Lab |
| 4th | `4th_floor.jpeg` | Dept. of S&H, 1-Year Staff Room |

## 🌐 Supported Languages

| Language | Code | Voice |
|----------|------|-------|
| Tamil (தமிழ்) | `ta` | `ta-IN` |
| English | `en` | `en-US` |
| Hindi (हिन्दी) | `hi` | `hi-IN` |
| Malayalam (മലയാളം) | `ml` | `ml-IN` |
| Telugu (తెలుగు) | `te` | `te-IN` |
| Kannada (ಕನ್ನಡ) | `kn` | `kn-IN` |

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🔮 Future Roadmap

- 📱 QR-based location detection
- 📡 BLE beacon / Wi-Fi indoor positioning
- 🚨 Emergency exit navigation
- ♿ Accessibility-friendly routes
- 🏗️ Multi-building support

## 👤 Author

**Gokul Raja** — Nehru Institute of Technology

---

> *Never get lost on campus again.* 🧭
