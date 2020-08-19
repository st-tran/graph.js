let mainDiv;
let header;
let mainHeight;
let about;
let examples;
let gettingStarted;

window.onload = () => {
    const mGraphCanvas = document.getElementById("main-graph");
    const mGraphCtx = mGraphCanvas.getContext("2d");

    const mainGraph = new gjs.Graph(
        mGraphCtx,
        { directed: false, edgeColor: "grey", edgeWidth: 1 },
        "graph.js main screen demo"
    );
    mainGraph.populateAdjListFromJSObject(mstExample);
    mainGraph.drawToCanvas();

    header = document.querySelector("header");
    mainDiv = document.querySelector(".main");
    mainHeight = mainDiv.offsetHeight;

    about = document.querySelector(".about");
    examples = document.querySelector(".examples");
    gettingStarted = document.querySelector(".getting-started");

    document.querySelector("#header-about").onclick = () => {
        console.log(about);
        window.scrollTo(0, about.offsetTop - 60);
    };

    document.querySelector("#header-examples").onclick = () => {
        console.log(about);
        window.scrollTo(0, examples.offsetTop - 60);
    };

    document.querySelector("#header-gettingstarted").onclick = () => {
        console.log(about);
        window.scrollTo(0, gettingStarted.offsetTop - 60);
    };

    const diseaseGraphCanvas = document.getElementById("disease-graph");
    const diseaseGraphCtx = diseaseGraphCanvas.getContext("2d");
    const diseaseGraphControls = document.getElementById("disease-graph-controls");

    const diseaseGraph = new gjs.Graph(diseaseGraphCtx, {}, "Disease Spread");
    diseaseGraph.populateAdjListFromJSObject(diseaseAdjacencyList);
    diseaseGraph.addControls(diseaseGraphControls);
    diseaseGraph.addAlgorithms(["BFS", "DFS"]);
    diseaseGraph.drawToCanvas();

    const treeGraphCanvas = document.getElementById("tree-graph");
    const treeGraphCtx = treeGraphCanvas.getContext("2d");
    const treeGraphControls = document.getElementById("tree-graph-controls");

    const treeGraph = new gjs.Graph(treeGraphCtx, {}, "Tree Example");
    treeGraph.populateAdjListFromJSObject(treeAdjacencyList);
    treeGraph.addControls(treeGraphControls);
    treeGraph.addAlgorithms(["BFS", "DFS"]);
    treeGraph.drawToCanvas();

    const mstGraphCanvas = document.getElementById("mst-graph");
    const mstGraphCtx = mstGraphCanvas.getContext("2d");
    const mstGraphControls = document.getElementById("mst-graph-controls");

    const mstGraph = new gjs.Graph(mstGraphCtx, {}, "MST Example");
    mstGraph.populateAdjListFromJSObject(mstExample);
    mstGraph.addControls(mstGraphControls);
    mstGraph.addAlgorithms(["MSTPRIM", "MSTKRUSKAL"]);
    mstGraph.drawToCanvas();

    const ldgGraphCanvas = document.getElementById("ldg-graph");
    const ldgGraphCtx = ldgGraphCanvas.getContext("2d");
    const ldgGraphControls = document.getElementById("ldg-graph-controls");

    const ldgGraph = new gjs.Graph(ldgGraphCtx, {}, "Absolutely Massive Disease Graph Example");
    ldgGraph.populateAdjListFromJSObject(largeDiseaseGraph);
    ldgGraph.addControls(ldgGraphControls);
    ldgGraph.addAlgorithms(["BFS", "DFS", "MSTPRIM", "MSTKRUSKAL"]);
    ldgGraph.drawToCanvas();
};

window.onresize = () => {
    mainHeight = mainDiv.offsetHeight;
};

window.onscroll = () => {
    if (header) {
        if (window.scrollY > mainHeight) {
            header.style.top = "0px";
        } else {
            header.style.top = "-45px";
        }
    }
};
