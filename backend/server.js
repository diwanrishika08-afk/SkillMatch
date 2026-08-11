const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/UserRoutes");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();


// ==============================
// MIDDLEWARE
// ==============================

app.use(cors({
    origin: [
             "http://127.0.0.1:5500",
             "http://localhost:5500",
             "https://skillmatch102.netlify.app"
    ]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==============================
// ROUTES
// ==============================

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/messages", messageRoutes);


// ==============================
// HOME ROUTE
// ==============================

app.get("/", (req, res) => {
    res.send("SkillMatch Backend Running 🚀");
});


// ==============================
// START SERVER
// ==============================

async function startServer() {

    try {

        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI);

        const User = require("./models/User");

        console.log("User Model Loaded:", User.modelName);

        console.log("✅ MongoDB Connected");

        app.listen(process.env.PORT || 5000, () => {

            console.log(
                `🚀 Server running on http://localhost:${process.env.PORT || 5000}`
            );

        });

    } catch (error) {

        console.error("❌ MongoDB Error");
        console.error(error);

    }

}


// ==============================
// LOCAL SERVER START
// ==============================

if (require.main === module) {
    startServer();
}


// ==============================
// EXPORT APP
// ==============================

module.exports = app;