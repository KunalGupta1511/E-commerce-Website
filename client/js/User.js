const sign_up = document.getElementById("sign-up");
const sign_in = document.getElementById("sign-in");

document.addEventListener("DOMContentLoaded", () => {
    // If the state was logged in
    // async function auto_login() {
    //     const token = localStorage.getItem("token");
    //     console.log(token);
    //     const res = await fetch(`http://localhost:8000/api/auto_login` , {
    //         method : "GET",
    //         headers : {
    //             Authorization : `Bearer ${token}`
    //         }
    //     })

    //     const result = await res.json();

    //     if(!result.error){
    //         console.log(result);
    //     }
    //     else{
    //         console.log(result.error);
    //     }
    // }


    // async function checkUserState() {
    //     if (!localStorage.getItem("token")) {
    //         return false;
    //     }
    //     else {
    //         await auto_login();
    //     }
    // }

    // const userState = checkUserState();

    //On clicking sign-up button
    sign_up.addEventListener("submit", async (e) => {
        e.preventDefault(); // prevent form reload
        const name = sign_up.querySelector('#Name').value;
        const email = sign_up.querySelector('#newEmail').value;
        const password = sign_up.querySelector('#newPassword').value;
        const address = sign_up.querySelector('#Address').value;

        const buyer = sign_up.querySelector('#Buyer');
        const seller = sign_up.querySelector('#Seller');

        let role = null;

        if (buyer.checked) {
            role = "buyer";
        }
        else if (seller.checked) {
            role = "seller";
        }

        const userData = { name, email, password, address, role };

        //Check whether user is logged in...if not then register
        try {
            const res = await fetch(`http://localhost:8000/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...userData })
            })

            const result = await res.json();
            if (!result.error) {
                document.getElementById("sign-up-btn").click();
                Toastify({
                    text: `Account created for ${result.name}`,
                    className: "info",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
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
            console.log(err);
        }

    });

    //On clicking sign-in button
    sign_in.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = sign_in.querySelector('#registeredEmail').value;
        const password = sign_in.querySelector('#registeredPassword').value;
        const userData = { email, password };

        try {
            const res = await fetch(`http://localhost:8000/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ ...userData })
            })

            const result = await res.json();
            if (!result.error) {
                localStorage.setItem("token", result.token);
                window.location.replace("welcome.html");
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
    })

    //Toast to show successfull logout
    if (localStorage.getItem("justLoggedOut") === "true") {
        Toastify({
            text: "Logged out successfully",
            className: "info",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();

        localStorage.removeItem("justLoggedOut");
    }
});