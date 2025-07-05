const changePassword = document.getElementById("change-password")

//Populate Account Fields
async function get_data() {
    const token = localStorage.getItem("token")

    if (!token) {
        Toastify({
            text: `Please Login first!`,
            className: "info",
            style: {
                background: "linear-gradient(to right,rgb(239, 107, 31),rgb(245, 150, 103))",
            }
        }).showToast();
        setTimeout(() => {
            window.location.replace("User.html");
        }, 3500);
        return;
    }

    try {
        const res = await fetch("http://localhost:8000/api/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        const result = await res.json();
        const Name = document.getElementById("name");
        const Email = document.getElementById("email");
        const Address = document.getElementById("address");
        const Role = document.getElementById("role");

        Name.textContent = result.name;
        Email.textContent = result.email;
        Address.textContent = result.address;
        Role.textContent = result.role;

    }
    catch (err) {
        Toastify({
            text: `Internal Server Error`,
            className: "info",
            style: {
                background: "linear-gradient(to right,rgb(239, 107, 31),rgb(245, 150, 103))",
            }
        }).showToast();
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await isSeller();
    const loader = document.querySelector(".loader");
    Toastify({
        text: "Welcome to Your Account!",
        className: "info",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();
    loader.classList.add("hide");
    await get_data();
})

function logout() {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");
    Toastify({
        text: "Logged out successfully",
        className: "info",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        }
    }).showToast();

    localStorage.setItem("justLoggedOut", "true");
    window.location.replace("User.html");
}

function edit_profile() {
    if (document.getElementById("name").tagName === "INPUT") return;

    const targetDiv = document.querySelector(".toggle");
    const logOut = document.querySelector(".logout");

    logOut.classList.add("hide");
    targetDiv.classList.add("activate");

    document.getElementById("name").outerHTML = `<input type="text" class="editable-input" id="name" value="${document.getElementById("name").textContent}">`;
    document.getElementById("email").outerHTML = `<input type="text" class="editable-input" id="email" value="${document.getElementById("email").textContent}">`;
    document.getElementById("address").outerHTML = `<input type="textarea" class="editable-input" id="address" value="${document.getElementById("address").textContent}">`;
    document.getElementById("role").textContent = `Non-Editable Field`;
}

async function save() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const userData = { name, email, address };
    const token = localStorage.getItem("token");
    const targetDiv = document.querySelector(".toggle");
    const logOut = document.querySelector(".logout");

    try {
        const res = await fetch(`http://localhost:8000/api/update`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ ...userData })
        })

        const result = await res.json();
        if (!result.error) {
            logOut.classList.remove("hide");
            targetDiv.classList.remove("activate");
            Toastify({
                text: `Account updated successfully`,
                className: "info",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();

            document.getElementById("name").outerHTML = `<div id="name"></div>`;
            document.getElementById("email").outerHTML = `<div id="email"></div>`;
            document.getElementById("address").outerHTML = `<div id="address"></div>`;

            await get_data();
        }
        else {
            Toastify({
                text: `${result.error}`,
                className: "warning",
                style: {
                    background: "linear-gradient(to right,rgb(239, 107, 31),rgb(245, 150, 103))",
                }
            }).showToast();
        }
    }
    catch (err) {
        Toastify({
            text: `Internal Server Error`,
            className: "warning",
            style: {
                background: "linear-gradient(to right,rgb(239, 107, 31),rgb(245, 150, 103))",
            }
        }).showToast();
    }
}

async function cancel() {
    const targetDiv = document.querySelector(".toggle");
    const logOut = document.querySelector(".logout");
    const label = document.getElementsByTagName("label");
    const targetDiv2 = document.getElementById("passwordChange");
    const save = document.getElementById("save-changes");
    const account_info = document.querySelector(".account-info");
    const loader = document.querySelector(".loader");
    document.getElementById("edit-profile").disabled = false;

    loader.classList.add("hide");
    logOut.classList.remove("hide");
    targetDiv.classList.remove("activate");
    targetDiv2.classList.remove("activate2");
    save.classList.remove("hide");
    account_info.classList.remove("activate2");

    document.getElementById("name").outerHTML = `<div id="name"></div>`;
    document.getElementById("email").outerHTML = `<div id="email"></div>`;
    document.getElementById("address").outerHTML = `<div id="address"></div>`;
    document.getElementById("role").outerHTML = `<div id="role"></div>`;

    for (let i = 0; i < 4; i++) {
        if (label[i].style.display === "none") {
            label[i].style.display = "block";
        }
    }

    await get_data();
}

changePassword.addEventListener("click", () => {
    document.getElementById("edit-profile").disabled = true;
    async function change_password() {
        const Name = document.getElementById("name");
        const Email = document.getElementById("email");
        const Address = document.getElementById("address");
        const Role = document.getElementById("role");
        const label = document.getElementsByTagName("label");
        const targetDiv = document.querySelector(".toggle");
        const logOut = document.querySelector(".logout");
        const save = document.getElementById("save-changes");
        const targetDiv2 = document.getElementById("passwordChange");
        const account_info = document.querySelector(".account-info");

        logOut.classList.add("hide");
        targetDiv.classList.add("activate");
        save.classList.add("hide");
        targetDiv2.classList.add("activate2");
        account_info.classList.add("activate2");

        Name.style.display = "none";
        Email.style.display = "none";
        Address.style.display = "none";
        Role.style.display = "none";
        for (let i = 0; i < 4; i++) {
            label[i].style.display = "none";
        }
    }
    change_password();
})

async function Password() {
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const save = document.getElementById("save");
    const token = localStorage.getItem("token");

    const userData = { currentPassword, newPassword, confirmPassword };
    try {
        loader.classList.remove("hide");
        save.classList.add("hide");
        document.getElementById("currentPassword").classList.add("hide");
        document.getElementById("newPassword").classList.add("hide");
        document.getElementById("confirmPassword").classList.add("hide");
        const res = await fetch("http://localhost:8000/api/password", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ ...userData })
        })
        save.classList.remove("hide");
        document.getElementById("currentPassword").classList.remove("hide");
        document.getElementById("newPassword").classList.remove("hide");
        document.getElementById("confirmPassword").classList.remove("hide");
        loader.classList.add("hide");

        const result = await res.json();

        if (!result.error) {
            Toastify({
                text: "Password Updated Successfully!",
                className: "info",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
            await get_data();
            cancel();
        }
        else {
            Toastify({
                text: `${result.error}`,
                className: "info",
                style: {
                    background: "linear-gradient(to right,rgb(239, 107, 31),rgb(245, 150, 103))",
                }
            }).showToast();
        }
    } catch (err) {
        Toastify({
            text: `Internal Server Error`,
            className: "info",
            style: {
                background: "linear-gradient(to right,rgb(239, 107, 31),rgb(245, 150, 103))",
            }
        }).showToast();
    }
}

async function isSeller() {
    const token = localStorage.getItem("token");
    const orders = document.getElementById("orders");
    const main_heading = document.querySelector(".main-heading a");
    console.log(main_heading);

    try {
        const res = await fetch("http://localhost:8000/api/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const result = await res.json();

        if (!result.error) {
            if (result.role !== "buyer") {
                orders.classList.add("hide");
                main_heading.href = "../html/seller_dashboard.html";
            }
        }
        else {
            console.log(result.error);
        }
    } catch (err) {
        console.log(err);
    }
}