const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const user = JSON.parse(localStorage.getItem("user"));

document.getElementById("username").textContent = user.name;

document.getElementById("welcomeName").textContent = user.name;

document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href = "login.html";


});
document
.getElementById("profileCard")
.addEventListener("click",()=>{

window.location.href="profile.html";

});
document
.getElementById("matchCard")
.addEventListener("click",()=>{

window.location.href="matches.html";

});
const requestsCard = document.getElementById("requestsCard");

if (requestsCard) {

    requestsCard.addEventListener("click", () => {

        window.location.href = "requests.html";

    });

}
const connectionsCard = document.getElementById("connectionsCard");

if (connectionsCard) {

    connectionsCard.addEventListener("click", () => {

        window.location.href = "connections.html";

    });

}
