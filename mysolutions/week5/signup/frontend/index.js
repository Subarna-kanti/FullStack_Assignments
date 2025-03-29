const info_block = document.getElementById("information");

if (localStorage['token']) {
    info_block.style.display = "block";
}

async function signup() {
    try {
        const username = document.getElementById("signup-username").value;
        const password = document.getElementById("signup-password").value;

        const response = await axios.post("http://localhost:3000/signup", {
            username: username,
            password: password,
        });

        if (response.status === 200) {
            alert("You Signed Up Successfully");
        }
    } catch (error) {
        if (error.response) {
            alert("Error: ", error.response.data.error);
        }
    }


};

async function signin() {
    try {
        const username = document.getElementById("signin-username").value;
        const password = document.getElementById("signin-password").value;

        const response = await axios.post("http://localhost:3000/signin", {
            username: username,
            password: password,
        });

        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);

        alert("Signed-in Successfully");
    } catch (error) {
        console.error("Login failed:", error.response?.data?.message || error.message);
        alert("Login failed: " + (error.response?.data?.message || "Something went wrong"));
    };
}

async function logout() {
    const response = await axios.post(
        "http://localhost:3000/logout",
        { username: localStorage["username"] },
        { headers: { token: localStorage["token"] } }
    );
    localStorage.removeItem("token");
    alert("Logout Successfully");
};

async function getInformation() {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/me", {
        headers: {
            authorization: token,
        }
    });
    info_block.innerHTML += response.data.username;
};