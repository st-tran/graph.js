let mainDiv;
let header;
let mainHeight;

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
};

window.onresize = () => {
    mainHeight = mainDiv.offsetHeight;
};

window.onscroll = () => {
    console.log(window.scrollY, mainHeight)
    if (window.scrollY > mainHeight) {
        header.style.visibility = "visible";
    } else {
        header.style.visibility = "hidden";
    }
};
