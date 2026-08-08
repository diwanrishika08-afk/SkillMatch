const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ===========================
// GET ALL USERS
// ===========================

router.get("/", async (req, res) => {

    try {

        const users = await User.find();

        res.status(200).json(users);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Could not fetch users"
        });

    }

});

// ===========================
// CREATE PROFILE (OLD ROUTE)
// ===========================

router.post("/", async (req, res) => {

    try {

        const newUser = new User(req.body);

        await newUser.save();

        res.status(201).json({
            message: "Profile saved successfully!",
            user: newUser
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Could not save profile"
        });

    }

});

// ===========================
// SIGNUP
// ===========================

router.post("/signup", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "Email already exists"
            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({
            message: "Signup successful!"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

// ===========================
// LOGIN
// ===========================

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "User not found"
            });

        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid password"
            });

        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({

            message: "Login successful!",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

// ===========================
// UPDATE PROFILE
// ===========================

router.put("/profile/:id", async (req, res) => {

    try {

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

// ===========================
// SEND CONNECTION REQUEST
// ===========================

router.put("/connect", async (req, res) => {

    try {

        const { senderId, receiverId } = req.body;

        if (senderId === receiverId) {

            return res.status(400).json({
                message: "You cannot connect with yourself."
            });

        }

        const receiver = await User.findById(receiverId);

        if (!receiver) {

            return res.status(404).json({
                message: "Receiver not found."
            });

        }

        const alreadyRequested = receiver.connectionRequests.some(
            id => id.toString() === senderId
        );

        if (alreadyRequested) {

            return res.status(400).json({
                message: "Request already sent."
            });

        }

        receiver.connectionRequests.push(senderId);

        await receiver.save();

        res.status(200).json({
            message: "Connection request sent successfully!"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

// ===========================
// GET CONNECTION REQUESTS
// ===========================

router.get("/requests/:id", async (req, res) => {

    console.log("REQUEST ROUTE HIT");
    console.log("User ID:", req.params.id);

    try {

        const user = await User.findById(req.params.id)
            .populate(
                "connectionRequests",
                "name college skills interests experience"
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user.connectionRequests);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// ===========================
// TEST ROUTE
// ===========================

router.get("/test", (req, res) => {

    res.json({
        message: "UserRoutes is updated!"
    });

});

// ===========================
// GET SINGLE USER
// KEEP THIS LAST
// ===========================


// ===========================
// ACCEPT CONNECTION REQUEST
// ===========================

router.put("/accept", async (req, res) => {

    try {

        const { receiverId, senderId } = req.body;

        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        if (!receiver || !sender) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        // Remove request
        receiver.connectionRequests =
            receiver.connectionRequests.filter(
                id => id.toString() !== senderId
            );

        // Add connections
        if (!receiver.connections.includes(senderId)) {
            receiver.connections.push(senderId);
        }

        if (!sender.connections.includes(receiverId)) {
            sender.connections.push(receiverId);
        }

        await receiver.save();
        await sender.save();

        res.json({
            message: "Connection Accepted!"
        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
// ===========================
// REJECT CONNECTION REQUEST
// ===========================

router.put("/reject", async (req, res) => {

    try {

        const { receiverId, senderId } = req.body;

        const receiver = await User.findById(receiverId);

        if (!receiver) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        receiver.connectionRequests =
            receiver.connectionRequests.filter(
                id => id.toString() !== senderId
            );

        await receiver.save();

        res.json({
            message: "Request Rejected!"
        });

    }

    catch(error){

        console.error(error);

        res.status(500).json({
            message:"Server Error"
        });

    }

});
// ===========================
// GET MY CONNECTIONS
// ===========================

router.get("/connections/:id", async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .populate(
                "connections",
                "name college skills interests experience bio"
            );

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.status(200).json(user.connections);

    }

    catch(error){

        console.error(error);

        res.status(500).json({
            message:"Server Error"
        });

    }

});
router.get("/:id", async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.status(200).json(user);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});
module.exports = router;