// ===========================
// GET USERS
// ===========================

const storedUser = JSON.parse(
    localStorage.getItem("user")
);


// Get connection from URL

const params = new URLSearchParams(
    window.location.search
);

const otherUserId = params.get("userId");


// Elements

const messagesContainer =
    document.getElementById("messagesContainer");

const messageInput =
    document.getElementById("messageInput");

const sendBtn =
    document.getElementById("sendBtn");

const userName =
    document.getElementById("userName");

const userAvatar =
    document.getElementById("userAvatar");

const backBtn =
    document.getElementById("backBtn");


// ===========================
// CHECK USER
// ===========================

if (!storedUser || !storedUser.id) {

    window.location.href = "login.html";

}


// ===========================
// BACK
// ===========================

backBtn.addEventListener("click", () => {

    window.location.href = "connections.html";

});


// ===========================
// LOAD USER
// ===========================

async function loadUser() {

    try {

        const response = await fetch(

            `http://localhost:5000/api/users/${otherUserId}`

        );

        const user = await response.json();


        if (!response.ok) {

            throw new Error(
                user.message || "Could not load user."
            );

        }


        userName.textContent =
            user.name || "Student";


        userAvatar.textContent =
            (user.name || "U")
                .charAt(0)
                .toUpperCase();


    }

    catch (error) {

        console.error(error);

        userName.textContent =
            "User";

    }

}


// ===========================
// LOAD MESSAGES
// ===========================

async function loadMessages() {

    try {

        const response = await fetch(

            `http://localhost:5000/api/messages/${storedUser.id}/${otherUserId}`

        );


        const messages = await response.json();


        messagesContainer.innerHTML = "";


        if (messages.length === 0) {

            messagesContainer.innerHTML = `

                <div class="loading-message">

                    No messages yet. Say hello! 👋

                </div>

            `;

            return;

        }


        messages.forEach(message => {

            displayMessage(message);

        });


        scrollToBottom();

    }

    catch (error) {

        console.error(error);

        messagesContainer.innerHTML = `

            <div class="loading-message">

                Could not load messages.

            </div>

        `;

    }

}


// ===========================
// DISPLAY MESSAGE
// ===========================

function displayMessage(message) {

    const div =
        document.createElement("div");


    const isMine =
        message.sender === storedUser.id ||
        message.sender.toString() === storedUser.id.toString();


    div.classList.add(

        "message",

        isMine
            ? "my-message"
            : "their-message"

    );


    const time =
        new Date(message.createdAt)
            .toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );


    div.innerHTML = `

        ${escapeHtml(message.text)}

        <span class="message-time">
            ${time}
        </span>

    `;


    messagesContainer.appendChild(div);

}


// ===========================
// SEND MESSAGE
// ===========================

async function sendMessage() {

    const text =
        messageInput.value.trim();


    if (!text) {

        return;

    }


    try {

        sendBtn.disabled = true;


        const response = await fetch(

            "http://localhost:5000/api/messages/send",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    senderId:
                        storedUser.id,

                    receiverId:
                        otherUserId,

                    text:
                        text

                })

            }

        );


        const data =
            await response.json();


        if (!response.ok) {

    console.log("SEND MESSAGE ERROR:", data);

    alert(
        data.message ||
        data.error ||
        "Could not send message."
    );

    return;

}


        messageInput.value = "";


        await loadMessages();


    }

    catch (error) {

        console.error(error);

        alert(
            "Could not send message."
        );

    }

    finally {

        sendBtn.disabled = false;

        messageInput.focus();

    }

}


// ===========================
// SEND BUTTON
// ===========================

sendBtn.addEventListener(
    "click",
    sendMessage
);


// ===========================
// ENTER TO SEND
// ===========================

messageInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            sendMessage();

        }

    }
);


// ===========================
// ESCAPE HTML
// ===========================

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ===========================
// SCROLL
// ===========================

function scrollToBottom() {

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;

}


// ===========================
// START
// ===========================

if (otherUserId) {

    loadUser();

    loadMessages();

}