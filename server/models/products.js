const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },

    description: {
        type: String,
        required: [true, "Description is required"]
    },

    price: {
        type: Number,
        required: [true, "Price is required"]
    },

    url: {
        type: String,
    }, 

    category: {
        type: String,
        required: [true, "Category is required"]
    },

    stock: {
        type: Number,
        required: [false, "You may consider updating stock"],
        defualt : 0
    },

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true })

const Products = new mongoose.model("Products", ProductSchema)

module.exports = Products;