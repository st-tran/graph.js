let mainDiv;
let header;
let mainHeight;
let about;
let examples;
let gettingStarted;

window.onload = () => {
    const mGraphCanvas = document.getElementById("main-graph");
    const mGraphCtx = mGraphCanvas.getContext("2d");

    const mainGraph = new Graph(
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
        window.scrollTo(0, about.offsetTop - 60);
    };

    document.querySelector("#header-examples").onclick = () => {
        window.scrollTo(0, examples.offsetTop - 60);
    };

    document.querySelector("#header-gettingstarted").onclick = () => {
        window.scrollTo(0, gettingStarted.offsetTop - 60);
    };

    const diseaseGraphCanvas = document.getElementById("disease-graph");
    const diseaseGraphCtx = diseaseGraphCanvas.getContext("2d");
    const diseaseGraphControls = document.getElementById("disease-graph-controls");

    const diseaseGraph = new Graph(
        diseaseGraphCtx,
        { edgeColor: "#344a5e", activeColor: "green", vertexFillColor: "yellow" },
        "Disease Spread"
    );
    diseaseGraph.populateAdjListFromJSObject(diseaseAdjacencyList);
    diseaseGraph.addControls(diseaseGraphControls);
    diseaseGraph.addAlgorithms(["BFS", "DFS"]);
    diseaseGraph.drawToCanvas();

    const treeGraphCanvas = document.getElementById("tree-graph");
    const treeGraphCtx = treeGraphCanvas.getContext("2d");
    const treeGraphControls = document.getElementById("tree-graph-controls");

    const treeGraph = new Graph(
        treeGraphCtx,
        {
            edgeColor: "lightblue",
            activeColor: "blue",
            edgeWidth: 5,
            vertexBorderColor: "darkblue",
        },
        "Tree Example"
    );
    treeGraph.populateAdjListFromJSObject(treeAdjacencyList);
    treeGraph.addControls(treeGraphControls);
    treeGraph.addAlgorithms(["BFS", "DFS"]);
    treeGraph.drawToCanvas();

    const mstGraphCanvas = document.getElementById("mst-graph");
    const mstGraphCtx = mstGraphCanvas.getContext("2d");
    const mstGraphControls = document.getElementById("mst-graph-controls");

    const mstGraph = new Graph(
        mstGraphCtx,
        {
            vertexBorderColor: "#f200ff",
            edgeColor: "#f200ff",
            activeColor: "purple",
            edgeWidth: 5,
            textColor: "#f200ff",
        },
        "MST Example"
    );
    mstGraph.populateAdjListFromJSObject(mstExample);
    mstGraph.addControls(mstGraphControls);
    mstGraph.addAlgorithms(["MSTPRIM", "MSTKRUSKAL"]);
    mstGraph.drawToCanvas();

    const rpgGraphCanvas = document.getElementById("rpg-graph");
    const rpgGraphCtx = rpgGraphCanvas.getContext("2d");
    const rpgGraphControls = document.getElementById("rpg-graph-controls");

    const rpgGraph = new Graph(rpgGraphCtx, {}, "Randomly Placed Graph");
    rpgGraph.populateAdjListFromJSObject(randomlyPlacedGraph);
    rpgGraph.addControls(rpgGraphControls);
    rpgGraph.addAlgorithms(["BFS", "DFS", "MSTPRIM", "MSTKRUSKAL"]);
    rpgGraph.drawToCanvas();
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
