let diseaseGraph;
let treeGraph;
window.onload = () => {
    const diseaseGraphCanvas = document.getElementById("disease-graph");
    const diseaseGraphCtx = diseaseGraphCanvas.getContext("2d");
    const diseaseGraphControls = document.getElementById("disease-graph-controls");

    diseaseGraph = new Graph(diseaseGraphCtx, {}, "Disease Spread");
    diseaseGraph.populateAdjListFromJSObject(diseaseAdjacencyList);
    diseaseGraph.addControls(diseaseGraphControls);
    diseaseGraph.addAlgorithms(["BFS", "DFS"]);
    diseaseGraph.drawToCanvas();

    const treeGraphCanvas = document.getElementById("tree-graph");
    const treeGraphCtx = treeGraphCanvas.getContext("2d");
    const treeGraphControls = document.getElementById("tree-graph-controls");

    treeGraph = new Graph(treeGraphCtx, {}, "Tree Example");
    treeGraph.populateAdjListFromJSObject(treeAdjacencyList);
    treeGraph.addControls(treeGraphControls);
    treeGraph.addAlgorithms(["BFS", "DFS"]);
    treeGraph.drawToCanvas();
};
