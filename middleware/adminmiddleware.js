const { Company } = require("../models");

exports.adminmiddleware = async (req, res, next) => {
    const token = req.headers.authorization || "";
    if (token == "") {
        res.status(401).json({ state: "No Vailed Token! Please Login Again!" });
        return
    }
    const company = await Company.findOne({ where: { token } });
    if (!company) {
        res.status(401).json({ state: "No Vailed Token! Please Login Again!" });
        return
    }
    next();
}
