const tableBody = document.querySelector("#product-table tbody");
const tableBody2 = document.querySelector("#subtotal-table tbody");
const btn_container = document.querySelector(".btn-container");
const empty_cart = document.querySelector(".empty-cart");
const loader = document.getElementById("loader");
const main = document.getElementById("main");


document.addEventListener("DOMContentLoaded", async () => {
    main.classList.add("hide");
    await get_cart();
    loader.classList.add("hide");
    main.classList.remove("hide");
})

function updateCartTotals(cartTotal) {
    tableBody2.innerHTML = `
        <tr id="cart-subtotal">
            <td>Subtotal</td>
            <td><div class="cart-total">₹${cartTotal}</div></td>
        </tr>
        <tr>
            <td>Tax</td>
            <td>₹35.00</td>
        </tr>
        <tr>
            <td>Total</td>
            <td><div class="final-total">₹${cartTotal + 35}</div></td>
        </tr>`;
}

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
            empty_cart.classList.add("hide");
            if (cart_length === 0) {
                tableBody.classList.add("hide");
                tableBody2.classList.add("hide");
                btn_container.classList.add("hide");
                empty_cart.classList.remove("hide");
                return;
            } else {
                empty_cart.classList.add("hide");
            }


            for (let i = 0; i < cart_length; i++) {
                const item = result.cart[i].product;
                const productID = item._id;
                const product_row =
                    `<tr class="product" id="product-${productID}">
                        <td>
                            <div class="product-info">
                                <div class="image"><img src="${item.image}"></div>
                                <div class="product-details">
                                    <p>${item.title}</p>
                                    <small>Price: ₹${item.price}</small><br>
                                    <a onclick="remove('${productID}')" class="remove-btn">Remove</a>
                                </div>
                            </div>
                        </td>
                        <td><input type="number" value="${result.cart[i].quantity}" fdprocessedid="45tzld" min="1" onchange="change(this,'${productID}')" data-price="${item.price}"></td>
                        <td>
                            <div class="price">₹${result.cart[i].subtotal}</div>
                        </td>
                    </tr>`
                tableBody.innerHTML += product_row;
            }

            const subtotal_row =
                `<tr id="cart-subtotal">
                    <td>Subtotal</td>
                    <td><div class="cart-total">₹${result.cartTotal}</div></td>
                </tr>
                <tr>
                    <td>Tax</td>
                    <td>₹35.00</td>
                </tr>
                <tr>
                    <td>Total</td>
                    <td><div class="final-total">₹${result.cartTotal + 35}.00</div></td>
                </tr>`

            tableBody2.innerHTML = subtotal_row;
        }
        else {
            Toastify({
                text: `Unexpeccted Error ${result.error}`,
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

async function remove(productID) {
    change(0, productID);
}

async function change(quantity, productID) {
    const token = localStorage.getItem("token");
    let newQuantity, unitPrice;

    if (typeof quantity === "number") {
        newQuantity = quantity;
    } else {
        newQuantity = Number(quantity.value);
        unitPrice = Number(quantity.dataset.price);
    }

    const userData = { productID, newQuantity }
    const subtotal = unitPrice * newQuantity;

    try {
        const res = await fetch("http://localhost:8000/api/update_cart", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ ...userData })
        })

        const result = await res.json();
        console.log(result);

        if (!result.error) {
            if (result.flag === 1) {
                const productRow = document.querySelector(`#product-${productID}`);
                if (productRow) {
                    productRow.remove();
                    window.location.href = window.location.href;
                }
                Toastify({
                    text: `${result.msg}`,
                    className: "info",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
            }

            document.querySelector(`#product-${productID} .price`).textContent = `₹${subtotal}`;
            let cartTotal = 0;
            for (let i = 0; i < result.items.length; i++) {
                const price = parseFloat(document.querySelector(`#product-${result.items[i].productID} .price`).textContent.replace("₹", ""));

                cartTotal += price;
            }
            updateCartTotals(cartTotal);

            Toastify({
                text: `${result.msg}`,
                className: "info",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        }
        else {
            console.log(result.error);
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