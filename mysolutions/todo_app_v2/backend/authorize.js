const { z } = require("zod");
const jwt = require("jsonwebtoken");

const signupSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.string().min(6, "Email must be at least 6 characters long")
})

const signinSchema = z.object({
    username: z.string(),
    password: z.string(),
});

function generateSecretKey() {
    const crypto = require("crypto");
    const SECRET_KEY = crypto.randomBytes(32).toString("hex");
    return SECRET_KEY;
}

const SECRET_KEY = generateSecretKey();

function generateToken(username) {
    const payload = { id: username, type: "signin" };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

function authorize(req, res, next) {
    const token = req.headers["authorization"];
    jwt.verify(token, SECRET_KEY, (error, decoded) => {
        if (error) {
            return res.status(401).json({ err: "Unauthorized" });
        }
        else {
            req.user_id = decoded.id;
            next();
        };
    })
}


module.exports = {
    signupSchema,
    signinSchema,
    generateToken,
    authorize
}