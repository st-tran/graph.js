const bfs = async (graph, source) => {
    const queue = new Queue();
    const adjList = graph.adjList;

    if (adjList.has(source)) {
        queue.enqueue([source, adjList.get(source)]);
        queue.peek()[1].push("visited");
        g.redrawAll();
    } else {
        throw `Cannot perform BFS on graph ${source} because ${source} is not in the graph.`;
    }

    await sleep(500);

    while (!queue.isEmpty()) {
        const [, vertexInfo] = queue.dequeue();
        vertexInfo[3].edgeColor = "blue";
        for (const neighbour of vertexInfo[0].keys()) {
            const neighbourInfo = adjList.get(neighbour);
                queue.enqueue([neighbour, neighbourInfo]);
                queue.peek()[1][3].vertexBorderColor = "blue";
                g.redrawAll();
                await sleep(500);
        }
        vertexInfo[3].edgeColor = "black";

        if (vertexInfo.length == 4) {
            vertexInfo.push("explored");
        } else {
            vertexInfo[vertexInfo.length - 1] = "explored";
        }
    }
};
