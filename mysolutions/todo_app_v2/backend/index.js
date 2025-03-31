const express = require("express");
const { connectDB, UserModel, TodoModel } = require("./db")
const { signinSchema, signupSchema, generateToken, authorize } = require("./authorize")
const bcrypt = require("bcrypt");
const app = express();
connectDB();

app.use(express.json());

app.post("/signup", async function (req, res) {
    try {
        const validation = signupSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        }

        const { username, password, email } = req.body;

        try {
            await UserModel.create({
                username: username,
                password: password,
                email: email,
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({ "error": "Username already created" });
            }
        }

        res.status(200).json({ "message": "Account Created" });
    } catch (error) {
        console.error("Error creating ToDo:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.post("/signin", async function (req, res) {
    try {
        const validation = signinSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors });
        };

        // Find user by username
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials!" });
        }

        // Compare provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials!" });
        }

        const jwt_token = generateToken(user._id);
        res.status(200).json({ message: "Login successful!", "token": jwt_token });
    } catch (error) {
        console.error("Error creating ToDo:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.use(authorize);

app.post("/create_todo", async function (req, res) {
    try {
        const userid = req.user_id;
        const { title, description, dueDate } = req.body;

        newTodo = { userId: userid, title: title, description: description };
        if (dueDate) newTodo.dueDate = dueDate;

        await TodoModel.create(newTodo);
        res.json({ "message": "Successfully created the ToDo" })
    } catch (error) {
        console.error("Error creating ToDo:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.put("/update_todo", async function (req, res) {
    try {
        const { todo_id, title, description, done } = req.body;
        const updated_data = {};
        if (title) updated_data.title = title;
        if (description) updated_data.description = description;
        if (done) updated_data.done = done;

        const updatedTodo = await TodoModel.findByIdAndUpdate(todo_id, updated_data, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({ success: false, message: "Todo not found" });
        };
        res.status(200).json({ success: true, message: "ToDo Updated Successfully", todo: updatedTodo });
    } catch (error) {
        console.error("Error creating ToDo:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
})

app.delete("/delete_todo", async function (req, res) {
    try {
        const { todo_id } = req.body;

        if (!todo_id) {
            return res.status(400).json({ success: false, message: "Todo ID is required" });
        }

        const deletedTodo = await TodoModel.findByIdAndDelete(todo_id);

        if (!deletedTodo) {
            return res.status(404).json({ success: false, message: "Todo not found" });
        };

        res.status(200).json({ success: true, message: "Todo deleted successfully" });
    } catch (error) {
        console.error("Error creating ToDo:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
})

app.get("/todos", async function (req, res) {
    try {
        const userId = req.user_id;
        const todos = await TodoModel.find({ userId });
        res.status(200).json({ success: true, todos });
    } catch (error) {
        console.error("Error creating ToDo:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));