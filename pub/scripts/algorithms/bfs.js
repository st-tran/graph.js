const bfs = async (graph, source) => {
    console.log("bfs start")
    const queue = new Queue();
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

    await sleep(500);

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
            await sleep(500);

            if (neighbourInfo[neighbourInfo.length - 1] === "visited" || neighbourInfo[neighbourInfo.length - 1] === "explored") {
                continue;
            }
            queue.enqueue([neighbour, neighbourInfo]);
        }

        vertexInfo[vertexInfo.length - 1] = "explored";
    }

    graph.adjList.forEach((v) => v[4] = "");
};
