// Global object containing components of my library.
const gjs = {
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
    Graph: class Graph {
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
            !("eades" in options) && (options.eades = false);

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
                Array.from(vertexList[0].entries()).forEach((v) => (v[1][1].edgeColor = "black"));
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
                    gjs.drawEdge(
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
                gjs.drawVertex(
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

                        await gjs.sleep(500);
                        switch (alg.toLowerCase()) {
                            case "bfs":
                                await gjs.algorithms.bfs(this, "a");
                                break;
                            case "dfs":
                                await gjs.algorithms.dfs(this, "a");
                                break;
                            case "mstprim":
                                await gjs.algorithms.mstprim(this, "a");
                                break;
                            case "mstkruskal":
                                await gjs.algorithms.mstkruskal(this, "a");
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
    },
    drawEdge: (weight, sourcePos, targetPos, canvasCtx, mousePos, options) => {
        options = options || {
            edgeWidth: 3,
            edgeColor: "black",
            directed: false,
        };

        canvasCtx.strokeStyle = options.edgeColor;
        canvasCtx.lineWidth = options.edgeWidth;
        canvasCtx.lineCap = "round";

        canvasCtx.beginPath();
        canvasCtx.moveTo(...sourcePos);

        const dx = targetPos[0] - sourcePos[0];
        const dy = targetPos[1] - sourcePos[1];
        const angle = Math.atan2(dy, dx);

        if (options.directed) {
            const tPosCopy = [...targetPos];

            tPosCopy[0] -= 20 * Math.cos(angle);
            tPosCopy[1] -= 20 * Math.sin(angle);
            canvasCtx.lineTo(...tPosCopy);
            canvasCtx.lineTo(
                tPosCopy[0] - 10 * Math.cos(angle - Math.PI / 6),
                tPosCopy[1] - 10 * Math.sin(angle - Math.PI / 6)
            );
            canvasCtx.lineTo(...tPosCopy);
            canvasCtx.lineTo(
                tPosCopy[0] - 10 * Math.cos(angle + Math.PI / 6),
                tPosCopy[1] - 10 * Math.sin(angle + Math.PI / 6)
            );
            canvasCtx.moveTo(...tPosCopy);
        } else {
            canvasCtx.lineTo(...targetPos);
        }

        canvasCtx.closePath();
        canvasCtx.stroke();

        if (
            mousePos.every(
                (v, i) => Math.abs(sourcePos[i] - v) <= 10 || Math.abs(targetPos[i] - v) <= 10
            )
        ) {
            canvasCtx.fillStyle = options.textColor;
            canvasCtx.font = options.textFont;
            canvasCtx.textAlign = "center";
            canvasCtx.textBaseline = "middle";

            canvasCtx.save();
            canvasCtx.translate(
                (sourcePos[0] + targetPos[0]) / 2 + 10 * Math.sin(angle),
                (sourcePos[1] + targetPos[1]) / 2 + 10 * Math.cos(angle)
            );
            if (dx < 0) {
                canvasCtx.rotate(angle - Math.PI);
            } else {
                canvasCtx.rotate(angle);
            }
            canvasCtx.fillText(weight, 5, 5);
            canvasCtx.restore();
        }
    },

    drawVertex: (name, center, canvasCtx, mousePos, options) => {
        options = options || {
            vertexRadius: 20,
            vertexFillColor: "white",
            textColor: "black",
            textFont: "20px Arial",
            vertexBorderColor: "black",
            vertexBorderWidth: 3,
        };

        canvasCtx.strokeStyle = options.vertexBorderColor;
        canvasCtx.lineWidth = options.vertexBorderWidth;
        canvasCtx.fillStyle = options.vertexFillColor;

        const mouseInVertex = center.every(
            (v, i) => Math.abs(mousePos[i] - v) <= options.vertexRadius
        );

        canvasCtx.beginPath();
        canvasCtx.arc(...center, mouseInVertex ? options.vertexRadius : 10, 0, 2 * Math.PI, true);
        canvasCtx.closePath();
        canvasCtx.stroke();
        canvasCtx.fill();

        canvasCtx.fillStyle = options.textColor;
        canvasCtx.textAlign = "center";
        canvasCtx.textBaseline = "middle";
        canvasCtx.font = mouseInVertex ? options.textFont : "12px Arial";

        canvasCtx.fillText(name, ...center);
    },
    algorithms: {
        bfs: async (graph, source) => {
            const queue = new gjs.queue.Queue();
            const adjList = graph.adjList;

            if (!graph.styledVertices.hasOwnProperty("bfs")) {
                graph.styledVertices.bfs = [];
            }

            graph.currentAlgorithm = "bfs";
            graph.isAlgorithmRunning = true;

            if (adjList.has(source)) {
                queue.enqueue([source, adjList.get(source)]);

                const info = queue.peek()[1];
                info[info.length - 1] = "visited";
            } else {
                throw `Cannot perform BFS on graph ${source} because ${source} is not in the graph.`;
            }

            await gjs.sleep(500);

            const styledVertices = graph.styledVertices.bfs;
            while (!queue.isEmpty()) {
                const [v, vertexInfo] = queue.dequeue();
                vertexInfo[3].edgeColor = "red";
                styledVertices.push([v, vertexInfo]);

                for (const neighbour of vertexInfo[0].keys()) {
                    const neighbourInfo = adjList.get(neighbour);
                    styledVertices.push([neighbour, neighbourInfo]);

                    vertexInfo[0].get(neighbour)[1].edgeColor = "red";
                    graph.redrawAll();
                    await gjs.sleep(500);

                    if (
                        neighbourInfo[neighbourInfo.length - 1] === "visited" ||
                        neighbourInfo[neighbourInfo.length - 1] === "explored"
                    ) {
                        continue;
                    }
                    queue.enqueue([neighbour, neighbourInfo]);
                }

                vertexInfo[vertexInfo.length - 1] = "explored";
            }

            graph.adjList.forEach((v) => (v[4] = ""));
        },
        dfs: async (graph, source) => {
            const stack = [];
            const adjList = graph.adjList;

            if (!graph.styledVertices.hasOwnProperty("dfs")) {
                graph.styledVertices.dfs = [];
            }

            graph.currentAlgorithm = "dfs";
            graph.isAlgorithmRunning = true;

            if (adjList.has(source)) {
                stack.push([source, adjList.get(source)]);

                const info = stack[stack.length - 1][1];
                info[info.length - 1] = "visited";

                graph.redrawAll();
            } else {
                throw `Cannot perform DFS on graph ${source} because ${source} is not in the graph.`;
            }

            await gjs.sleep(500);

            const styledVertices = graph.styledVertices.dfs;
            while (stack.length > 0) {
                const [vertex, vertexInfo] = stack.pop();

                for (const neighbour of vertexInfo[0].keys()) {
                    const neighbourInfo = adjList.get(neighbour);
                    styledVertices.push([vertex, vertexInfo]);

                    vertexInfo[0].get(neighbour)[1].edgeColor = "red";
                    graph.redrawAll();
                    await gjs.sleep(100);

                    if (
                        neighbourInfo[neighbourInfo.length - 1] === "visited" ||
                        neighbourInfo[neighbourInfo.length - 1] === "explored"
                    ) {
                        continue;
                    }

                    stack.push([neighbour, neighbourInfo]);
                }

                vertexInfo[3].vertexColor = "blue";
                graph.redrawAll();
                await gjs.sleep(100);

                vertexInfo[vertexInfo.length - 1] = "explored";
            }

            graph.adjList.forEach((v, k) => (v[4] = ""));
        },
        mstkruskal: async (graph, source) => {
            if (!graph.styledVertices.hasOwnProperty("mstkruskal")) {
                graph.styledVertices.mstkruskal = [];
            }

            graph.currentAlgorithm = "mstkruskal";
            graph.isAlgorithmRunning = true;

            let turnedDirected = graph.options.directed;
            if (turnedDirected) {
                graph.options.directed = false;
            }

            const ds = new gjs.disjointSet();
            const edges = Array.from(graph.adjList).reduce((a, v) => {
                ds.add(v[1]);

                Array.from(v[1][0].entries()).forEach((v2) => a.push([v[0], v2[0], v2[1][0]]));

                return a;
            }, new gjs.pqueue.TinyQueue([], (e1, e2) => e1[2] - e2[2]));

            const sol = [];
            while (edges.length) {
                const edge = edges.pop();
                const u = graph.adjList.get(edge[0]);
                const v = graph.adjList.get(edge[1]);

                if (!ds.connected(u, v)) {
                    sol.push(edge);
                    ds.union(u, v);
                }
            }

            sol.forEach(async (e) => {
                graph.adjList.get(e[0])[0].get(e[1])[1].edgeColor = "red";
            });
            graph.redrawAll();

            if (turnedDirected) {
                graph.options.directed = true;
            }

            graph.adjList.forEach((v) => {
                v[4] = "";
                delete v[5];
            });
        },
        mstprim: async (graph, source) => {
            if (!graph.styledVertices.hasOwnProperty("mstprim")) {
                graph.styledVertices.mstprim = [];
            }

            graph.currentAlgorithm = "mstprim";
            graph.isAlgorithmRunning = true;

            let turnedDirected = graph.options.directed;
            if (turnedDirected) {
                graph.options.directed = false;
            }

            graph.adjList.forEach((v) => (v[4] = [Infinity, null]));

            const edges = [];
            const p_queue = new gjs.pqueue.TinyQueue([], (e1, e2) => e1[2] - e2[2]);
            const root = graph.adjList.keys().next().value;

            const styledVertices = graph.styledVertices.mstprim;
            Array.from(graph.adjList.get(root)[0]).forEach((v) =>
                p_queue.push([root, v[0], v[1][0]])
            );
            while (p_queue.length) {
                const edge = p_queue.pop();
                const [popStart, popEnd] = edge;

                let unvisited = null;
                if (graph.adjList.get(popStart)[4][1] === null) {
                    unvisited = popStart;
                } else if (graph.adjList.get(popEnd)[4][1] === null) {
                    unvisited = popEnd;
                }

                if (unvisited) {
                    edges.push(edge);
                    // TODO: maintain arr of styled vertices here

                    graph.adjList.get(edge[0])[0].get(edge[1])[1].edgeColor = "red";
                    await gjs.sleep(100);
                    graph.redrawAll();

                    graph.adjList.get(unvisited)[4][1] = unvisited;
                    Array.from(graph.adjList.get(unvisited)[0]).forEach((v) => {
                        if (
                            graph.adjList.get(unvisited)[4][1] === null ||
                            graph.adjList.get(v[0])[4][1] === null
                        ) {
                            p_queue.push([unvisited, v[0], v[1][0]]);
                        }
                    });
                }
            }

            graph.adjList.forEach((v) => (v[4] = ""));
            if (turnedDirected) {
                graph.options.directed = true;
            }
        },
    },
    sleep: (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
    eades: {
        consts: {
            cSpring: 2, // Spring constant
            cRepul: 1, // Repulsion constant
            cDispl: 1, // Displacement constant
            iterations: 100, // Number of iterations to run algorithm for
        },
        utils: {
            /**
             * Unit vector pointing from u to v
             */
            unit_vec: (uPos, vPos) => {
                const vec = [vPos[0] - uPos[0], vPos[1] - uPos[1]];
                return vec.map((comp) => {
                    return comp / Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
                });
            },
            /**
             * Squared Euclidean distance between u and v
             */
            squared_eucl_dist: (uPos, vPos) => {
                return Math.pow(uPos[0] - vPos[1], 2) + Math.pow(uPos[1] - vPos[1], 2);
            },
            /**
             * Repulsive force between non-adjacent nodes u, v
             */
            f_repul: (adjList, u, v) => {
                let uPos = adjList.get(u).slice(1);
                let vPos = adjList.get(v).slice(1);
                uPos = uPos.map((c) => {
                    return c / Math.sqrt(Math.pow(uPos[0], 2) + Math.pow(uPos[1], 2));
                });
                vPos = vPos.map((c) => {
                    return c / Math.sqrt(Math.pow(vPos[0], 2) + Math.pow(vPos[1], 2));
                });
                const coef = cRepul / squared_eucl_dist(uPos, vPos);

                return unit_vec(uPos, vPos).map((comp) => {
                    return coef * comp;
                });
            },
            /**
             * Spring/attractive force between adjacent vertices u, v
             */
            f_spring: (adjList, u, v) => {
                const uPos = adjList.get(u).slice(1);
                const vPos = adjList.get(v).slice(1);
                const coef =
                    cSpring *
                    Math.log10(Math.sqrt(squared_eucl_dist(vPos, uPos)) / adjList.get(v)[0].get(u));
                return unit_vec(vPos, uPos).map((comp) => {
                    return coef * comp;
                });
            },
            /**
             * Displacement vector for vertex v
             */
            vec_displ: (adjList, v) => {
                const adjacent = Array.from(adjList.get(v)[0].keys());
                const nonAdjacent = Array.from(adjList.keys()).filter((u) => {
                    return u !== v && !adjList.get(v)[0].has(u);
                });

                let fNonAdj = [0, 0];
                let fAdj = [0, 0];

                for (const u of nonAdjacent) {
                    const f = f_repul(adjList, u, v);
                    fNonAdj = [fNonAdj[0] + f[0] || 0, fNonAdj[1] + f[1] || 0];
                }

                for (const u of adjacent) {
                    const f = f_spring(adjList, u, v);
                    fAdj = [fAdj[0] + f[0] || 0, fAdj[1] + f[1] || 0];
                }

                const y = [fNonAdj[0] + fAdj[0], fNonAdj[1] + fAdj[1]];
                return y;
            },
        },
        /**
         * Eades force-directed graph layout adjustment algorithm
         */
        eades: (adjList) => {
            for (let i = 0; i < iterations; i++) {
                const vertexForces = new Map();
                for (const v of adjList.keys()) {
                    vertexForces.set(v, vec_displ(adjList, v));
                }

                for (const v of adjList.keys()) {
                    const force = vertexForces.get(v);
                    adjList.get(v)[1] += cDispl * force[0];
                    adjList.get(v)[2] += cDispl * force[1];
                }
            }
        },
    },
    /**
     * FIFO queue implementation used here.
     * Created by Kate Morley - http://code.iamkate.com/ - and released under the terms
     * of the CC0 1.0 Universal legal code:
     * http://creativecommons.org/publicdomain/zero/1.0/legalcode
     */
    queue:
        /* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
         * items are added to the end of the queue and removed from the front.
         */
        function Queue() {
            // initialise the queue and offset
            var queue = [];
            var offset = 0;

            // Returns the length of the queue.
            this.getLength = function () {
                return queue.length - offset;
            };

            // Returns true if the queue is empty, and false otherwise.
            this.isEmpty = function () {
                return queue.length == 0;
            };

            /* Enqueues the specified item. The parameter is:
             *
             * item - the item to enqueue
             */
            this.enqueue = function (item) {
                queue.push(item);
            };

            /* Dequeues an item and returns it. If the queue is empty, the value
             * 'undefined' is returned.
             */
            this.dequeue = function () {
                // if the queue is empty, return immediately
                if (queue.length == 0) return undefined;

                // store the item at the front of the queue
                var item = queue[offset];

                // increment the offset and remove the free space if necessary
                if (++offset * 2 >= queue.length) {
                    queue = queue.slice(offset);
                    offset = 0;
                }

                // return the dequeued item
                return item;
            };

            /* Returns the item at the front of the queue (without dequeuing it). If the
             * queue is empty then undefined is returned.
             */
            this.peek = function () {
                return queue.length > 0 ? queue[offset] : undefined;
            };
        },
    /**
     * Disjoint set (union-find) implementation used here.
     *
     * (c) 2014, Andrii Heonia
     * https://github.com/AndriiHeonia/disjoint-set
     */
    disjointSet: class {
        constructor() {
            this._reset();
        }

        add(val) {
            var id = this._isPrimitive(val) ? val : this._lastId;
            if (typeof val._disjointSetId === "undefined") {
                val._disjointSetId = this._relations[id] = id;
                this._objects[id] = val;
                this._size[id] = 1;
                this._lastId++;
            }
            return this;
        }

        find(val) {
            var id = this._isPrimitive(val) ? val : val._disjointSetId;
            return this._findById(id);
        }

        _findById(id) {
            var rootId = id;
            while (this._relations[rootId] !== rootId) {
                rootId = this._relations[rootId];
            }
            return rootId;
        }

        connected(val1, val2) {
            return this.find(val1) === this.find(val2) ? true : false;
        }

        union(val1, val2) {
            var val1RootId = this.find(val1),
                val2RootId = this.find(val2);

            if (val1RootId === val2RootId) {
                return this;
            }

            if (this._size[val1RootId] < this._size[val2RootId]) {
                this._relations[val1RootId] = val2RootId;
                this._size[val1RootId] += this._size[val2RootId];
            } else {
                this._relations[val2RootId] = val1RootId;
                this._size[val2RootId] += this._size[val1RootId];
            }

            return this;
        }

        extract() {
            var rootId,
                resObj = {},
                resArr = [];

            for (var id in this._relations) {
                rootId = this._findById(id);

                if (typeof resObj[rootId] === "undefined") {
                    resObj[rootId] = [];
                }
                resObj[rootId].push(this._objects[id]);
            }

            for (var key1 in resObj) {
                resArr.push(resObj[key1]);
            }

            return resArr;
        }

        destroy() {
            this._reset();
        }

        _isPrimitive(val) {
            if (typeof this.IS_PRIMITIVE !== "undefined") {
                return this.IS_PRIMITIVE;
            } else {
                if (
                    Object.prototype.toString.call(val) === "[object String]" ||
                    Object.prototype.toString.call(val) === "[object Number]"
                ) {
                    this.IS_PRIMITIVE = true;
                } else {
                    this.IS_PRIMITIVE = false;
                }
                return this.IS_PRIMITIVE;
            }
        }

        _reset() {
            for (var id in this._objects) {
                delete this._objects[id]._disjointSetId;
            }
            this._objects = {};
            this._relations = {};
            this._size = {};
            this._lastId = 0;
        }
    },
    /**
     * Priority queue implementation from:
     * https://github.com/mourner/tinyqueue
     */
    pqueue: {
        TinyQueue: class {
            constructor(data = [], compare = gjs.pqueue.defaultCompare) {
                this.data = data;
                this.length = this.data.length;
                this.compare = compare;

                if (this.length > 0) {
                    for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
                }
            }

            push(item) {
                this.data.push(item);
                this._up(this.length++);
            }

            pop() {
                if (this.length === 0) return undefined;

                const top = this.data[0];
                const bottom = this.data.pop();

                if (--this.length > 0) {
                    this.data[0] = bottom;
                    this._down(0);
                }

                return top;
            }

            peek() {
                return this.data[0];
            }

            _up(pos) {
                const { data, compare } = this;
                const item = data[pos];

                while (pos > 0) {
                    const parent = (pos - 1) >> 1;
                    const current = data[parent];
                    if (compare(item, current) >= 0) break;
                    data[pos] = current;
                    pos = parent;
                }

                data[pos] = item;
            }

            _down(pos) {
                const { data, compare } = this;
                const halfLength = this.length >> 1;
                const item = data[pos];

                while (pos < halfLength) {
                    let bestChild = (pos << 1) + 1; // initially it is the left child
                    const right = bestChild + 1;

                    if (right < this.length && compare(data[right], data[bestChild]) < 0) {
                        bestChild = right;
                    }
                    if (compare(data[bestChild], item) >= 0) break;

                    data[pos] = data[bestChild];
                    pos = bestChild;
                }

                data[pos] = item;
            }
        },
        defaultCompare: (a, b) => {
            return a < b ? -1 : a > b ? 1 : 0;
        },
    },
};
