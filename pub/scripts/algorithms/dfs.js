const dfs = async (graph, source) => {
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

    await sleep(500);

    const styledVertices = graph.styledVertices.dfs;
    while (stack.length > 0) {
        const [vertex, vertexInfo] = stack.pop();

        for (const neighbour of vertexInfo[0].keys()) {
            const neighbourInfo = adjList.get(neighbour);
            styledVertices.push([vertex, vertexInfo]);

            vertexInfo[0].get(neighbour)[1].edgeColor = "red";
            graph.redrawAll();
            await sleep(500);

            if (neighbourInfo[neighbourInfo.length - 1] === "visited" || neighbourInfo[neighbourInfo.length - 1] === "explored") {
                continue;
            }

            stack.push([neighbour, neighbourInfo]);
        }

        vertexInfo[3].vertexColor = "blue";
        graph.redrawAll();
        await sleep(100);
        vertexInfo[vertexInfo.length - 1] = "explored";
    }

    graph.adjList.forEach((v, k) => v[4] = "");
}
