const storedUser = JSON.parse(localStorage.getItem("user"));

const container = document.getElementById("connectionsContainer");

document.getElementById("backBtn").addEventListener("click", () => {

    window.location.href = "dashboard.html";

});

loadConnections();

async function loadConnections() {

    try {

        const response = await fetch(
            `http://localhost:5000/api/users/connections/${storedUser.id}`
        );

        const users = await response.json();

        container.innerHTML = "";

        if (users.length === 0) {

            container.innerHTML = `
                <h2>No Connections Yet 🤝</h2>
            `;

            return;

        }

        users.forEach(user => {

            const card = document.createElement("div");

            card.classList.add("match-card");

            card.innerHTML = `

                <div class="match-avatar">
                    ${user.name.charAt(0).toUpperCase()}
                </div>

                <h2>${user.name}</h2>

                <p>
                    🏫 ${user.college || "College not added"}
                </p>

                <div class="experience-badge">
                    💼 ${user.experience || "Not specified"}
                </div>

                <h4>Skills</h4>

                <div class="tags">

                    ${(user.skills || []).map(skill =>
                        `<span>${skill}</span>`
                    ).join("")}

                </div>

                <h4>Bio</h4>

                <p class="bio-text">

                    ${user.bio || "No bio added."}

                </p>

                <div class="connection-actions">

                    <button class="view-profile-btn">

                        👀 View Profile

                    </button>

                    <button class="chat-btn">

                        💬 Chat

                    </button>

                </div>

            `;

            container.appendChild(card);


            // ===========================
            // VIEW PROFILE
            // ===========================

            const viewBtn =
                card.querySelector(".view-profile-btn");

            viewBtn.addEventListener("click", () => {

                alert(

                    `${user.name}\n\n` +

                    `College: ${user.college || "Not added"}\n` +

                    `Experience: ${user.experience || "Not specified"}\n\n` +

                    `Skills:\n${(user.skills || []).join(", ")}\n\n` +

                    `Bio:\n${user.bio || "No bio"}`

                );

            });


            // ===========================
            // CHAT BUTTON
            // ===========================

            const chatBtn =
                card.querySelector(".chat-btn");

            chatBtn.addEventListener("click", () => {

                window.location.href =
                    `chat.html?userId=${user._id}`;

            });

        });

    }

    catch (error) {

        console.error(error);

        container.innerHTML = `

            <h2>
                Unable to load connections 😕
            </h2>

        `;

    }

}