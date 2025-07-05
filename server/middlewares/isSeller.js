const User = require("../models/users")

module.exports = async (req,res,next) => {
    const role = req.user.role

    if(role==="seller"){
        next();
    }
    else{
        return res  
            .status(403)
            .json({error : "Only sellers can perform this action"})
    }
}