const seller_uploaded = document.getElementById("seller-uploaded");
const token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", async (req, res) => {
    await populate_products()
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

async function populate_products() {
    const excludedSellerId = "684e7dd2dd652a927bd9a71a";
    try {
        const res = await fetch(`http://localhost:8000/api/view/seller_uploaded/${excludedSellerId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const result = await res.json();

        if (!result.error) {
            const products = result.filteredProducts;
            let count = 0;
            let product_row;

            for (let i = 0; i < products.length; i++) {
                console.log(products[i]);

                if (count != 4) {
                    product_row +=
                    `<div class="col-4">
                        <a href="./product-details.html?id=${products[i]._id}"><img src="http://localhost:8000${products[i].url}"></a>
                        <h4><a href="./product-details.html?id=6857ab22d8e033eb90a4e0f3" class="product-details">${products[i].title}</a></h4>
                        <div class="rating">
                            <img src="../images/star.png" alt="Rating" style="width: 15px; height: 16px;">
                            <img src="../images/star.png" alt="Rating" style="width: 15px; height: 16px;">
                            <img src="../images/star.png" alt="Rating" style="width: 15px; height: 16px;">
                            <img src="../images/star.png" alt="Rating" style="width: 15px; height: 16px;">
                            <img src="../images/emptyStar.png" alt="Rating" style="width: 15px; height: 16px;">

                        </div>
                        <p class="price">₹${products[i].price}</p>
                    </div>`
                }

                count++;
            }

            seller_uploaded.innerHTML += `<div class="row">${product_row}</div>`;
        }
        else {
            show_toast(`Unexpected error : ${result.error}`, "error");
        }
    } catch (err) {
        console.log(err);
    }
}