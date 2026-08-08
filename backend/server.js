const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"])

require("dotenv").config();
console.log(process.env.MONGO_URI);
const userRoutes = require("./routes/UserRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const messageRoutes = require("./routes/messageRoutes");
const app = express();

app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/messages", messageRoutes);


app.get("/", (req, res) => {
    res.send("SkillMatch Backend Running 🚀");
});


async function startServer() {
    try {
        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI);
        const User = require("./models/User");

        console.log("User Model Loaded:", User.modelName);

        console.log("✅ MongoDB Connected");

        app.listen(process.env.PORT, () => {
            console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
        });

    } catch (error) {
        console.error("❌ MongoDB Error");
        console.error(error);
    }
}

startServer();