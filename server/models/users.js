const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    }, // hashed

    role: {
        type: String,
        enum: ['buyer', 'seller'], 
        default: 'buyer',
        lowercase : true,
    },

    address: {
        type: String,
        required: [true, "Address is required"]
    },
},{timestamps : true})

const User = new mongoose.model("User", UserSchema)

module.exports = User;