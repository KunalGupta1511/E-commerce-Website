const router = require("express").Router()
const Products = require("../models/products")
const mongoose = require("mongoose");

const auth = require("../middlewares/auth")
const isSeller = require("../middlewares/isSeller")
const upload = require("../middlewares/upload");
const Orders = require("../models/orders");


router
    //Posting new Product
    .post("/product", auth, isSeller, upload.single('file'), async (req, res) => {
        if (!req.file) return res.status(200).json({
            success: true,
            warning: "No product image uploaded. You can add it later if you want."
        });

        const { title, description, price, category, stock } = req.body
        const file = req.file;

        if (!title || !description || !price || !category) {
            return res
                .status(400)
                .json({ error: `Please enter all the fields` })
        }

        try {
            const newProduct = new Products({
                title,
                description,
                price,
                category,
                stock,
                url: `/uploads/${file.filename}`,
                postedBy: req.user._id
            })

            const existingProduct = await Products.findOne({
                title: title.trim(),
                postedBy: req.user._id
            });

            if (existingProduct) {
                return res.status(400).json({
                    error: "You have already uploaded this product."
                });
            }

            const result = await newProduct.save();
            return res.status(200).json({ ...result._doc })

        } catch (err) {
            return res
                .status(400)
                .json({ error: err.message })
        }
    })

    //Updating order status
    .patch("/status", auth, isSeller, async (req, res) => {
        const { orderID, newStatus } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderID)) {
            return res
                .status(400)
                .json({ error: "Invalid Order ID" });
        }

        try {
            const order = await Orders.findOne({ _id: orderID })

            if (!order) {
                return res
                    .status(400)
                    .json({ error: "No order found!!" })
            }

            order.status = newStatus;
            await order.save();

            return res
                .status(200)
                .json({ success: true, msg: `Order status updated to ${newStatus}` })
        }
        catch (err) {
            console.log(err);
            return res
                .status(500)
                .json({ error: err.message })
        }
    })

    //Viewing all orders
    .get("/placed", auth, isSeller, async (req, res) => {
        try {
            const orders = await Orders.find({ seller: req.user._id }).populate("products._id");

            return res.status(200).json({ orders});
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
module.exports = router