const mongoose = require("mongoose")

const connectDB = async()=>{
    return mongoose 
        .connect("mongodb://localhost/e_commerce")
        .then(()=>{
            console.log("Connection to database established.....")
        })
        .catch((err)=>{console.log(err)})
}

module.exports = connectDB