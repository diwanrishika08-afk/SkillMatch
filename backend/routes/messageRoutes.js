const express = require("express");

const router = express.Router();

const message = require("../models/message");
const User = require("../models/User");


// ========================================
// SEND MESSAGE
// ========================================

router.post("/send", async (req, res) => {

    try {

        const {
            senderId,
            receiverId,
            text
        } = req.body;


        if (!senderId || !receiverId || !text) {

            return res.status(400).json({

                message: "Sender, receiver and message are required."

            });

        }


        // Get both users

        const sender = await User.findById(senderId);

        const receiver = await User.findById(receiverId);


        if (!sender || !receiver) {

            return res.status(404).json({

                message: "User not found."

            });

        }


        // Check whether they are connected

        const connected = sender.connections.some(

            id => id.toString() === receiverId.toString()

        );


        if (!connected) {

            return res.status(403).json({

                message: "You can only chat with your connections."

            });

        }


        // Create message

        const message = new message({

            sender: senderId,

            receiver: receiverId,

            text: text

        });


        await message.save();


        res.status(201).json({

            message: "Message sent successfully.",

            data: message

        });


    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

});


// ========================================
// GET CHAT
// ========================================

router.get("/:userId/:otherUserId", async (req, res) => {

    try {

        const {
            userId,
            otherUserId
        } = req.params;


        const messages = await message.find({

            $or: [

                {
                    sender: userId,
                    receiver: otherUserId
                },

                {
                    sender: otherUserId,
                    receiver: userId
                }

            ]

        })

        .sort({

            createdAt: 1

        });


        res.status(200).json(messages);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

});


module.exports = router;