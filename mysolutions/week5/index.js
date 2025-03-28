const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");

const app = express();
const PORT = 3000;

const SECRET_KEY = "f9a8d4e6b7c3a2f1d5e6c7b8a9f0e1d2a3b4c5d6e7f8g9h0";
const USERS_FILE = "users.json";

// Load users from file (Persistent Storage)
let users = {};

if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({}, null, 2)); // Create empty JSON file
}

if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

// Function to save users to file
function saveUsers() {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Zod validation schemas
const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

const signinSchema = z.object({
    username: z.string(),
    password: z.string(),
});

// Token generator function
function generateToken(username) {
    const payload = { id: username, type: "signup" };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); // 1-hour expiry
}

app.use(express.json());

// Sign Up Route
app.post("/signing_up", (req, res) => {
    const validation = signupSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
    }

    const { username, password } = req.body;

    if (users[username]) {
        return res.status(400).json({ error: "Username already exists" });
    }

    users[username] = { password };
    saveUsers(); // Save to file

    res.status(201).json({ msg: "Account Created Successfully" });
});

// Sign In Route
app.post("/signing_in", (req, res) => {
    const validation = signinSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
    }

    const { username, password } = req.body;

    if (!users[username]) {
        return res.status(404).json({ error: "Username not found" });
    }

    if (users[username].password !== password) {
        return res.status(403).json({ error: "Incorrect password" });
    }

    const token = generateToken(username);
    users[username].token = token;
    saveUsers(); // Save token to file

    res.status(200).json({ token });
});

function isLogged(req, res, next) {
    const { username, token } = req.body;
    if (!(username in users)) {
        return res.status(403).json({ error: "Username not exist" });
    };

    if (users[username]["token"] !== token) {
        return res.status(403).json({ error: "Invalid Token" });
    };

    next();
};

app.post("/get_data", isLogged, (req, res) => {
    const { username, token } = req.body;
    return res.status(200).json({ token });
});

function authorize(req, res, next) {
    const token = req.headers["token"];
    console.log(token)

    jwt.verify(token, SECRET_KEY, (error, decoded) => {
        if (error) {
            res.status(401).send({ msg: "Unauthorized" });
        }
        else {
            req.user = decoded;
            next()
        };
    });
}

app.get("/get_username", authorize, (req, res) => {
    const user = req.user;
    console.log(user);
    res.send({username: user.id})
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
