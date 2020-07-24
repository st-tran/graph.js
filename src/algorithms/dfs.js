const dfs = async (graph, source) => {
    const stack = [];
    const adjList = graph.adjList;

    if (adjList.has(source)) {
        stack.push([source, adjList.get(source)]);
        stack[stack.length - 1][1].push("visited");
        g.redrawAll();
    } else {
        throw `Cannot perform DFS on graph ${source} because ${source} is not in the graph.`;
    }

    await sleep(500);

    while (stack.length > 0) {
        const [vertex, vertexInfo] = stack.pop();
        console.log(`Exploring ${vertex}`)
        vertexInfo[3].edgeColor = "red";

        for (const neighbour of vertexInfo[0].keys()) {
            const neighbourInfo = adjList.get(neighbour);

            if (neighbourInfo[neighbourInfo.length - 1] === "visited" || neighbourInfo[neighbourInfo.length - 1] === "explored") {
                continue;
            }

            stack.push([neighbour, neighbourInfo]);
            stack[stack.length - 1][1][3].vertexBorderColor = "blue";
            g.redrawAll();
            await sleep(500);
        }
        //vertexInfo[3].edgeColor = "black";
        g.redrawAll();

        if (vertexInfo.length == 4) {
            vertexInfo.push("explored");
        } else {
            vertexInfo[vertexInfo.length - 1] = "explored";
        }
    }
}
