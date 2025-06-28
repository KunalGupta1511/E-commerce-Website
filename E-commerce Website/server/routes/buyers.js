const router = require("express").Router();
const Order = require("../models/orders");
const Products = require("../models/products");
const mongoose = require("mongoose");
const Cart = require("../models/carts");

const auth = require("../middlewares/auth");
const isBuyer = require("../middlewares/isBuyer");

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

            const price = product.price


            const newOrder = new Order({
                buyer: req.user._id,
                seller: product.postedBy,
                products: [
                    {
                        productID,
                        quantity,
                        priceAtPurchase: price
                    }
                ],
                totalAmount: quantity * price,
                shippingAddress
            })

            product.stock -= quantity;
            await product.save();

            const result = await newOrder.save();
            return res.status(200).json({ success: true, ...result._doc, msg: `Stock Left : ${product.stock}` })
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
            const orders = await Order.find({ buyer: req.user._id }).populate("products._id");
            res.status(200).json(orders);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })

    //Viewing Products
    .get("/view/products/:id", auth, isBuyer, async (req, res) => {
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
        
    })
module.exports = router;