const express = require("express");
const app = express();

function isValidAge(req, res, next) {
    const age = req.query.age;
    if (age >= 15) {
        next();
    }
    else {
        res.json({
            msg: "Cannot Proceed Further"
        })
    }
};

app.use(isValidAge)

app.get("/ride1", function (req, res) {
    res.json({
        msg: "Completed ride1"
    })
});

app.get("/ride2", function (req, res) {
    res.json({
        msg: "Completed ride2"
    })
});

app.listen(3000);