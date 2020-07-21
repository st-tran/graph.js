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
    e: { f: 6 },
};

/**
 * A mathematical graph with edges and vertices represented by an adjacency
 * list using a nested Map.
 *
 * Structure:
 * adjList := {
 *      vertexName: [Map<connected edge name, connected edge weight>, x, y],
 *      ...
 * }
 * where x, y represent the position of vertexName on a Cartesian plane.
 */
class Graph {
    constructor() {
        this.adjList = new Map();
        this.stable = false;
        this.activeNode = undefined;
    }

    createNewVertex(vertexName) {
        this.adjList.set(vertexName, [
            new Map(),
            Math.floor(Math.random() * 800),
            Math.floor(Math.random() * 800),
        ]);
    }
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

    drawAll(canvas) {
        for (let [source, [targets, x, y]] of this.adjList.entries()) {
            if (x < 0) {
                this.adjList.get(source)[1] = 0;
                x = 0;
            } else if (x > 800) {
                this.adjList.get(source)[1] = 760;
            }
            if (y < 0) {
                this.adjList.get(source)[2] = 0;
            } else if (y > 800) {
                this.adjList.get(source)[2] = 760;
            }
            for (const [target, weight] of targets.entries()) {
                drawEdge(weight, [x, y], this.adjList.get(target).slice(1), canvas);
            }
        }
        for (const source of this.adjList.keys()) {
            drawVertex(source, this.adjList.get(source).slice(1), canvas);
        }
    }

    drawToCanvas(canvas) {
        if (!this.stable) {
            eades(this.adjList);
            this.stable = true;
            this.drawAll(canvas);
        } else {
            this.drawAll(canvas);
        }
    }

    selectActiveNode(position) {
        const matching = Array.from(this.adjList.entries()).filter(([vertex, vertexList]) => {
            const vertexPosition = vertexList.slice(1);
            return (
                vertexPosition[0] - 20 <= position[0] &&
                position[0] <= vertexPosition[0] + 20 &&
                vertexPosition[1] - 20 <= position[1] &&
                position[1] <= vertexPosition[1] + 20
            );
        });
        this.activeNode = matching[0];
    }

    moveNode(position) {
        if (this.activeNode !== undefined) {
            this.activeNode[1][1] = position[0];
            this.activeNode[1][2] = position[1];
        }
    }

    deselectActiveNode() {
        this.activeNode = undefined;
    }
}
