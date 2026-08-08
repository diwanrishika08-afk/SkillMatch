const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const storedUser = JSON.parse(localStorage.getItem("user"));

let currentUser;

const container = document.getElementById("matchesContainer");

document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "dashboard.html";
});
function calculateMatch(currentUser, otherUser) {

    const currentSkills = (currentUser.skills || []).map(s => s.toLowerCase());
    const otherSkills = (otherUser.skills || []).map(s => s.toLowerCase());

    const currentInterests = (currentUser.interests || []).map(i => i.toLowerCase());
    const otherInterests = (otherUser.interests || []).map(i => i.toLowerCase());

    const commonSkills = currentSkills.filter(skill =>
        otherSkills.includes(skill)
    ).length;

    const commonInterests = currentInterests.filter(interest =>
        otherInterests.includes(interest)
    ).length;

    let score = 0;

    // Skills (60%)
    if(currentSkills.length > 0){

        score += (commonSkills / currentSkills.length) * 60;

    }

    // Interests (25%)
    if(currentInterests.length > 0){

        score += (commonInterests / currentInterests.length) * 25;

    }

    // Experience (15%)
    if(currentUser.experience === otherUser.experience){

        score += 15;

    }

    return Math.round(score);

}
loadMatches();
async function loadMatches() {
    const currentResponse = await fetch(
    `http://localhost:5000/api/users/${storedUser.id}`
);

currentUser = await currentResponse.json();

    try {

        const response = await fetch("http://localhost:5000/api/users");

        const users = await response.json();
        users.sort((a,b)=>{

    const matchA = calculateMatch(currentUser,a);

    const matchB = calculateMatch(currentUser,b);

    return matchB-matchA;

});

        container.innerHTML = "";

        users.forEach(user => {
if(user._id.toString() === currentUser._id.toString()){

    return;

}

            const card = document.createElement("div");

            card.classList.add("match-card");

            card.innerHTML = `

                <div class="match-avatar">

                    ${user.name.charAt(0).toUpperCase()}

                </div>

                <h2>${user.name}</h2>

<div class="match-score">
    🎯 ${calculateMatch(currentUser,user)}% Match
</div>

                <p>${user.college || "College not added"}</p>

                <h4>Skills</h4>

                <div class="tags">

                    ${user.skills.map(skill => `<span>${skill}</span>`).join("")}

                </div>

                <h4>Interests</h4>

                <div class="tags">

                    ${user.interests.map(interest => `<span>${interest}</span>`).join("")}

                </div>

                <button class="connect-btn">

                    Connect 🤝

                </button>

            `;

            container.appendChild(card);
            const button = card.querySelector(".connect-btn");

button.addEventListener("click", async () => {

    try {

        const response = await fetch(
            "http://localhost:5000/api/users/connect",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    senderId: currentUser._id,
                    receiverId: user._id
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            button.innerText = "Request Sent ✅";
            button.disabled = true;

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.error(error);
        alert("Something went wrong!");

    }

});
        });

    }

    catch(error){

        console.error(error);

    }

}