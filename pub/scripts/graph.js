"use strict";

const diseaseAdjacencyList = {
    a: [{ b: [1], d: [6], e: [2], f: [3] }],
    b: [{ c: [7], e: [5], f: [1] }],
    c: [{ e: [9] }],
    d: [{ f: [2] }],
    g: [{ b: [6] }],
};

const treeAdjacencyList = {
    a: [{ b: [6, 50, 20], c: [3, 150, 20] }, 100, 10],
    b: [{ d: [3, 30, 50], e: [20, 70, 50] }],
    c: [{ f: [4, 130, 50], g: [20, 170, 50] }],
    d: [{ h: [10, 20, 70], i: [1, 40, 70] }],
    g: [{ j: [1, 190, 80] }],
    j: [{ k: [3, 220, 100] }],
};

const mstExample = {
    a: [{ b: [3, 50, 130], d: [6, 60, 70], e: [9, 200, 200] }, 20, 150],
    b: [{ c: [2, 80, 100], d: [4, 60, 70], e: [9, 200, 200], f: [9, 210, 150] }],
    c: [{ d: [2, 60, 70], g: [9, 210, 20], f: [8, 210, 150] }],
    d: [{ g: [9, 210, 20] }],
    e: [{ f: [8, 210, 150], j: [18, 300, 50] }],
    f: [{ g: [7, 210, 20], i: [9, 260, 50], j: [10, 300, 50] }],
    g: [{ h: [4, 260, 20], i: [5, 260, 50] }],
    h: [{ i: [1, 260, 50], j: [13, 300, 50] }],
    i: [{ j: [3, 300, 50] }],
};

