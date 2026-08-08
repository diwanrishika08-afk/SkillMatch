const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const user = {

        name: document.getElementById("name").value,

        email: document.getElementById("email").value,

        password: document.getElementById("password").value

    };

    try {

        const response = await fetch(
            "http://localhost:5000/api/users/signup",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify(user)

            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("🎉 Account created successfully!");

            window.location.href = "login.html";

        }

        else {

            alert(data.message);

        }

    }

    catch (error) {

        console.error(error);

        alert("Could not connect to the server.");

    }

});