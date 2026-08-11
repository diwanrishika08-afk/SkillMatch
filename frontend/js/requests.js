const storedUser = JSON.parse(localStorage.getItem("user"));

const container = document.getElementById("requestsContainer");

document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "dashboard.html";
});

loadRequests();

async function loadRequests() {

    try {

        const response = await fetch(
            `https://skillmatch-backend-ystd.onrender.com/api/users/requests/${storedUser.id}`
        );

        const requests = await response.json();

        container.innerHTML = "";

        if (requests.length === 0) {

            container.innerHTML = `
                <h2>No Connection Requests Yet 😊</h2>
            `;

            return;
        }

        requests.forEach(user => {

            const card = document.createElement("div");

            card.classList.add("match-card");

            card.innerHTML = `
                <div class="match-avatar">
                    ${user.name.charAt(0).toUpperCase()}
                </div>

                <h2>${user.name}</h2>

                <p>${user.college || "College not added"}</p>

                <p><strong>Experience:</strong> ${user.experience}</p>

                <div class="request-actions">

        <button class="accept-btn">
        ✓ Accept
        </button>

        <button class="reject-btn">
            ✕ Reject
        </button>

        </div>
            `;

            container.appendChild(card);

            // ==========================
            // ACCEPT BUTTON
            // ==========================

            const acceptBtn = card.querySelector(".accept-btn");

            acceptBtn.addEventListener("click", async () => {

                try {

                    const response = await fetch(
                        "https://skillmatch-backend-ystd.onrender.com/api/users/accept",
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                receiverId: storedUser.id,
                                senderId: user._id
                            })
                        }
                    );

                    const data = await response.json();

                    alert(data.message);

                    loadRequests();

                } catch (error) {

                    console.error(error);

                    alert("Something went wrong!");

                }

            });

            // ==========================
            // REJECT BUTTON
            // ==========================

            const rejectBtn = card.querySelector(".reject-btn");

            rejectBtn.addEventListener("click", async () => {

                try {

                    const response = await fetch(
                        "https://skillmatch-backend-ystd.onrender.com/api/users/reject",
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                receiverId: storedUser.id,
                                senderId: user._id
                            })
                        }
                    );

                    const data = await response.json();

                    alert(data.message);

                    loadRequests();

                } catch (error) {

                    console.error(error);

                    alert("Something went wrong!");

                }

            });

        });

    }

    catch (error) {

        console.error(error);

    }

}