const largeDiseaseGraph = {
    a: [{ b: [1] }],
    b: [{ c: [1] }],
    c: [{ d: [1] }],
    d: [{ e: [1] }],
    e: [{ f: [1] }],
    f: [{ g: [1] }],
    g: [{ h: [1] }],
    h: [{ i: [1] }],
    i: [{ j: [1] }],
    j: [{ k: [1] }],
    k: [{ l: [1] }],
    l: [{ m: [1] }],
    m: [{ n: [1] }],
    n: [{ o: [1] }],
    o: [{ p: [1] }],
    p: [{ q: [1] }],
    q: [{ r: [1] }],
    r: [{ s: [1] }],
    s: [{ t: [1] }],
    t: [{ u: [1] }],
    u: [{ v: [1] }],
    v: [{ w: [1] }],
    w: [{ x: [1] }],
    x: [{ y: [1] }],
    y: [{ aa: [1] }],
    aa: [{ bb: [1] }],
    bb: [{ cc: [1] }],
    cc: [{ dd: [1] }],
    dd: [{ ee: [1] }],
    ee: [{ ff: [1] }],
    ff: [{ gg: [1] }],
    gg: [{ hh: [1] }],
    hh: [{ ii: [1] }],
    ii: [{ jj: [1] }],
    jj: [{ kk: [1] }],
    kk: [{ ll: [1] }],
    ll: [{ mm: [1] }],
    mm: [{ nn: [1] }],
    nn: [{ oo: [1] }],
    oo: [{ pp: [1] }],
    pp: [{ qq: [1] }],
    qq: [{ rr: [1] }],
    rr: [{ ss: [1] }],
    ss: [{ tt: [1] }],
    tt: [{ uu: [1] }],
    uu: [{ vv: [1] }],
    vv: [{ ww: [1] }],
    ww: [{ xx: [1] }],
    xx: [{ yy: [1] }],
    yy: [{ z: [1] }],
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

        this.isAlgorithmRunning = false;
        this.currentAlgorithm = null;
        this.mousePos = [0, 0];

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
    createNewVertex(vertexName, x, y) {
        let defaultVertexOptions = Object.keys(this.options)
            .filter(
                (
                    key // Filter out invalid options.
                ) =>
                    [
                        "vertexBorderColor",
                        "vertexRadius",
                        "vertexFillColor",
                        "textColor",
                        "textFont",
                        "vertexBorderWidth",
                    ].indexOf(key) >= 0
            )
            .reduce((obj2, key) => ((obj2[key] = this.options[key]), obj2), {});

        if (x === undefined || y === undefined) {
            this.adjList.set(vertexName, [
                new Map(),
                Math.floor(Math.random() * this.canvas.canvas.width),
                Math.floor(Math.random() * this.canvas.canvas.height),
                Object.assign({}, defaultVertexOptions),
                "",
            ]);
        } else {
            this.adjList.set(vertexName, [
                new Map(),
                x,
                y,
                Object.assign({}, defaultVertexOptions),
                "",
            ]);
        }
    }

    /**
     * Adds vertex-weight pairs to the Map representing this Graph.
     *
     * For the Alpha release, the data source is hardcoded.
     */
    populateAdjListFromJSObject(adjListData) {
        if (typeof adjListData !== "object" || adjListData === null) {
            throw "Adjacency list data source must be a JS object.";
        }

        const defaultEdgeOptions = Object.keys(this.options)
            .filter((key) => ["edgeColor", "edgeWidth"].indexOf(key) >= 0)
            .reduce((obj2, key) => ((obj2[key] = this.options[key]), obj2), {});

        for (const [source, [newEdges, sourceX, sourceY]] of Object.entries(adjListData)) {
            // Bound Graph doesn't contain source
            if (!this.adjList.has(source)) {
                this.createNewVertex(source, sourceX, sourceY);
            }

            // Add edges to bound Graph's adjacency list
            Object.entries(newEdges).map((edge) => {
                const [target, [weight, x, y]] = edge;
                // Target vertex doesn't exist; create a new one
                if (!this.adjList.has(target)) {
                    this.createNewVertex(target, x, y);
                }

                // Set the source-target weight
                this.adjList
                    .get(source)[0]
                    .set(target, [weight, Object.assign({}, defaultEdgeOptions)]);
            });
        }
    }

    /**
     * Draws vertices to the canvas, applying a force-directed layout algorithm
     * on first draw and bringing all vertices within canvas bounds.
     */
    drawToCanvas() {
        if (!this.stable) {
            //eades(this.adjList);
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
            Array.from(vertexList[0].entries()).forEach((v) => v[1][1].edgeColor = "black");
            console.log(vertexList[0]);
            vertexList[3] = {
                vertexRadius: 20,
                vertexFillColor: "white",
                textColor: "black",
                textFont: "20px Arial",
                vertexBorderColor: "black",
                vertexBorderWidth: 3,
            };
        }

        this.styledVertices[type] = [];
        this.redrawAll();
    }

    /**
     * Draws all vertices and edges in this Graph on the canvas. Should only be
     * used internally.
     */
    redrawAll() {
        if (
            this.canvas.canvas.height !== this.canvas.canvas.offsetHeight ||
            this.canvas.canvas.width !== this.canvas.canvas.offsetWidth
        ) {
            this.updateCanvasSize();
        }
        this.canvas.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
        for (let [source, [targets, x, y]] of this.adjList.entries()) {
            for (const [target, [weight, style]] of targets.entries()) {
                drawEdge(
                    weight,
                    [x, y],
                    this.adjList.get(target).slice(1, 3),
                    this.canvas,
                    this.mousePos,
                    { ...style, directed: this.options.directed }
                );
            }
        }

        for (const source of this.adjList.keys()) {
            drawVertex(
                source,
                this.adjList.get(source).slice(1, 3),
                this.canvas,
                this.mousePos,
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
            if (!this.isAlgorithmRunning) {
                this.styleSelectedVertex([e.offsetX, e.offsetY], "selected");
            } else {
                this.unstyleVertices(this.currentAlgorithm);
                this.currentAlgorithm = null;
                this.isAlgorithmRunning = false;
            }
            this.drawToCanvas();
        });

        canvas.addEventListener("mousemove", (e) => {
            const pos = [e.offsetX, e.offsetY];
            if (this.mouseDown && !this.isAlgorithmRunning) {
                if (!this.moveVertex(pos)) {
                    this.moveGraph(pos);
                }
                this.drawToCanvas();
            }
            this.mousePos = pos;
        });

        canvas.addEventListener("mouseup", () => {
            this.mouseDown = false;
            if (!this.isAlgorithmRunning) {
                this.unstyleVertices("selected");
            }
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
                    if (this.isAlgorithmRunning) {
                        this.unstyleVertices(this.currentAlgorithm);
                        this.currentAlgorithm = null;
                    }

                    await sleep(1000);
                    switch (alg.toLowerCase()) {
                        case "bfs":
                            await bfs(this, "a");
                            break;
                        case "dfs":
                            await dfs(this, "a");
                            break;
                        case "mstprim":
                            await mstprim(this, "a");
                            break;
                        case "mstkruskal":
                            await mstkruskal(this, "a");
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
