const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = router;
router.post("/signup", async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            college,
            skills,
            interests,
            experience
        } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            college,
            skills,
            interests,
            experience
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