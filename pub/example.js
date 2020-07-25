window.onload = () => {
    const canvas = document.getElementById("graph");
    const ctx = canvas.getContext("2d");
    const controlContainer = document.getElementById("graphControls");

    const g = new Graph(ctx, {}, "Disease Spread");
    g.addControls(controlContainer);
    g.addAlgorithms(["BFS", "DFS"]);
    g.updateCanvasSize();
    g.drawToCanvas();
}
