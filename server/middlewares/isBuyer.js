const User = require("../models/users")

module.exports = async (req,res,next) => {
    const role = req.user.role

    if(role==="buyer"){
        next();
    }
    else{
        return res  
            .status(403)
            .json({error : "Only customers can perform this action"})
    }
}