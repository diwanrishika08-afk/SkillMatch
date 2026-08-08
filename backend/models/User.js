const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    college: {
        type: String,
        default: ""
    },

    skills: {
        type: [String],
        default: []
    },

    interests: {
        type: [String],
        default: []
    },

    experience: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        default: "Beginner"
    },

    bio: {
        type: String,
        default: ""
    },

    // Incoming connection requests
    connectionRequests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    // Accepted connections
    connections: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]

},
{
    timestamps: true
}
);

module.exports = mongoose.model("User", userSchema);