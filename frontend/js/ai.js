const chatMessages = document.getElementById("chatMessages");

const messageInput = document.getElementById("messageInput");

const sendBtn = document.getElementById("sendBtn");

const typingIndicator = document.getElementById("typingIndicator");

const backBtn = document.getElementById("backBtn");


// ===========================
// GET LOGGED-IN USER
// ===========================

const storedUser = JSON.parse(
    localStorage.getItem("user")
);


// ===========================
// BACK BUTTON
// ===========================

backBtn.addEventListener("click", () => {

    window.location.href = "dashboard.html";

});


// ===========================
// SEND BUTTON
// ===========================

sendBtn.addEventListener("click", () => {

    sendMessage();

});


// ===========================
// ENTER KEY
// ===========================

messageInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        sendMessage();

    }

});


// ===========================
// SEND QUICK MESSAGE
// ===========================

function sendQuickMessage(message) {

    messageInput.value = message;

    sendMessage();

}


// ===========================
// SEND MESSAGE
// ===========================

async function sendMessage() {

    const message = messageInput.value.trim();

    if (!message) {

        return;

    }


    // Show user message

    addMessage(
        message,
        "user"
    );


    messageInput.value = "";

    typingIndicator.classList.remove("hidden");


    try {

        // Get latest profile

        const profileResponse = await fetch(

            `http://localhost:5000/api/users/${storedUser.id}`

        );


        if (!profileResponse.ok) {

            throw new Error("Could not load user profile.");

        }


        const profile = await profileResponse.json();


        // Send to AI

        const response = await fetch(

            "http://localhost:5000/api/ai/chat",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    message: message,

                    profile: {

                        name: profile.name || "Student",

                        skills: Array.isArray(profile.skills)
                            ? profile.skills
                            : [],

                        interests: Array.isArray(profile.interests)
                            ? profile.interests
                            : [],

                        experience: profile.experience || "Beginner",

                        bio: profile.bio || ""

                    }

                })

            }

        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                data.message ||
                "AI request failed."
            );

        }


        // Hide typing

        typingIndicator.classList.add("hidden");


        // Show AI response

        addMessage(

            data.reply,

            "ai"

        );


    }

    catch (error) {

        console.error(error);

        typingIndicator.classList.add("hidden");

        addMessage(

            "Sorry 😕 I couldn't connect to the AI right now. Please try again.",

            "ai"

        );

    }

}


// ===========================
// ADD MESSAGE
// ===========================

function addMessage(text, type) {

    const messageDiv = document.createElement("div");

    messageDiv.classList.add(
        "message",
        type === "ai"
            ? "ai-message"
            : "user-message"
    );


    if (type === "ai") {

        messageDiv.innerHTML = `

            <div class="avatar">
                🤖
            </div>

            <div class="message-content">

                <strong>SkillMatch AI</strong>

                <p>
                    ${formatText(text)}
                </p>

            </div>

        `;

    }

    else {

        messageDiv.innerHTML = `

            <div class="message-content">

                ${escapeHtml(text)}

            </div>

        `;

    }


    chatMessages.appendChild(messageDiv);


    // Scroll down

    chatMessages.scrollTop =
        chatMessages.scrollHeight;

}


// ===========================
// FORMAT AI TEXT
// ===========================

function formatText(text) {

    return escapeHtml(text)

        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

        .replace(/\n/g, "<br>");

}


// ===========================
// ESCAPE HTML
// ===========================

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}