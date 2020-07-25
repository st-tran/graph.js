"use strict";

const exampleAdjacencyMatrix = [
    [0, 1, 0, 6, 2, 3],
    [1, 0, 7, 0, 5, 1],
    [0, 6, 0, 0, 9, 0],
    [6, 0, 0, 0, 0, 2],
    [2, 5, 9, 0, 0, 3],
    [3, 1, 0, 2, 3, 0],
];

const exampleAdjacencyList = {
    a: { b: 1, d: 6, e: 2, f: 3 },
    b: { c: 7, e: 5, f: 1 },
    c: { e: 9 },
    d: { f: 2 },
    f: { a: 6 },
    g: { b: 6 },
    h: { f: 2 },
    i: { f: 2 },
};

/**
 * A mathematical graph with edges and vertices represented by an adjacency
 * list using a nested Map.
 *
 * Structure:
 * adjList := Map{
 *      vertexName: [
 *          Map<connected edge name, connected edge weight>,
 *          x, y,
 *          vertex and edge styles,
 *          auxiliary information used for algorithms
 *          ],
 *      ...
 * }
 * where x, y represent the position of vertexName on a Cartesian plane.
 */
class Graph {
    constructor(canvas, options, graphTitle) {
        this.canvas = canvas;
        this.mouseDown = false;
        this.graphTitle = graphTitle || "Graph";

        // Set default options if not passed
        options = options || {};
        !("directed" in options) && (options.directed = true);

        !("textColor" in options) && (options.textColor = "black");
        !("textFont" in options) && (options.textFont = "20px Arial");

        // Vertex options
        !("vertexBorderColor" in options) && (options.vertexBorderColor = "black");
        !("vertexRadius" in options) && (options.vertexRadius = 20);
        !("vertexFillColor" in options) && (options.vertexFillColor = "white");
        !("vertexBorderWidth" in options) && (options.vertexBorderWidth = 3);

        // Edge options
        !("edgeWidth" in options) && (options.edgeWidth = 3);
        !("edgeColor" in options) && (options.edgeColor = "black");
        this.options = options;

        this.adjList = new Map();
        this.stable = false;
        this.styledVertices = {};
        this.activeVertex = undefined;

        this.addListeners();
        this.populateAdjListFromJSObject();
    }

    /**
     * Injects controls into a containing div.
     */
    addControls(container) {
        const controlTitle = document.createElement("h1");
        const controlList = document.createElement("ul");
        controlList.setAttribute("id", `${this.graphTitle.toLowerCase()}-control-algs`);
        controlTitle.innerHTML = this.graphTitle;
        container.appendChild(controlTitle);
        container.appendChild(controlList);
    }

    /**
     * Creates a new vertex with a randomly assigned position on the canvas,
     * and adds it to the adjacency list.
     */
    createNewVertex(vertexName) {
        let defaultVertexOptions = Object.keys(this.options)
            .filter(
                (key) =>
                    [
                        "vertexBorderColor",
                        "vertexRadius",
                        "vertexFillColor",
                        "textColor",
                        "textFont",
                        "vertexBorderWidth",
                        "edgeColor",
                        "edgeWidth",
                    ].indexOf(key) >= 0
            )
            .reduce((obj2, key) => ((obj2[key] = this.options[key]), obj2), {});

        this.adjList.set(vertexName, [
            new Map(),
            Math.floor(Math.random() * this.canvas.canvas.width),
            Math.floor(Math.random() * this.canvas.canvas.height),
            Object.assign({}, defaultVertexOptions),
        ]);
    }

    /**
     * Adds vertex-weight pairs to the Map representing this Graph.
     *
     * For the Alpha release, the data source is hardcoded.
     */
    populateAdjListFromJSObject() {
        // Hardcoded data source for alpha release.
        const adjListData = exampleAdjacencyList;

        if (typeof adjListData !== "object" || adjListData === null) {
            throw "Adjacency list data source must be a JS object.";
        }

        for (const [source, newEdges] of Object.entries(adjListData)) {
            // Bound Graph doesn't contain source
            if (!this.adjList.has(source)) {
                this.createNewVertex(source);
            }

            // Add edges to bound Graph's adjacency list
            Object.entries(newEdges).map((edge) => {
                const [target, weight] = edge;
                // Target vertex doesn't exist; create a new one
                if (!this.adjList.has(target)) {
                    this.createNewVertex(target);
                }

                // Set the source-target weight
                this.adjList.get(source)[0].set(target, weight);
            });
        }
    }

    /**
     * Draws vertices to the canvas, applying a force-directed layout algorithm
     * on first draw and bringing all vertices within canvas bounds.
     */
    drawToCanvas() {
        if (!this.stable) {
            eades(this.adjList);
            for (let [source, [, x, y]] of this.adjList.entries()) {
                // Bring source vertex back in bounds
                if (x < 0) {
                    this.adjList.get(source)[1] = 40;
                    x = 40;
                } else if (x > this.canvas.canvas.width) {
                    this.adjList.get(source)[1] = this.canvas.canvas.width - 40;
                    x = this.canvas.canvas.width - 40;
                }
                if (y < 0) {
                    this.adjList.get(source)[2] = 40;
                    y = 40;
                } else if (y > this.canvas.canvas.height) {
                    this.adjList.get(source)[2] = this.canvas.canvas.height - 40;
                    y = this.canvas.canvas.height - 40;
                }
            }
            this.stable = true;
            this.redrawAll();
        } else {
            this.redrawAll();
        }
    }

