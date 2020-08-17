const mstprim = async (graph, source) => {
    if (!graph.styledVertices.hasOwnProperty("mstprim")) {
        graph.styledVertices.mstprim = [];
    }

    graph.currentAlgorithm = "mstprim";
    graph.isAlgorithmRunning = true;

    graph.adjList.forEach((v) => (v[4] = [Infinity, null]));

    const edges = [];
    const p_queue = new TinyQueue([], (e1, e2) => e1[2] - e2[2]);
    const root = graph.adjList.keys().next().value;

    Array.from(graph.adjList.get(root)[0]).forEach((v) => p_queue.push([root, v[0], v[1][0]]));
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
            graph.adjList.get(edge[0])[0].get(edge[1])[1].edgeColor = "red";
            await sleep(100);
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
};
