# Web-Based Indoor Navigation System Using Graph Theory: A Case Study of "QuickPath"

## Abstract
Indoor navigation presents a unique set of challenges compared to conventional outdoor GPS-based routing, primarily due to the lack of satellite signal penetration and the complex, multi-level nature of building interiors. This paper details the architecture, algorithmic design, and implementation of **QuickPath**, a web-based indoor navigation application built for campus environments. Leveraging modern web technologies such as React and Vite, alongside the Leaflet mapping library, QuickPath implements Dijkstra's shortest path algorithm over a custom hybrid waypoint graph to deliver efficient, turn-by-turn indoor routing.

## 1. Introduction
With the increasing complexity of institutional buildings, efficient indoor wayfinding has become essential for students, staff, and visitors. Traditional static maps often fail to provide contextual, dynamic directions. QuickPath addresses this by offering a lightweight, browser-based solution that requires no app installation. The system models the indoor floor plan as a weighted, undirected graph, calculating optimal routes between programmatic points of interest (destinations) and hidden navigational corridors (waypoints).

## 2. System Architecture

The QuickPath architecture is designed as a fast, client-side Single Page Application (SPA). By offloading the computational load of pathfinding to the user's local browser context, the application achieves near-instantaneous route calculation with zero server latency.

### 2.1 Technology Stack
*   **Frontend Framework:** React 19, initialized via Vite to ensure a highly optimized development and production build pipeline utilizing Hot Module Replacement (HMR).
*   **Map Rendering Engine:** The map interface is powered by `leaflet` and `react-leaflet`. Since traditional geographic map tiles (like OpenStreetMap) are irrelevant for indoor spaces, the application uses an Image Overlay technique to map custom building floor plans directly onto a coordinate system.
*   **Styling:** Custom CSS methodologies combined with an accessible component library to ensure ease-of-use on mobile devices, which represent the primary hardware medium for on-the-go navigation.

## 3. Algorithmic Approach and Data Structures

At the core of QuickPath is its routing engine, mapping spatial geometry into logical data structures.

### 3.1 Hybrid Navigation Graph
To mimic human walking behavior, the map is modeled as an undirected, weighted graph $G = (V, E)$, where $V$ represents the set of nodes and $E$ represents the corridors connecting them. 
The system defines two distinct types of nodes:
1.  **Destination Nodes ($V_d$):** Publicly visible points of interest (e.g., "IQAC", "Lab 6", "Innovation Hub"). These are indexed and searchable by the user.
2.  **Waypoint Nodes ($V_w$):** Invisible routing anchors strategically placed at corridor intersections and turns. These enforce pathing along walkable areas rather than allowing lines to cross through physical walls.

### 3.2 Pathfinding via Dijkstra's Algorithm
Finding the optimal path relies on **Dijkstra's Algorithm**, operating in $O((|V| + |E|) \log |V|)$ time using priority queues. 

The implementation in `navigation.js` calculates the shortest cumulative distance between a selected starting node and an end node:
1.  Initialization: All nodes are assigned an initial distance of infinity ($\infty$), while the starting node is set to $0$.
2.  Evaluation: The algorithm visits neighboring nodes, calculating distance ($D$) based on Euclidean edge weights. If $D_{current} + Weight(current, neighbor) < D_{neighbor}$, the neighbor's tentative distance is updated.
3.  Path Reconstruction: A previous-node tracking array backtracks from the target node to the source to reconstruct the linear route.

### 3.3 Turn-by-Turn Instruction Generation
Raw coordinate paths are translated into human-readable instructions via geometric analysis:
*   **Directional Angles:** The `turnDir(prev, cur, next)` function relies on the `Math.atan2(y, x)` function to calculate vector angles between path segments.
*   **Turn Logic:** By finding the delta between two vectors, the system determines if the turn degree warrants a "Turn Left" ($<0^\circ$), "Turn Right" ($>0^\circ$), or "Go Straight" (absolute difference $<30^\circ$).

## 4. User Experience (UX) Considerations

A primary concern in navigation interfaces is cognitive load. QuickPath addresses this by hiding the $V_w$ (Waypoint) nodes from the final user instruction list. Instead of rendering steps like "Go to Waypoint 4, then Waypoint 5", the system aggregates continuous straight paths, summarizing them into distance-based instructions (e.g., "Walk straight for 45m"). 

## 5. Conclusion
QuickPath successfully demonstrates the viability of utilizing standard web technologies to solve localized spatial problems without relying on heavy backend infrastructure or external GPS APIs. By merging visual layout techniques via Leaflet with core computer science algorithms, QuickPath ensures a responsive, highly accurate indoor navigation experience.

## 6. Future Work
Future iterations of QuickPath could explore:
1.  **Multi-floor Routing:** Introducing elevation logic and stairwell/elevator edge connections.
2.  **A* Heuristics:** Upgrading from Dijkstra's to the A* search algorithm to further optimize large-scale mappings using Euclidean distance as a heuristic.
3.  **Real-Time Positioning:** Integrating indoor positioning systems (IPS) utilizing Bluetooth Low Energy (BLE) beacons or Wi-Fi triangulation for live blue-dot tracking.
