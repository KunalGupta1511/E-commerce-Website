const checkout_products = document.getElementById("checkout-products");
const payment_summary = document.querySelector(".payment-summary");
const shipping_info = document.querySelector(".shipping-info");
const place_order_btn = document.querySelector(".place-order-btn");


document.addEventListener("DOMContentLoaded", async () => {
    await get_cart();
    await get_user();
})

async function get_cart() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:8000/api/get_cart", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const result = await res.json();

        if (!result.error) {
            const cart_length = result.cart.length;

            for (let i = 0; i < cart_length; i++) {
                const item = result.cart[i].product;
                const productID = item._id;

                const product_row =
                    `<a href="./product-details.html?id=${productID}" class="product-link">
                        <div class="product">
                            <div class="product-left">
                            <img src="${item.image}" alt="Product Image">
                            <div class="product-details">
                                <p class="product-title">${item.title}</p>
                                <p class="product-qty">Qty: ${result.cart[i].quantity}</p>
                            </div>
                            </div>
                            <div class="product-price">
                            ₹${item.price} × ${result.cart[i].quantity} = ₹${result.cart[i].subtotal}
                            </div>
                        </div>
                    </a>`;


                checkout_products.innerHTML += product_row;
            }

            const subtotal_row =
                `<div class="row"><span>Subtotal</span><span>₹${result.cartTotal + 35}</span></div>
                <div class="row"><span>Shipping</span><span>₹35.00</span></div>
                <div class="row total"><span>Total</span><span id="checkout-total">₹${result.cartTotal + 70}</span></div>`

            payment_summary.innerHTML = subtotal_row;
        }
        else {
            Toastify({
                text: `${result.error}`,
                className: "info",
                style: {
                    background: "linear-gradient(to right,rgb(239, 107, 31),rgb(245, 150, 103))",
                }
            }).showToast();
            console.log(err);
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

async function get_user() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:8000/api/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const result = await res.json();

        const info =
            `<input type="text" placeholder="Full Name" value="${result.name}" required>
            <textarea placeholder="Full Address" required>${result.address}</textarea>
            <div class="split">
                <input type="text" placeholder="City" required>
                <input type="text" placeholder="State" required>
                <input type="text" placeholder="ZIP Code" required>
            </div>`

        shipping_info.innerHTML = info;
    } catch (err) {
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

place_order_btn.addEventListener("click", async () => {
    const shippingAddress = document.querySelector(".shipping-info textarea").value;
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:8000/api/order/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ shippingAddress })
        })

        const result = await res.json();
        if (!result.error) {
            localStorage.setItem("placed_order", "true");
            window.location.replace("home.html");
        }
        else {
            Toastify({
                text: `${result.error}`,
                className: "info",
                style: {
                    background: "linear-gradient(to right,rgb(239, 107, 31),rgb(245, 150, 103))",
                }
            }).showToast();
            console.log(err);
        }
    } catch (err) {
        Toastify({
            text: `Internal Server Error`,
            className: "info",
            style: {
                background: "linear-gradient(to right,rgb(239, 107, 31),rgb(245, 150, 103))",
            }
        }).showToast();
        console.log(err);
    }
})