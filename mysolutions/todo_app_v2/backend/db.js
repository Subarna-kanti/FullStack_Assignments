const mongoose = require("mongoose");
const { Schema, Types } = mongoose; // Import Schema and Types
const bcrypt = require("bcrypt");

require("dotenv").config(); // Load environment variables
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        process.exit(1); // Stop the server if DB connection fails
    }
};


const UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
});

const TodoSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" }, // Default empty string for consistency
    done: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }, // Automatically set when the todo is created
    dueDate: Date,
    userId: { type: Types.ObjectId, ref: "User", required: true }, // Correct ObjectId reference
});


// Hash password before saving
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // Skip if password is unchanged

    try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        this.password = await bcrypt.hash(this.password, salt); // Hash password
        next();
    } catch (error) {
        next(error);
    }
});

// Define models with singular names (MongoDB auto-pluralizes them)
const UserModel = mongoose.model("User", UserSchema);
const TodoModel = mongoose.model("Todo", TodoSchema);

module.exports = { connectDB, UserModel, TodoModel };
