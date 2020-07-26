const bfs = async (graph, source) => {
    const queue = new Queue();
    const adjList = graph.adjList;

    if (adjList.has(source)) {
        queue.enqueue([source, adjList.get(source)]);
        queue.peek()[1].push("visited");
        graph.redrawAll();
    } else {
        throw `Cannot perform BFS on graph ${source} because ${source} is not in the graph.`;
    }

    await sleep(500);

    while (!queue.isEmpty()) {
        const [, vertexInfo] = queue.dequeue();
        vertexInfo[3].edgeColor = "red";
        for (const neighbour of vertexInfo[0].keys()) {
            const neighbourInfo = adjList.get(neighbour);
            neighbourInfo[3].edgeColor = "red";
            if ( neighbourInfo[neighbourInfo.length - 1] === "visited" || neighbourInfo[neighbourInfo.length - 1] === "explored") {
                continue;
            }
            queue.enqueue([neighbour, neighbourInfo]);
            queue.peek()[1][3].vertexBorderColor = "blue";
            graph.redrawAll();
            await sleep(500);
        }

        if (vertexInfo.length == 4) {
            vertexInfo.push("explored");
        } else {
            vertexInfo[vertexInfo.length - 1] = "explored";
        }
    }
};
