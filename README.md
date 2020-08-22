graph.js - a library to simplify mathematical graphs
========

*This README is easier to read on the live demo.* Visit it [here](https://aqueous-cliffs-49044.herokuapp.com/).

This library was created by me, Steven Tran, for my CSC309 individual
project (Summer 2020).

A graph is a structure described by a set of vertices/nodes and edges
connecting them. Each edge may have a specific direction if the graph is
directed, and they may have a weight if the graph is weighted. Formally:

-   V represents the set of vertices
-   E represents the set of edges connecting a vertex u to
    another vertex v, where u,v are in V
-   Together, a graph given by the above sets is described as
    G=(V,E).
-   If the graph is weighted, there is an associated function
    w: E -> R which maps each edge to a
    real-valued weight.

Graphs may be represented in a number of ways, but this library uses
adjacency lists for the underlying representation. In other words, it
takes a specifically-formatted JS object as input and displays the
corresponding graph on an HTML5 canvas.

Features
--------

-   It\'s very easy to create a graph. Create a JS object containing the
    data, make \~5 library calls, and you\'ll have a graph displayed on
    your canvas \-- see below!
-   Any DOM elements created by the library contain barebone styles and
    do not have complicated structures so you can easily style it to
    your liking.
-   Algorithms can be added on externally and applied to the graph.

Getting Started
===============

Download the script
[here](https://aqueous-cliffs-49044.herokuapp.com/graph-lib.js) to a
directory of your choice (for example in the same directory as your HTML
page) and place the following tag in the \<head\> tag of your webpage:

    <script type="text/javascript" src="./graph-lib.js"></script>

A few examples can be seen if you scroll a little down, but here is a
overview of how to get started.

Setting up DOM elements
-----------------------

There are two separate components to a graph: the HTML5 canvas, and a
div which will contain controls if you choose to have controls. First,
define in your HTML file a canvas, and optionally, the controls div.

                    <div class="OPTIONAL CONTROLS CLASS" id="disease-graph-controls"></div>
                    <canvas class="OPTIONAL CANVAS CLASS" id="disease-graph"></canvas>
                    

where the IDs are chosen by you. Next, select the relevant DOM elements
in a JS script using `document.getElementById()`:

            const diseaseGraphCanvas = document.getElementById("disease-graph");
            const diseaseGraphCtx = diseaseGraphCanvas.getContext("2d");
            const diseaseGraphControls = document.getElementById("disease-graph-controls");
                    

Customizing and drawing the graph
---------------------------------

Now a Graph object can be instantiated. The constructor takes three
arguments:

-   The canvas context
-   optional style object (guide below)
-   optional graph title

    const diseaseGraph = new Graph(
        diseaseGraphCtx,
        { edgeColor: "#344a5e", activeColor: "green", vertexFillColor: "yellow" },
        "Disease Spread"
    );
                    

Next, the graph should have data populated using a JS object. You can
see in the examples below what the format should be.

        diseaseGraph.populateAdjListFromJSObject(diseaseAdjacencyList);
                    

Controls and algorithms can optionally be added.

        diseaseGraph.addControls(diseaseGraphControls);
        diseaseGraph.addAlgorithms(["BFS", "DFS"]);
                    

Finally, draw the graph to the canvas.

        diseaseGraph.drawToCanvas();
                    

Style guide
-----------

The library allows for the control and canvas divs to be styled however
you\'d like. Additionally, here are the optional graph styles (passed to
Graph constructor):

-   directed: whether or not the edges are directed
-   eades: applies Eades\' force-directed layout algorithm if this is
    true
-   textColor: color used for vertex name and edge weights
-   textFont: font used for vertex name and edge weights
-   vertexBorderColor: color used for border of node
-   vertexRadius: radius of node
-   vertexFillColor: fill color for nodes
-   vertexBorderWidth: width for border of nodes
-   edgeWidth: width to use for edges
-   edgeColor: color to use for edges

see below for usage.

List of library functions
-------------------------

Interactions with this library are only through the Graph class. The
following functions can be used:

-   `Graph.addControls(container)`: inject
    controls (graph title, algorithm-execution buttons) into a
    containing `div` in the DOM.

-   `Graph.createNewVertex(vertexName, x, y)`:
    inserts a new vertex into the Graph with vertexName as its name, and
    optional parameters x & y. If one of x or y are not supplied, a
    random position is selected.

-   `Graph.populateAdjListFromJSObject(adjListData)`: converts a JS object representation of an adjacency
    list and populates the Graph's ES6 Map adjacency list.

-   `Graph.drawToCanvas()`: draws this Graph to
    its bound Canvas.

-   `Graph.moveVertex(newPosition)`: moves
    currently selected vertex to newPosition. Should be used with event
    listeners.

-   `Graph.moveGraph(newPosition)`: moves every
    vertex and edge by an offset given by the difference between the current and new position. Should be used with
    event listeners.

-   `Graph.updateCanvasSize()`: updates the
    Canvas's internal size to correspond to its element in the DOM. Also
    scales the position of elements in this Graph accordingly.

-   `Graph.addListeners()`: Add event listeners
    to this Graph to respond to mouse and resize events.

-   `Graph.addAlgorithms(algorithms)`: Add the
    algorithms given in the `algorithms` array
    the controls for this Graph.

Included algorithms
-------------------

The library comes bundled with the following algorithms, but more can be
added by extending the library; the underlying representation is
described below.

Breadth First Search (BFS)

Depth First Search (DFS)

Prim\'s Minimal Spanning Tree Algorithm (MSTPRIM)

-   Only works for undirected graphs

Kruskal\'s Minimal Spanning Tree Algorithm (MSTKRUSKAL)

-   Only works for undirected graphs

See [here](https://en.wikipedia.org/wiki/Category:Graph_algorithms) for
an explanation of how they work.

Extending the Library
---------------------

It is possible to extend this library to support more algorithms. The
underlying representation of a graph is described by the following Graph
object:

            {
                graphTitle: "",                  // Name assigned to this Graph
                canvas: ,                        // Canvas context bound to this Graph

                adjList: (ES6 Map),              // Adjacency list representation of this Graph.

                mouseDown: false,                // Whether or not the user is interacting with the Graph
                mousePos: [0, 0],                // The position on the canvas which the user last selected

                stable: true,                    // Graph has reached equilibrium. Used for instantiation
                                                 // of the Graph when applying Eades' algorithm.

                styledVertices: {},              // Object containing type-[vertex list] pairs.
                                                 // Keeps track of vertices that have styles applied

                options: {                       // Vertex & edge styles for this Graph
                    directed: true,              
                    eades: false,
                    textColor: "black",          
                    textFont: "20px Arial",      
                    vertexBorderColor: "black",  
                    vertexRadius: 20,            
                    vertexFillColor: "white",    
                    vertexBorderWidth: 3,        
                    edgeWidth: 3,                
                    edgeColor: "black",          
                },
            }
                

Many interactions with the Graph depend on the aforementioned adjacency
list (which is an ES6 Map object), so here is a more detailed
description:

-   Each key is a vertex name and the corresponding value is an array
    containing:
    -   (ES6 Map containing edges to vertices this edge connects to, and
        associated edge styles)
    -   x position
    -   y position
    -   styles for this vertex
    -   optional auxility field for algorithms to use (e.g. BFS and DFS
        colouring)


Examples
========

Visit [the live demo](https://aqueous-cliffs-49044.herokuapp.com/) for examples.
