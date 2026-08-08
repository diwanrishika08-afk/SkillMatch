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


// ===========================
// MIDDLEWARE
// ===========================

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(async (req, res, next) => {

    try {

        await connectDB();

        next();

    }

    catch (error) {

        res.status(500).json({

            message: "Database connection failed"

        });

    }

});

// ===========================
// ROUTES
// ===========================

app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/messages", messageRoutes);


// ===========================
// HOME ROUTE
// ===========================

app.get("/", (req, res) => {

    res.send("SkillMatch Backend Running 🚀");

});


// ===========================
// MONGODB CONNECTION
// ===========================

let isConnected = false;

async function connectDB() {

    if (isConnected) {
        return;
    }

    try {

        console.log("Connecting to MongoDB...");

        await mongoose.connect(
            process.env.MONGO_URI
        );

        isConnected = true;

        console.log("✅ MongoDB Connected");

    }

    catch (error) {

        console.error(
            "❌ MongoDB Connection Error"
        );

        console.error(error);

        throw error;

    }

}


// ===========================
// VERCEL HANDLER
// ===========================



// ===========================
// EXPORT APP
// ===========================

module.exports = app;


// ===========================
// LOCAL DEVELOPMENT
// ===========================

if (require.main === module) {

    const PORT =
        process.env.PORT || 5000;

    connectDB()
        .then(() => {

            app.listen(
                PORT,
                () => {

                    console.log(
                        `🚀 Server running on http://localhost:${PORT}`
                    );

                }
            );

        })
        .catch(error => {

            console.error(
                "❌ Failed to start server"
            );

            console.error(error);

        });

}