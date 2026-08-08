console.log("✅ AI Routes Loaded");

const express = require("express");
const router = express.Router();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

router.post("/chat", async (req, res) => {
    console.log("AI BODY:", req.body);

    try {

        const { message, profile } = req.body || {};

if (!message || !profile) {
    return res.status(400).json({
        message: "Message and profile are required."
    });
}

        const prompt = `
You are SkillMatch AI Mentor.

User Profile:
Name: ${profile.name}
Skills: ${profile.skills.join(", ")}
Interests: ${profile.interests.join(", ")}
Experience: ${profile.experience}
Bio: ${profile.bio}

User Question:
${message}

Give a helpful answer in a friendly tone.
If asked for projects, recommend suitable projects.
If asked for teammates, recommend complementary skills.
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
            contents: prompt
        });

        res.json({
            reply: response.text
        });

    } catch (error) {

    console.error("🔥 GEMINI ERROR:");
    console.error(error);

    res.status(500).json({
        message: "AI Error",
        error: error.message
    });

}


});
module.exports = router;