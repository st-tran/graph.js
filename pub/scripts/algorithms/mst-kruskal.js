const mstkruskal = async (graph, source) => {
    if (!graph.styledVertices.hasOwnProperty("mstkruskal")) {
        graph.styledVertices.mstkruskal = [];
    }

    graph.currentAlgorithm = "mstkruskal";
    graph.isAlgorithmRunning = true;

    let turnedDirected = graph.options.directed;
    if (turnedDirected) {
        graph.options.directed = false;
    }

    const ds = disjointSet();
    const edges = Array.from(graph.adjList).reduce((a, v) => {
        ds.add(v[1]);

        Array.from(v[1][0].entries()).forEach((v2) => a.push([v[0], v2[0], v2[1][0]]));

        return a;
    }, new TinyQueue([], (e1, e2) => e1[2] - e2[2]));

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

    graph.adjList.forEach((v) => {v[4] = ""; delete v[5]});
};
