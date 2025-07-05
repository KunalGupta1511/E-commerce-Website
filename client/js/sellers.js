const productList = document.getElementById("productList");
const noProducts = document.getElementById("noProducts");
const orderList = document.getElementById("orderList");
const noOrders = document.getElementById("noOrders");
const totalProducts = document.getElementById("totalProducts");
const totalOrders = document.getElementById("totalOrders");
const pendingOrders = document.getElementById("pendingOrders");
const form = document.getElementById("addProductForm");
const panels = document.querySelectorAll("#panels a")

const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", async () => {
    await dashboard();

    panels[1].addEventListener("click", async () => {
        await get_products();
    })

    panels[2].addEventListener("click", async () => {
        await get_orders();
    })
})

function show_toast(message, type = "info") {
    let colors = {
        success: "linear-gradient(to right, #00b09b, #96c93d)",
        error: "linear-gradient(to right, rgb(239, 107, 31), rgb(245, 150, 103))",
        info: "linear-gradient(to right, #0074d9, #00bcd4)"
    };

    Toastify({
        text: message,
        className: type,
        style: {
            background: colors[type] || colors.info,
        }
    }).showToast();
}

async function get_products() {
    try {
        const res = await fetch("http://localhost:8000/api/view/products", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const result = await res.json();
        const products = result.productsUploaded;
        let html = "";

        if (!result.error) {
            if (products.length !== 0) {
                document.querySelectorAll(".styled-table")[0].classList.remove("hide");
                noProducts.classList.add("hide");

                for (let i = 0; i < products.length; i++) {
                    const productRow =
                        `<tr class="product-row">
                            <td><img src="http://localhost:8000${products[i].url}" class="product-image"/></td>
                            <td>${products[i].title}</td>
                            <td>₹${products[i].price}</td>
                            <td>${products[i].stock}</td>
                            <td>
                            <button class="edit-btn">Edit</button>
                            <button class="delete-btn">Delete</button>
                            </td>
                        </tr>`

                    html += productRow;
                }

                productList.innerHTML = html;
            }
            else {
                document.querySelectorAll(".styled-table")[0].classList.add("hide");
                noProducts.classList.remove("hide");
            }
            show_toast("Manage your products here!", "info");
        }
        else {
            show_toast(`Unexpected error occured ${result.error}`, "error");
            console.log(result.error);
        }
    } catch (err) {
        show_toast("Internal Server error" , "error");
        console.log(err);
    }
}

async function get_orders() {
    try {
        const res = await fetch("http://localhost:8000/api/placed", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const result = await res.json();
        const orders = result.orders;
        let html = "";

        if (!result.error) {
            if (orders.length !== 0) {
                document.querySelectorAll(".styled-table")[1].classList.remove("hide");
                noProducts.classList.add("hide");

                for (let i = 0; i < orders.length; i++) {
                    const productId = orders[i].products.productId;
                    const result2 = await get_product_details(productId);
                    const orderRow =
                        `<tr class="order-row">
                    <td>${orders[i]._id}</td>
                    <td>${result2.title}</td>
                    <td><img src="http://localhost:8000${result2.url}" class="product-image"/></td>
                    <td>${orders[i].status}</td>
                    <td>
                    <select class="status-select">
                        <option value="Pending" ${orders[i].status === "pending" ? "selected" : ""}>Pending</option>
                        <option value="Shipped" ${orders[i].status === "shipped" ? "selected" : ""}>Shipped</option>
                        <option value="Delivered" ${orders[i].status === "delivered" ? "selected" : ""}>Delivered</option>
                        <option value="Cancelled" ${orders[i].status === "cancelled" ? "selected" : ""}>Cancelled</option>
                    </select>
                    </td>
                </tr>`

                    html += orderRow;
                }

                orderList.innerHTML = html;
            }
            else {
                document.querySelectorAll(".styled-table")[1].classList.add("hide");
                noOrders.classList.remove("hide");
            }
            show_toast("Manage your orders here!", "info");
        }
        else {
            show_toast(`Unexpected error occured ${result.error}`, "error");
            console.log(result.error);
        }
    } catch (err) {
        show_toast("Internal Server error" , "error");
        console.log(err);
    }
}

async function get_product_details(productId) {
    try {
        const res = await fetch(`http://localhost:8000/api/view/products/${productId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const result = await res.json();
        return result;
    } catch (err) {
        console.log(err);
    }
}

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form); 

    try {
        const res = await fetch("http://localhost:8000/api/product", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        });

        const result = await res.json();
        if (!result.error) {
            show_toast("Product uploaded successfully!", "success");
            console.log(result);
        } else {
            show_toast(`Upload failed: ${result.error}`, "error");
        }
    } catch (err) {
        show_toast("Internal Server Error", "error");
        console.log(err);
    }
});

async function dashboard() {
    try {
        const res = await fetch("http://localhost:8000/api/seller/dashboard", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const result = await res.json();
        if (!result.error) {
            totalOrders.textContent = result.noOfOrders;
            totalProducts.textContent = result.noOfProducts;
            pendingOrders.textContent = result.count;
            show_toast("Welcome to your DashBoard!", "success");
        }
        else {
            show_toast(`Unexpected error occured ${result.error}`, "error");
            console.log(result.error);
        }
    } catch (err) {
        show_toast("Internal Server error" , "error");
        console.log(err);
    }
}