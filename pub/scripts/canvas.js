"use strict";

const drawEdge = (weight, sourcePos, targetPos, canvasCtx, mousePos, options) => {
    options = options || {
        edgeWidth: 3,
        edgeColor: "black",
        directed: false,
    };

    canvasCtx.strokeStyle = options.edgeColor;
    canvasCtx.lineWidth = options.edgeWidth;
    canvasCtx.lineCap = "round";

    canvasCtx.beginPath();
    canvasCtx.moveTo(...sourcePos);

    const dx = targetPos[0] - sourcePos[0];
    const dy = targetPos[1] - sourcePos[1];
    const angle = Math.atan2(dy, dx);

    if (options.directed) {
        const tPosCopy = [...targetPos];

        tPosCopy[0] -= 20 * Math.cos(angle);
        tPosCopy[1] -= 20 * Math.sin(angle);
        canvasCtx.lineTo(...tPosCopy);
        canvasCtx.lineTo(
            tPosCopy[0] - 10 * Math.cos(angle - Math.PI / 6),
            tPosCopy[1] - 10 * Math.sin(angle - Math.PI / 6)
        );
        canvasCtx.lineTo(...tPosCopy);
        canvasCtx.lineTo(
            tPosCopy[0] - 10 * Math.cos(angle + Math.PI / 6),
            tPosCopy[1] - 10 * Math.sin(angle + Math.PI / 6)
        );
        canvasCtx.moveTo(...tPosCopy);
    } else {
        canvasCtx.lineTo(...targetPos);
    }

    canvasCtx.closePath();
    canvasCtx.stroke();

    if (
        mousePos.every(
            (v, i) => Math.abs(sourcePos[i] - v) <= 10 || Math.abs(targetPos[i] - v) <= 10
        )
    ) {
        canvasCtx.fillStyle = options.textColor;
        canvasCtx.font = options.textFont;
        canvasCtx.textAlign = "center";
        canvasCtx.textBaseline = "middle";

        canvasCtx.save();
        canvasCtx.translate(
            (sourcePos[0] + targetPos[0]) / 2 + 10 * Math.sin(angle),
            (sourcePos[1] + targetPos[1]) / 2 + 10 * Math.cos(angle)
        );
        if (dx < 0) {
            canvasCtx.rotate(angle - Math.PI);
        } else {
            canvasCtx.rotate(angle);
        }
        canvasCtx.fillText(weight, 5, 5);
        canvasCtx.restore();
    }
};

const drawVertex = (name, center, canvasCtx, mousePos, options) => {
    options = options || {
        vertexRadius: 20,
        vertexFillColor: "white",
        textColor: "black",
        textFont: "20px Arial",
        vertexBorderColor: "black",
        vertexBorderWidth: 3,
    };

    canvasCtx.strokeStyle = options.vertexBorderColor;
    canvasCtx.lineWidth = options.vertexBorderWidth;
    canvasCtx.fillStyle = options.vertexFillColor;

    const mouseInVertex = center.every((v, i) => Math.abs(mousePos[i] - v) <= options.vertexRadius);

    canvasCtx.beginPath();
    canvasCtx.arc(...center, mouseInVertex ? options.vertexRadius : 10, 0, 2 * Math.PI, true);
    canvasCtx.closePath();
    canvasCtx.stroke();
    canvasCtx.fill();

    canvasCtx.fillStyle = options.textColor;
    canvasCtx.textAlign = "center";
    canvasCtx.textBaseline = "middle";
    canvasCtx.font = mouseInVertex ? options.textFont : "12px Arial";

    canvasCtx.fillText(name, ...center);
};
