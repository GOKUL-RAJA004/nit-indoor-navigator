# QuickPath: Research Paper Diagrams

The following diagrams visually map out the structure and logic of the QuickPath application. You can copy these Mermaid code blocks directly into tools like Notion, GitHub, or Mermaid Live Editor (https://mermaid.live) to automatically render them as high-quality PNGs for your paper.

---

### 1. High-Level Architecture Diagram
This diagram illustrates the structural components of the QuickPath application, representing how the frontend engine operates primarily on the client side without relying on backend servers.

```mermaid
graph TD
    subgraph Client [Client-Side Application Architecture]
        UI[React UI Components]
        Map[Leaflet Mapping Engine]
        Voice[Web Speech API Integration]
        Logic[Dijkstra Navigation Engine]
        Data[(Static Graph Data & i18n Translations)]
    end

    UI -->|Interacts with| Map
    UI -->|Triggers| Voice
    UI -->|Requests Route| Logic
    Logic -->|Fetches Layout| Data
    Voice -->|Extracts Destination| UI
    Map -->|Renders Path Overlay| UI
```

---

### 2. System Data Flow Diagram
This details how data cascades through the system when a user initiates a navigation request—from interaction, through the state management, to the mathematical engine, and finally back to the visual renderer.

```mermaid
graph LR
    User([User]) --> |Input / Voice / Click| UI
    
    subgraph QuickPath System
        UI[Left Panel Interface] --> |Sets Endpoints| State[React Global Context]
        State --> |Invokes| Router[Dijkstra Algorithm Core]
        Router --> |Traverses| Graph[(Hybrid Waypoint Graph)]
        Router --> |Generates| Instr[Instruction Parsing Engine]
        Instr --> |Calculates| Distance[Distance & Time EST]
        Distance --> Output[Final Route Object]
    end
    
    Output --> |Draws Polyline| MapView[Map Display Render]
    Output --> |Step-by-Step| TextDisplay[Instruction Text]
    Output --> |TTS Translation| Speaker[Voice Guidance]
    
    MapView --> User
    TextDisplay --> User
    Speaker --> User
```

---

### 3. Execution Flow Diagram (Voice & Routing Logic)
This flowchart explicitly breaks down the step-by-step logical sequence the application takes when a user triggers the hands-free voice navigation feature.

```mermaid
flowchart TD
    Start([User Activates Voice Input]) --> Listen[Microphone captures audio stream]
    Listen --> Transcribe[Transcribes audio into selected language text]
    Transcribe --> Scan[Scans spoken text for internal Node identifiers or Tags]
    
    Scan --> Match{Match Found?}
    Match -- No --> Error[Display Error & Prompt Retry]
    Match -- Yes --> SetDest[Lock in Destination Node ID]
    
    SetDest --> CheckStart{Is Start Point Set?}
    CheckStart -- No --> DefaultStart[Default Start to 'Main Gate']
    CheckStart -- Yes --> RouteTrigger[Trigger Navigation Engine]
    DefaultStart --> RouteTrigger
    
    RouteTrigger --> Dijkstra[Execute Dijkstra Pathfinding Algorithm]
    Dijkstra --> Chunking[Filter and Compress Yellow Waypoints into Checkpoints]
    Chunking --> Identify[Determine Nearest Geometric Landmarks]
    Identify --> Compute[Calculate Distance in Meters & Time in Seconds]
    Compute --> Render[Draw Dynamic Path on Map & Update UI]
    Render --> End([Navigation Successfully Initialized])
```
