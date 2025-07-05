const router = require("express").Router()
const bcrypt = require("bcrypt");
const User = require("../models/users");
const jwt = require("jsonwebtoken");

const auth = require("../middlewares/auth")

router
    //Register New User
    .post("/register", async (req, res) => {
        const { name, email, password, address, role } = req.body;

        //Should have all fields
        if (!name || !email || !password || !address || !role) {
            return res
                .status(400)
                .json({ error: "Please enter all the fields" });
        }

        //Name validation
        if (name.length > 25) {
            return res
                .status(400)
                .json({ error: "Name cannot have more than 25 characters" })
        }
        //Email validation
        const emailReg = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/

        if (!emailReg.test(email)) {
            return res
                .status(400)
                .json({ error: "Incorrect Email-ID" })
        }

        //Password validation
        if (password.length < 6) {
            return res
                .status(400)
                .json({ error: "Password must be atleast 6 characters long" })
        }

        try {
            const doesUserAlreadyExist = await User.findOne({ email });

            if (doesUserAlreadyExist) {
                return res
                    .status(400)
                    .json({ error: `Email ${email} already registered` });
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const newUser = new User({ name, email, password: hashedPassword, address, role });

            const result = await newUser.save();

            result._doc.password = undefined;
            return res.status(200).json({ ...result._doc })
        }
        catch (err) {
            console.log(err)
            return res
                .status(500)
                .json({ error: err.message })
        }
    })

    //Login existing user
    .post("/login", async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Please enter all the fields" });
        }
        //Email validation
        const emailReg = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/

        if (!emailReg.test(email)) {
            return res
                .status(400)
                .json({ error: "Incorrect Email-ID" })
        }

        try {
            const doesUserExist = await User.findOne({ email })

            if (!doesUserExist) {
                return res
                    .status(400)
                    .json({ error: "Incorrect email or password" })
            }

            const doesPasswordMatch = await bcrypt.compare(password, doesUserExist.password);

            if (!doesPasswordMatch) {
                return res
                    .status(400)
                    .json({ error: "Incorrect email or password" })
            }

            const payload = { _id: doesUserExist._id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

            const user = { ...doesUserExist._doc, password: undefined }
            return res.status(200).json({ token, user })
        }
        catch (err) {
            console.log(err);
            return res
                .status(500)
                .json({ error: err.message })
        }
    })

    //Login using JWT token
    .get("/auto_login", auth, async (req, res) => {
        try {
            const { _id, name, email, role } = req.user;
            return res
                .status(200)
                .json({
                    success: true,
                    user: { _id, name, email, role }
                })
        }
        catch (err) {
            return res
                .status(500)
                .json({ error: err.message })
        }
    })

    //Fetching User
    .get("/me", auth, async (req, res) => {
        return res.status(200).json({ ...req.user._doc })
    })

    //Editing User Data
    .patch("/update", auth, async (req, res) => {
        const { name, email, address } = req.body;
        const userId = req.user.id;

        if (!name || !email || !address) {
            return res
                .status(400)
                .json({ error: "Please enter all the fields" });
        }

        //Name validation
        if (name.length > 25) {
            return res
                .status(400)
                .json({ error: "Name cannot have more than 25 characters" })
        }
        //Email validation
        const emailReg = /[a-z0-9\._%+!$&*=^|~#%'`?{}/\-]+@([a-z0-9\-]+\.){1,}([a-z]{2,16})/

        if (!emailReg.test(email)) {
            return res
                .status(400)
                .json({ error: "Incorrect Email-ID" })
        }

        try {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ error: "User not found" });
            const doesUserAlreadyExist = await User.findOne({ email });

            if (doesUserAlreadyExist && doesUserAlreadyExist._id.toString() !== userId) {
                return res
                    .status(400)
                    .json({ error: `Email ${email} already in use` });
            }

            user.name = name;
            user.email = email;
            user.address = address;

            const result = await user.save();

            return res
                .status(200)
                .json({ success: true, ...result._doc })
        }
        catch (err) {
            return res
                .status(500)
                .json({ error: err.message })
        }
    })
    
    //Changing Password
    .patch("/password", auth, async (req, res) => {
        const {currentPassword , newPassword , confirmPassword} = req.body;
        const userId = req.user.id;
        // return res.json({message : "Hello"});
        
        try {
            const user = await User.findById(userId)
            if (!user) return res.status(404).json({ error: "User not found" });

            const doesPasswordMatch = await bcrypt.compare(currentPassword, user.password);

            if (!doesPasswordMatch) {
                return res
                    .status(400)
                    .json({ error: "Wrong password" });
            }

            if(newPassword !== confirmPassword){
                return res
                    .status(404)
                    .json({error : "Passwords do not match"});
            }

            const hashedPassword = await bcrypt.hash(newPassword, 12);
            user.password = hashedPassword;

            const result = await user.save();

            return res
                .status(200)
                .json({success : true , ...result._doc});
        } 
        catch (err) {
            return res
                .status(500)
                .json({error : err.message})
        }   
    })

module.exports = router;