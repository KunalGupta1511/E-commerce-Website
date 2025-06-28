const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // reference to Users

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    products: [
        {
            productId: mongoose.Schema.Types.ObjectId,
            quantity: Number,
            priceAtPurchase: Number
        }
    ],

    totalAmount: {
        type: Number,
        required: [true, "Please specify the amount needed"]
    },

    shippingAddress: {
        type: String,
        required: [true, "Please enter a shipping Address"]
    },

    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: 'pending'
    },
}, { timestamps: true })

const Orders = new mongoose.model("Orders", OrderSchema)

module.exports = Orders;