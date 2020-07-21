"use strict";

/**Maybe I will support different data types after the Alpha Release. For now,
 * JSON arrays and objects to represent adj. matrices and lists, respectively,
 * are hardcoded.
const exampleAdjacencyMatrix =
    "0, 1, 0, 6, 2, 3\n" +
    "1, 0, 7, 0, 5, 1\n" +
    "0, 7, 0, 0, 9, 0\n" +
    "6, 0, 0, 0, 0, 2\n" +
    "2, 5, 9, 0, 0, 3\n" +
    "3, 1, 0, 2, 3, 0";

const parseDataToGraph = (data) => {};

const parseAdjMatrixToGraph = (data) => {
    // Check that the data can be converted into an adjacency matrix
    const splitData = data.split("\n");
    if (
        !splitData.reduce((valid, line) => {
            return valid && /^()$/.test(line);
        }, false)
    ) {
        throw "Data cannot be recognized as an adjacency matrix.";
    }
};

const parseAdjListToGraph = (data) => {};
*/
