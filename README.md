# js-library-transt19
## Project Structure
    src
    ├── graph.js            # Main interface for interacting with the library
    ├── algorithms          # Contains the algorithms which can be run on a Graph
    │   ├── bfs.js              -> Breadth first search
    │   ├── dfs.js              -> Depth first search
    │   └── mst-prim.js         -> Spanning tree (not yet implemented)
    ├── assets              # Styles for the displayed graph and components
    ├── canvas.js           # Canvas utility functions for drawing Graphs
    └── util                # Utility functions
        ├── eades.js            -> Force-directed graph layout algorithm
        ├── queue.js            -> FIFO Queue
        └── sleep.js            -> Promise-based asynchronous code blocking
