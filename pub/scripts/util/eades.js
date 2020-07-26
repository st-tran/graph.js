/**
 * Used:
 *  - https://i11www.iti.kit.edu/_media/teaching/winter2016/graphvis/graphvis-ws16-v6.pdf
 *  - http://cs.brown.edu/people/rtamassi/gdhandbook/chapters/force-directed.pdf
 * as references for force-directed graph drawing.
 */

"use strict";

const cSpring = 2; // Spring constant
const cRepul = 1; // Repulsion constant
const cDispl = 0.1; // Displacement constant
const iterations = 100; // Number of iterations to run Eades' algorithm for

/**
 * Unit vector pointing from u to v
 */
const unit_vec = (uPos, vPos) => {
    const vec = [vPos[0] - uPos[0], vPos[1] - uPos[1]];
    return vec.map((comp) => {
        return comp / Math.sqrt(Math.pow(vec[0], 2) + Math.pow(vec[1], 2));
    });
};

/**
 * Squared Euclidean distance between u and v
 */
const squared_eucl_dist = (uPos, vPos) => {
    return Math.pow(uPos[0] - vPos[1], 2) + Math.pow(uPos[1] - vPos[1], 2);
};

/**
 * Repulsive force between non-adjacent nodes u, v
 */
const f_repul = (adjList, u, v) => {
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
};

/**
 * Spring/attractive force between adjacent vertices u, v
 */
const f_spring = (adjList, u, v) => {
    const uPos = adjList.get(u).slice(1);
    const vPos = adjList.get(v).slice(1);
    const coef =
        cSpring * Math.log10(Math.sqrt(squared_eucl_dist(vPos, uPos)) / adjList.get(v)[0].get(u));
    return unit_vec(vPos, uPos).map((comp) => {
        return coef * comp;
    });
};

/**
 * Displacement vector for vertex v
 */
const vec_displ = (adjList, v) => {
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
};

/**
 * Eades force-directed graph layout adjustment algorithm
 */
const eades = (adjList) => {
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
        console.log(JSON.stringify(Array.from(adjList.entries())))
    }
};