    /**
     * Applies styles to the vertex at position and returns true, or returns
     * false if there is no vertex there.
     */
    styleSelectedVertex(position) {
        const matching = Array.from(this.adjList.entries()).find(([, vertexList]) => {
            const vertexPosition = vertexList.slice(1, 3);
            return (
                vertexPosition[0] - 20 <= position[0] &&
                position[0] <= vertexPosition[0] + 20 &&
                vertexPosition[1] - 20 <= position[1] &&
                position[1] <= vertexPosition[1] + 20
            );
        });

        if (!matching) {
            return;
        }

        matching[1][3].textColor = "red";
        matching[1][3].edgeColor = "red";

        if (!this.styledVertices.hasOwnProperty("selected")) {
            this.styledVertices.selected = [];
        }
        this.styledVertices["selected"].push(matching);
    }

    /**
     * Moves the vertex at the selected position if there is one and returns
     * true, or returns false if there is not one selected.
     */
    moveVertex(newPosition) {
        const selected = this.styledVertices.selected;
        if (selected !== undefined && selected.length > 0) {
            selected[0][1][1] = newPosition[0];
            selected[0][1][2] = newPosition[1];
            return true;
        }
        return false;
    }

    /**
     * Moves all vertices and edges on the graph to the offset determined by
     * difference between clicked location and the newPosition.
     */
    moveGraph(newPosition) {
        const dx = newPosition[0] - this.positionOnClick[0];
        const dy = newPosition[1] - this.positionOnClick[1];
        Array.from(this.adjList.values()).forEach((list) => {
            list[1] += dx;
            list[2] += dy;
        });
        this.positionOnClick[0] = newPosition[0];
        this.positionOnClick[1] = newPosition[1];
    }

    /**
     * Removes all styles applied to vertices with a specified type (selected,
     * algorithm types, etc.)
     */
    unstyleVertices(type) {
        const vertices = this.styledVertices[type];

        if (!vertices) {
            return;
        }

        for (const [, vertexList] of vertices) {
            vertexList[3] = {
                vertexRadius: 20,
                vertexFillColor: "white",
                textColor: "black",
                textFont: "20px Arial",
                edgeColor: "black",
                vertexBorderColor: "black",
                vertexBorderWidth: 3,
            };
        }

        this.styledVertices[type] = [];
    }

    /**
     * Draws all vertices and edges in this Graph on the canvas. Should only be
     * used internally.
     */
    redrawAll() {
        this.canvas.clearRect(0, 0, canvas.width, canvas.height);
        for (let [source, [targets, x, y]] of this.adjList.entries()) {
            for (const [target, weight] of targets.entries()) {
                drawEdge(weight, [x, y], this.adjList.get(target).slice(1, 3), this.canvas, {
                    ...this.adjList.get(source)[3],
                    directed: this.options.directed,
                });
            }
        }

        for (const source of this.adjList.keys()) {
            drawVertex(
                source,
                this.adjList.get(source).slice(1, 3),
                this.canvas,
                this.adjList.get(source)[3]
            );
        }
    }

    /**
     * Sets the internal canvas dimensions to correspond to the size of the
     * canvas element in the DOM.
     */
    updateCanvasSize() {
        const canvas = this.canvas.canvas;
        for (const [, adjList] of this.adjList.entries()) {
            adjList[1] = (adjList[1] / canvas.width) * canvas.offsetWidth;
            adjList[2] = (adjList[2] / canvas.height) * canvas.offsetHeight;
        }
        canvas.height = canvas.offsetHeight;
        canvas.width = canvas.offsetWidth;
        this.redrawAll();
    }

    /**
     * Adds listeners to the canvas currently used by this Graph to facilitate
     * selecting and moving of nodes, as well as the moving of the entire
     * Graph.
     */
    addListeners() {
        const canvas = this.canvas.canvas;
        canvas.addEventListener("mousedown", (e) => {
            this.mouseDown = true;
            this.positionOnClick = [e.offsetX, e.offsetY];
            this.styleSelectedVertex([e.offsetX, e.offsetY], "selected");
            this.drawToCanvas();
        });

        canvas.addEventListener("mousemove", (e) => {
            if (this.mouseDown) {
                if (!this.moveVertex([e.offsetX, e.offsetY])) {
                    this.moveGraph([e.offsetX, e.offsetY]);
                }
                this.drawToCanvas();
            }
        });

        canvas.addEventListener("mouseup", () => {
            this.mouseDown = false;
            this.unstyleVertices("selected");
            this.drawToCanvas();
        });

        window.addEventListener("resize", this.updateCanvasSize.bind(this));
    }

    /**
     * Adds the algorithms in the array to the controls list.
     */
    addAlgorithms(algorithms) {
        document.getElementById(`${this.graphTitle.toLowerCase()}-control-algs`).append(
            ...algorithms.map((alg) => {
                const entry = document.createElement("li");
                entry.setAttribute("id", `${alg}-button`);
                entry.innerHTML = alg;
                entry.addEventListener("click", async () => {
                    await sleep(1000);
                    switch (alg.toLowerCase()) {
                        case "bfs":
                            bfs(g, "z");
                            break;
                        case "dfs":
                            dfs(g, "a");
                            break;
                        default:
                            console.log(`Algorithm ${alg} not valid.`);
                            break;
                    }
                });
                return entry;
            })
        );
    }
}
