require("dotenv").config({path:"./config/config.env"})
const express = require("express")
const morgan = require("morgan")
const connectDB = require("./config/db")
// const auth = require("./middlewares/auth")
// const path = require("path")

const app = express();

//Serving Static uploads
app.use('/uploads', express.static('uploads'));

//middlewares
app.use(express.json());
app.use(morgan("tiny"));
app.use(require("cors")());

//routes
app.use("/api" , require("./routes/auth"))
app.use("/api" , require("./routes/sellers"))
app.use("/api", require("./routes/buyers"))
app.use("/api",require("./routes/cart"))

const PORT = process.env.PORT || 8000;

app.listen(PORT , async()=>{
    try {
        await connectDB();
        console.log(`Server started listening on PORT : ${PORT}`)
    } 
    catch (err) {
        console.log(err);
    }
})