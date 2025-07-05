const router = require("express").Router();
const Order = require("../models/orders");
const Products = require("../models/products");
const mongoose = require("mongoose");
const Cart = require("../models/carts");

const auth = require("../middlewares/auth");
const isBuyer = require("../middlewares/isBuyer");

async function create_order(product, userID, productID, shippingAddress, quantity) {
    const price = product.price

    const newOrder = new Order({
        buyer: userID,
        seller: product.postedBy,
        products:
        {
            productId: productID,
            quantity,
            priceAtPurchase: price
        }
        ,
        totalAmount: quantity * price,
        shippingAddress
    })

    product.stock -= quantity;
    await product.save();

    const result = await newOrder.save();

    return result;
}

router
    //Creating new order
    .post("/order", auth, isBuyer, async (req, res) => {
        const { productID, shippingAddress } = req.body;
        const quantity = parseInt(req.body.quantity);


        if (!mongoose.Types.ObjectId.isValid(productID)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }

        try {
            const product = await Products.findById(productID);
            if (!product) {
                return res.status(404).json({ error: "Product not Found" })
            }

            if (product.stock < quantity) {
                return res.status(400).json({ error: "Not enough stock available" })
            }

            const result = await create_order(product, req.user._id, productID, shippingAddress, quantity);
            return res.status(200).json({ success: true, result, msg: `Stock Left : ${product.stock}` })
        }
        catch (err) {
            console.log(err)
            return res
                .status(500)
                .json({ error: err.message })
        }
    })

    //Viewing all orders
    .get("/order/view", auth, isBuyer, async (req, res) => {
        try {
            const orders = await Order.find({ buyer: req.user._id }).populate("products.productId");
            res.status(200).json(orders);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })

    //Viewing Products
    .get("/view/products/:id", auth, async (req, res) => {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res
                .status(400)
                .json({ error: "Invalid Product ID" });
        }

        if (!id) return res.status(404).json({ error: "No id found!" });

        try {
            const isProductPresent = await Products.findById(id);

            if (!isProductPresent) {
                return res
                    .status(400)
                    .json({ error: "No product Found" })
            }

            return res.status(200).json({ success: true, ...isProductPresent._doc })
        }
        catch (err) {
            return res.status(500).json({ error: err.message })
        }
    })

    //Order from Cart
    .post("/order/cart", auth, isBuyer, async (req, res) => {
        const userID = req.user._id;
        const { shippingAddress } = req.body;

        try {
            const doesCartExist = await Cart.findOne({ userID });

            if (!doesCartExist) {
                return res.status(400).json({ error: "You should have a Cart first!!" });
            }

            const numberOfItems = doesCartExist.items.length;
            const item = doesCartExist.items;
            const result = [];

            for (let i = 0; i < numberOfItems; i++) {
                const product = await Products.findById(item[i].productID);
                if (!product) {
                    return res.status(404).json({ error: "Product not Found" })
                }

                if (product.stock < item[i].quantity) {
                    return res.status(400).json({ error: "Not enough stock available" })
                }

                const order = await create_order(product, req.user._id, item[i].productID, shippingAddress, item[i].quantity);
                result.push(order);
            }

            await Cart.findOneAndUpdate({ userID }, { items: [] });
            return res.status(200).json({ success: true, result })

        } catch (err) {
            return res.status(500).json({ error: err.message })
        }
    })

    //Get all products
    .get("/view/seller_uploaded/:sellerId", auth, isBuyer, async (req, res) => {
        const excludedSellerId = req.params.sellerId;
        const id = new mongoose.Types.ObjectId(excludedSellerId);

        try {
            const filteredProducts = await Products.find({ postedBy: { $ne: excludedSellerId } });
            res.status(200).json({ filteredProducts });
        } catch (err) {
            res.status(500).json({ error: "Failed to fetch products" });
        }
    })

module.exports = router;