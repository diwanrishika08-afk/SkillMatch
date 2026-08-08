const profileForm = document.getElementById("profileForm");

const token = localStorage.getItem("token");

if(!token){

    window.location.href="login.html";

}

const user = JSON.parse(localStorage.getItem("user"));

profileForm.addEventListener("submit", async(e)=>{

    e.preventDefault();

    const profile = {

        college:document.getElementById("college").value,

        skills:document
            .getElementById("skills")
            .value
            .split(",")
            .map(skill=>skill.trim()),

        interests:document
            .getElementById("interests")
            .value
            .split(",")
            .map(interest=>interest.trim()),

        experience:document.getElementById("experience").value,

        bio:document.getElementById("bio").value

    };

    try{

        const response=await fetch(

            `http://localhost:5000/api/users/profile/${user.id}`,

            {

                method:"PUT",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify(profile)

            }

        );

        const data=await response.json();

        if(response.ok){

            alert("✅ Profile Updated!");

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