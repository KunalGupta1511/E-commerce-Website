const order_list = document.getElementById("orders-list");
const orders_container = document.querySelector(".orders-container");
const loader = document.getElementById("loader");
const no_order = document.getElementById("no-orders");

document.addEventListener("DOMContentLoaded", async () => {
    no_order.classList.add("hide");
    orders_container.classList.add("hide");
    await render_orders();
    orders_container.classList.remove("hide");
    loader.classList.add("hide");
})

async function render_orders() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch("http://localhost:8000/api/order/view", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const result = await res.json();
        const numberOfOrders = result.length;

        if(numberOfOrders===0){
            orders_container.classList.add("hide")
            no_order.classList.remove("hide");
        }

        for (let i = 0; i < numberOfOrders; i++) {
            const productId = result[i].products.productId;
            const result2 = await get_product(productId);

            order_list.innerHTML +=
                `<a href="./product-details.html?id=${productId}" class="product-link">
                    <div class="order-card">
                        <div class="ordered-products"> 
                            <div class="ordered-product">
                                <img src="http://localhost:8000${result2.url}" alt="Product Image">
                                <div class="product-info">
                                    <p class="product-title">${result2.title}</p>
                                    <p class="product-qty">Qty: ${result[i].products.quantity}</p>
                                    <p class="product-price">₹${result[i].products.priceAtPurchase}</p>
                                </div>
                            </div>
                        </div>

                        <div class="order-footer">
                            <span class="order-total">Total: ₹${result[i].totalAmount}</span>
                            <span class="order-status delivered">${result[i].status}</span>
                        </div>
                    </div>
                </a>`
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
}

async function get_product(productId) {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`http://localhost:8000/api/view/products/${productId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const result = await res.json();
        if (!result.error) {
            return result
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
            text: `Internal Server error`,
            className: "info",
            style: {
                background: "linear-gradient(to right,rgb(239, 107, 31),rgb(245, 150, 103))",
            }
        }).showToast();
        console.log(err);
    }
}