const images = document.querySelector(".images");
const title = document.getElementById("product-name");
const price = document.getElementById("product-price");
const description = document.getElementById("product-description");
const title2 = document.getElementById("product-name2");
const price2 = document.getElementById("product-price2");
const details = document.querySelector(".details");
const loader = document.getElementById("loader");
const modal_overlay = document.getElementById("modal-overlay");
const modal = document.getElementById("modal");

async function get_product() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const token = localStorage.getItem("token");

    try {
        images.classList.add("hide");
        details.classList.add("hide");
        const res = await fetch(`http://localhost:8000/api/view/products/${productId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const result = await res.json();
        loader.classList.add("hide");
        images.classList.remove("hide");
        details.classList.remove("hide");

        if (!result.error) {
            const imageUrl = `http://localhost:8000${result.url}`;
            title.textContent = result.title;
            price.textContent = `₹${result.price}`;
            description.textContent = result.description;
            title2.textContent = result.title;
            price2.textContent = `₹${result.price}`;

            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = "Product Image";

            images.appendChild(img);
        }
        else {
            Toastify({
                text: `Unexpected error occured ${result.error}`,
                className: "info",
                style: {
                    background: "linear-gradient(to right,rgb(239, 107, 31),rgb(245, 150, 103))",
                }
            }).showToast();
            console.log(result.error);
        }
    }
    catch (err) {
        Toastify({
            text: `Internal Servor Error`,
            className: "info",
            style: {
                background: "linear-gradient(to right,rgb(239, 107, 31),rgb(245, 150, 103))",
            }
        }).showToast();
        console.log(err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    modal_overlay.classList.add("hide");
    get_product();
})

function trigger() {
    modal_overlay.classList.remove("hide");
}

function cancel() {
    modal_overlay.classList.add("hide");
}

async function add_to_cart() {
    const quantity = document.getElementById("quantity-input").value;
    const token = localStorage.getItem("token");
    const params = new URLSearchParams(window.location.search);
    const productID = params.get("id");

    if (quantity < 1) {
        Toastify({
            text: `Quantity should be atleast 1`,
            className: "info",
            style: {
                background: "linear-gradient(to right,rgb(239, 107, 31),rgb(245, 150, 103))",
            }
        }).showToast();
    }

    const userData = { productID, quantity };
    try {
        modal.classList.add("hide");
        loader.classList.remove("hide");
        const res = await fetch("http://localhost:8000/api/add_to_cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ ...userData })
        })

        const result = await res.json();
        modal.classList.remove("hide");
        loader.classList.add("hide");

        if (!result.error) {
            cancel();
            Toastify({
                text: `${result.msg}`,
                className: "info",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        }
        else {
            Toastify({
                text: `Unexpected Error ${result.error}`,
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
        console.log(err);
    }
}