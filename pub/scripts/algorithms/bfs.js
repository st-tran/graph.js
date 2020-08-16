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

        graph.redrawAll();
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

            neighbourInfo[3].edgeColor = "red";
            if (neighbourInfo[neighbourInfo.length - 1] === "visited" || neighbourInfo[neighbourInfo.length - 1] === "explored") {
                continue;
            }
            queue.enqueue([neighbour, neighbourInfo]);
            queue.peek()[1][3].vertexBorderColor = "blue";
            graph.redrawAll();
            await sleep(500);
        }

        vertexInfo[vertexInfo.length - 1] = "explored";
    }

    graph.adjList.forEach((v, k) => v[4] = "");
};
