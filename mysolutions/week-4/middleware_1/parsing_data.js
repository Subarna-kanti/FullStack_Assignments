const express = require("express");
const app = express();

app.use(express.json());

app.post("/data", (req, res) => {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: "Invalid Data" });
    };

    console.log("Received data:", JSON.stringify(data, null, 2));
    res.send("Data received")
});

app.listen(3000, () => {
    console.log("Server running on port 3000")
});