const { User } = require("../models");

exports.allowmiddleware = async (req, res, next) => {
    const token = req.headers.authorization || "";
    
    const user = await User.findOne({ where: { token } });
    
    if(user.allow == "Block") {
        return res.status(200).json({ message: "Blocked Account"})
    }
    req.user_id = user.id
    next();
}
