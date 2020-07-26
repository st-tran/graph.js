"use strict";
const express = require("express");
const path = require("path");
const app = express();

// Create static directory for files in ./pub
app.use("/", express.static(path.join(__dirname, "/pub")));

// Express routes
// Route for an HTTP GET request to the root of the app
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/pub/example.html"));
});


// Use environent variable process.env.PORT for deployment.
// Defaults to port 5000.
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);

    // For browser-refresh
    if (process.send) {
        process.send("online");
    }
});
