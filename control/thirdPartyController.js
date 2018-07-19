const bcrypt = require('bcrypt');
const { User, Positions, Symbols, Assets, Company, Commission, Leverage } = require("../models");
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');
const logger = require('../utils/logger');
const secretKey = 'tradeSecretKey';

exports.createUser = async (req, res) => {
    try {
        const { name, email, balance, companyEmail, type, password, leverage } = req.body;
        const saltRounds = 10;
        const createdAt = Date.now();
        const SameUser = await User.findOne({ where: { email: email } });
        if (SameUser) {
            if (SameUser.type == type) {
                return res.status(500).send({ message: "The user already existed!" })
            }
        }
        const user = await User.create({ name: name, email: email, password: password, balance: balance, usedMargin: 0, allow: "Allow", token: jwt.sign({ password }, secretKey), companyEmail: companyEmail, type: type, leverage: leverage, createdAt: createdAt });
        user.save();
        return res.status(200).send({ message: "created successfully", });
    } catch (err) {
        logger("error", "thirdPartyController", `Create User | ${err.message}`);
        return res.status(500).send({ message: "An error occurred while creating user" });
    }
}

exports.blockUser = async (req, res) => {
    try {
        const { email } = req.body;
        await User.update({ allow: "Block" }, { where: { email } });
        return res.status(200).json("Success");
    } catch (error) {
        logger("error", "thirdPartyController", `Block User | ${err.message}`);
        return res.status(500).json("Failed");
    }
}

exports.createCompany = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const company = await Company.create({ email: email, password: password, role: role });
        await Leverage.create({
            companyEmail: email,
            Forex: 1,
            Indices: 1,
            Crypto: 1,
            Futures: 1,
        });
        await Commission.create({
            companyEmail: email,
            Forex: 0.03,
            Indices: 0,
            Crypto: 0.03,
            Futures: 0.03,
        });
        return res.status(200).send({ message: "Company created successfully" });
    } catch (err) {
        logger("error", "thirdPartyController", `Create Company | ${err.message}`);
        return res.status(200).send({ message: "An error occurred while creating companies" })
    }
}