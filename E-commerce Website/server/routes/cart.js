const router = require("express").Router();
const mongoose = require("mongoose");
const Cart = require("../models/carts");

const auth = require("../middlewares/auth");
const isBuyer = require("../middlewares/isBuyer");

router
    //Add product to cart
    .post("/add_to_cart", auth, isBuyer, async (req, res) => {
        const productID = req.body.productID;
        const quantity = parseInt(req.body.quantity);

        if (!mongoose.Types.ObjectId.isValid(productID)) {
            return res
                .status(400)
                .json({ error: "Invalid Product ID" });
        }

        try {
            const doesCartExist = await Cart.findOne({ userID: req.user._id })

            if (!doesCartExist) {
                const newCart = new Cart({
                    userID: req.user._id,
                    items: [{
                        productID,
                        quantity
                    }]
                })

                const result = await newCart.save();
                return res.status(200).json({
                    success: true,
                    msg: "New Cart made successfully!",
                    ...result._doc
                })
            }

            const isProductPresent = doesCartExist.items.find(items => items.productID.toString() === productID);

            if (isProductPresent) {
                isProductPresent.quantity += quantity;
            }
            else {
                doesCartExist.items.push({ productID, quantity })
            }

            const result = await doesCartExist.save();
            return res.status(200).json({
                success: true,
                msg: "Cart Updated Successfully!",
                ...result._doc
            });
        }
        catch (err) {
            console.log(err);
            return res
                .status(500)
                .json({ error: err.message });
        }
    })

    //Viewing Cart 
    .get("/get_cart", auth, isBuyer, async (req, res) => {
        try {
            const userID = req.user._id

            const cart = await Cart.findOne({ userID }).populate("items.productID")

            if (!cart || cart.items.length === 0) {
                return res.status(200).json({
                    success: true,
                    message: "Cart is empty",
                    cart: [],
                    cartTotal: 0
                });
            }

            let cartTotal = 0;
            const formattedItems = cart.items.map(item => {
                const product = item.productID;
                const subtotal = product.price * item.quantity;
                const imageURL = `${req.protocol}://${req.get("host")}${product.url}`;
                cartTotal += subtotal;

                return {
                    product: {
                        _id: product._id,
                        title: product.title,
                        description: product.description,
                        price: product.price,
                        image: imageURL
                    },
                    quantity: item.quantity,
                    subtotal
                };
            });

            return res.status(200).json({
                success: true,
                cart: formattedItems,
                cartTotal
            });
        }
        catch (err) {
            console.log(err);
            return res
                .status(500)
                .json({ error: err.message })
        }
    })

    //Update Cart
    .patch("/update_cart", auth, isBuyer, async (req, res) => {
        const productID = req.body.productID;
        const newQuantity = parseInt(req.body.newQuantity);

        if (!mongoose.Types.ObjectId.isValid(productID)) {
            return res
                .status(400)
                .json({ error: "Invalid Product ID" });
        }

        if (newQuantity < 0) {
            return res
                .status(400)
                .json({ error: "Quantity should be positive" })
        }

        try {
            const doesCartExist = await Cart.findOne({ userID: req.user._id });

            if (!doesCartExist) {
                return res
                    .status(400)
                    .json({ error: "You should have a cart first!!" });
            }

            const isProductPresent = doesCartExist.items.find(items => items.productID.toString() === productID);

            if (!isProductPresent) {
                return res
                    .status(400)
                    .json({ error: "No product found!" });
            }

            var flag = 0;
            if (newQuantity === 0) {
                doesCartExist.items = doesCartExist.items.filter(item => item.productID.toString() !== productID);
                flag = 1;
            } else {
                isProductPresent.quantity = newQuantity;
            }

            const result = await doesCartExist.save();
            return res
                .status(200)
                .json({ success: true, ...result._doc, msg: "Cart Updated Successfully" ,flag})
        }
        catch (err) {
            console.log(err);
            return res
                .status(500)
                .json({ error: err.message })
        }
    })

    //Delete Cart
    .delete("/delete_cart", auth, isBuyer, async (req, res) => {
        const doesCartExist = await Cart.findOne({ userID: req.user._id });

        if (!doesCartExist) {
            return res
                .status(400)
                .json({ error: "You should have a cart first!!" });
        }

        doesCartExist.items = [];
        const result = await doesCartExist.save();

        return res
            .status(200)
            .json({ success: true, ...result._doc, msg: "Cart deleted successfully!" });
    })

module.exports = router;