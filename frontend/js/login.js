const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const user = {

        email: document.getElementById("email").value,
        password: document.getElementById("password").value

    };

    try {

        const response = await fetch(
            "https://skillmatch-backend-ystd.onrender.com/api/users/login",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(user)

            }
        );

        const data = await response.json();

        if(response.ok){

            // Save JWT
            localStorage.setItem("token", data.token);

            // Save logged-in user
            localStorage.setItem("user", JSON.stringify(data.user));

            alert("🎉 Login Successful!");

            window.location.href="dashboard.html";

        }

        else{

            alert(data.message);

        }

    }

    catch(error){

        console.error(error);

        alert("Could not connect to server.");

    }

});