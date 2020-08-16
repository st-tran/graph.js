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

    const mstGraphCanvas = document.getElementById("mst-graph");
    const mstGraphCtx = mstGraphCanvas.getContext("2d");
    const mstGraphControls = document.getElementById("mst-graph-controls");

    mstGraph = new Graph(mstGraphCtx, {}, "MST Example");
    mstGraph.populateAdjListFromJSObject(mstExample);
    mstGraph.addControls(mstGraphControls);
    mstGraph.addAlgorithms(["MSTPRIM"]);
    mstGraph.drawToCanvas();

    const ldgGraphCanvas = document.getElementById("ldg-graph");
    const ldgGraphCtx = ldgGraphCanvas.getContext("2d");
    const ldgGraphControls = document.getElementById("ldg-graph-controls");

    ldgGraph = new Graph(ldgGraphCtx, {}, "Absolutely Massive Disease Graph Example");
    ldgGraph.populateAdjListFromJSObject(largeDiseaseGraph);
    ldgGraph.addControls(ldgGraphControls);
    ldgGraph.addAlgorithms(["BFS", "DFS", "MSTPRIM"]);
    ldgGraph.drawToCanvas();
};
