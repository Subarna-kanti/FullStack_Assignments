const express = require("express");
const app = express();

function logEvents(req, res, next) {
    const timestamp = new Date().toISOString();
    console.log("Logging Events")
    console.log(`${req.method} ${req.originalUrl} - ${timestamp}`);
    next()
};

app.get("/", logEvents, (req, res) => {
    res.status(200).json({ msg: "Hello World" });
});

app.listen(3000);