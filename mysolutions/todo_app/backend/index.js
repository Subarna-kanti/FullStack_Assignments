// const { error } = require("console");
const express = require("express");
const app = express();
const PORT = 3000;
const USERS_FILE = "users.json";
const fs = require("fs");
const { z } = require("zod");
const crypto = require("crypto");
const SECRET_KEY = crypto.randomBytes(32).toString("hex");
const jwt = require("jsonwebtoken");
const cors = require("cors");


function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function generateToken(username) {
    const payload = { id: username, type: "signin" };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
};

if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({}, null, 2));
};

let users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));

const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})

const signinSchema = z.object({
    username: z.string(),
    password: z.string(),
});

app.use(express.json());
app.use(cors());
app.use(express.static("../frontend"));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/signup", (req, res) => {
    const validation = signupSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
    }

    const { username, password } = req.body;

    if (username in users) {
        return res.status(409).json({ error: "User already existed" });
    }

    users[username] = { password: password };
    saveUsers(users);
    res.send("Succussfully Registerd");
})

app.post("/signin", (req, res) => {
    const validation = signinSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
    };

    const { username, password } = req.body;

    if (username in users) {
        if (users[username]["password"] !== password) {
            return res.status(403).json({ error: "Invalid Credentials" });
        };
        token = generateToken(username);
        users[username]["token"] = token;
        saveUsers(users);
        return res.status(200).json({
            "messsage": "Successfully Logged In",
            "token": token
        });
    };
    return res.status(403).json({ error: "Invalid Credentials" });
})

app.post("/logout", (req, res) => {
    const { username } = req.body;
    const token = req.headers["token"];

    delete users[username].token;
    saveUsers(users);
    return res.status(200).json({
        message: "Succefully Logged out"
    });
})

function authorize(req, res, next) {
    const token = req.headers["authorization"];
    jwt.verify(token, SECRET_KEY, (error, decoded) => {
        if (error) {
            return res.status(401).json({ err: "Unauthorized" });
        }
        else {
            req.user = decoded;
            next();
        };
    })
}

app.get("/me", authorize, (req, res) => {
    console.log(SECRET_KEY);
    const user = req.user;
    return res.send({ username: user.id });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});