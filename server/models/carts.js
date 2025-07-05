const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }, // reference to Users
    items: [
        {
            productID: {
                type : mongoose.Schema.Types.ObjectId,
                ref : 'Products'
            },
            quantity: Number
        }
    ]
}, { timestamps: true })

const Cart = new mongoose.model("Cart", CartSchema);

module.exports = Cart;