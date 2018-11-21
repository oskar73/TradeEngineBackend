const { User } = require("../models");

exports.authmiddleware = async (req, res, next) => {
    const token = req.headers.authorization || "";
    if (token == "") {
        return res.status(200).json({ state: "No Vailed Token! Please Login Again!" });
    }
    const user = await User.findOne({ where: { token } });
    if (!user) {
        return res.status(200).json({ state: "No Vailed Token! Please Login Again!" });
    }
    if(user.allow == "Block") {
        return res.status(200).json({ message: "Blocked Account"})
    }
    req.user_id = user.id
    next();
}
