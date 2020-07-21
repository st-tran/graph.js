"use strict";

const drawEdge = (weight, sourcePos, targetPos, canvasCtx, options) => {
    options = options || {
        edgeWidth: 3,
        edgeColor: 'black',
    };

    canvasCtx.strokeColor = options.edgeColor;
    canvasCtx.lineWidth = options.edgeWidth;

    canvasCtx.beginPath();
    canvasCtx.moveTo(...sourcePos);
    canvasCtx.lineTo(...targetPos);
    canvasCtx.closePath();
    canvasCtx.stroke();

    canvasCtx.fillText(weight, (sourcePos[0] + targetPos[0])/2+5, (sourcePos[1] + targetPos[1])/2+5);
    // TODO: See how rotated edge weight labels looks on a dense graph.
    // canvasCtx.save();
    // canvasCtx.translate((sourcePos[0] + targetPos[0])/2, (sourcePos[1] + targetPos[1])/2);
    // canvasCtx.rotate(-Math.PI / 4);
    // canvasCtx.fillText(weight, 5, 5);
    // canvasCtx.restore();
};

const drawVertex = (name, center, canvasCtx, options) => {
    options = options || {
        vertexRadius: 20,
        vertexFillColor: 'white',
        vertexTextColor: 'black',
        vertexTextFont: "20px Arial",
        vertexBorderColor: 'black',
        vertexBorderWidth: 3,
    };

    canvasCtx.strokeColor = options.vertexBorderColor;
    canvasCtx.lineWidth = options.vertexBorderWidth;
    canvasCtx.fillStyle = options.vertexFillColor;

    canvasCtx.beginPath();
    canvasCtx.arc(...center, options.vertexRadius, 0, 2*Math.PI, true);
    canvasCtx.closePath();
    canvasCtx.stroke();
    canvasCtx.fill();

    canvasCtx.fillStyle = options.vertexTextColor;
    canvasCtx.textAlign = "center";
    canvasCtx.textBaseline = "middle";
    canvasCtx.font = options.vertexTextFont;

    canvasCtx.fillText(name, ...center);
};

