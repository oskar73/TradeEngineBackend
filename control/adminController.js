const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const { User, Positions, Symbols, Assets, Company, Commission, Leverage } = require("../models");
const jwt = require('jsonwebtoken');
const { json } = require('body-parser');
const symbols = require('../models/symbols');
const company = require('../models/company');
const positions = require('../models/positions');
const secretKey = 'tradeSecretKey';

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const company = await Company.findOne({ where: { email: email } });
        if (company) {
            if (company.role != "Admin") {
                return res.status(401).json({ state: false, message: "Invaild company" });
            }
            const result = await bcrypt.compare(password, company.password);
            if (result) {
                const payload = { id: company.id, password: company.password };
                const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
                await Company.update({ token: token }, { where: { id: company.id } });
                return res.status(200).json({ state: true, token: token });
            } else {
                return res.status(401).json({ state: false, message: "Invalid Company" });
            }
        } else {
            return res.status(401).json({ state: false, message: "Invalid Company" });
        }
    } catch (error) {
        return res.status(500).json({ state: false, message: "An error occurred during authentication." });
    }
}

exports.getUsers = async (req, res) => {
    try {
        const token = req.headers.authorization || "";
        const decodedToken = jwt.verify(token, secretKey);
        const company = await Company.findAll({ attributes: ['email'] });
        const originCompany = await Company.findOne({ where: { id: decodedToken.id } });
        const users = await User.findAll({ where: { companyEmail: originCompany.email } });
        const companyEmail = company.map(item => item.email);
        return res.status(200).send({ users: users, companyEmail: companyEmail });
    } catch (error) {
        return res.status(500).send({ message: "An error occurred while fetching users." });
    }
}

exports.createUser = async (req, res) => {
    try {
        const { name, email, balance, companyEmail, type } = req.body;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash("123456", saltRounds);
        const createdAt = Date.now();
        const SameUser = await User.findOne({ where: { email: email } });
        if (SameUser) {
            if (SameUser.type == type) {
                return res.status(500).send({ message: "The user already existed!" })
            }
        }
        const user = await User.create({ name: name, email: email, password: hashedPassword, balance: balance, usedMargin: 0, allow: "Allow", token: jwt.sign({ hashedPassword }, secretKey), companyEmail: companyEmail, type: type, createdAt: createdAt });
        user.save();
        return res.status(200).send({ message: "created successfully", });
    } catch (err) {
        console.log("this is a err", err);
        return res.status(500).send({ message: "An error occurred while creating user" });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { userId, name, email, password, balance, allow, usedMargin, companyEmail } = req.body;
        const saltRounds = 10;
        let hashedPassword = '';
        if (password.length) {
            hashedPassword = await bcrypt.hash(password, saltRounds);
        } else {
            hashedPassword = await bcrypt.hash("123456", saltRounds);
        }
        const updatedAt = Date.now();
        const user = await User.update({ name: name, email: email, password: hashedPassword, balance: balance, usedMargin: usedMargin, allow: allow, companyEmail: companyEmail, updatedAt: updatedAt }, { where: { id: userId } });
        return res.status(200).send({ message: "Updating successfully", updatedOne: user });
    } catch (err) {
        return res.status(500).send({ message: "An error occured while updating user" });
    }
}

exports.deleteUser = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).send({ message: 'Cannot find the user' });
        }
        await User.destroy({ where: { id: userId } });
        return res.status(200).send({ message: "Successfully deleted" });
    } catch (error) {
        return res.status(500).send({ message: 'An error occurred while deleting the user.' });
    }
}

exports.getSymbols = async (req, res) => {
    try {
        const symbols = await Symbols.findAll();
        const assets = await Assets.findAll({ attributes: ['name'] });
        const assetNames = assets.map(item => item.name);
        return res.status(200).send({ symbols: symbols, assetNames: assetNames });
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'An error occurred while fetching symbols' });
    }
}

exports.updateSymbol = async (req, res) => {
    try {
        const { name, type, code, assetName, symbolId } = req.body;
        const updatedAt = Date.now();
        const symbol = await Symbols.update({ name: name, type: type, code: code, assetName: assetName, updatedAt: updatedAt }, { where: { id: symbolId } });
        return res.status(200).send({ message: "Edit symbol successfully" });
    } catch (err) {
        return res.status(500).send({ message: "An error occured while editing symbol" });
    }
}

exports.createSymbol = async (req, res) => {
    try {
        const { name, type, code, assetName } = req.body;
        const createdAt = Date.now();
        const symbol = await Symbols.create({ name: name, type: type, code: code, assetName: assetName, createdAt: createdAt });
        symbol.save();
        return res.status(200).send({ message: 'Create symbol successfully' })
    } catch (err) {
        return res.status(500).send({ message: 'An error occured while creating symbol' })
    }
}

exports.deleteSymbol = async (req, res) => {
    try {
        const { symbolId } = req.body;
        const symbol = await Symbols.findOne({ where: { id: symbolId } });
        if (!symbol) {
            return res.status(404).send({ message: 'Cannot find the user' });
        }
        await Symbols.destroy({ where: { id: symbolId } });
        return res.status(200).send({ message: "Successfully deleted" });
    } catch (err) {
        return res.status(500).send({ message: "An error occurred while deleting symbol" });
    }
}

exports.getAssets = async (req, res) => {
    try {
        const assets = await Assets.findAll();
        return res.status(200).send({ assets: assets });
    } catch (err) {
        return res.status(500).send({ message: 'An error occurred while fetching Assets' });
    }
}

exports.updateAsset = async (req, res) => {
    try {
        const { name, pip_size, assetId} = req.body;
        const updatedAt = Date.now();
        await Assets.update({ name: name, pip_size: pip_size, updatedAt: updatedAt }, { where: { id: assetId } });
        return res.status(200).send({ message: "Edit symbol successfully" });
    } catch (err) {
        return res.status(500).send({ message: "An error occured while editing Assets" });
    }
}

exports.createAsset = async (req, res) => {
    try {
        const { name, pip_size } = req.body;
        const createdAt = Date.now();
        const asset = await Assets.create({ name: name, pip_size: pip_size, createdAt: createdAt });
        asset.save();
        return res.status(200).send({ message: 'Create symbol successfully' })
    } catch (err) {
        return res.status(500).send({ message: 'An error occured while creating Assets', err })
    }
}

exports.deleteAsset = async (req, res) => {
    try {
        const { assetId } = req.body;
        const asset = await Assets.findOne({ where: { id: assetId } });
        if (!asset) {
            return res.status(404).send({ message: 'Cannot find the user' });
        }
        await Assets.destroy({ where: { id: assetId } });
        return res.status(200).send({ message: "Successfully deleted" });
    } catch (err) {
        return res.status(500).send({ message: "An error occurred while deleting symbol" });
    }
}

exports.getPositions = async (req, res) => {
    try {
        const token = req.headers.authorization || "";

        if (!token) {
            return res.status(401).send({ message: 'Authorization token is required' });
        }

        const decodedToken = jwt.verify(token, secretKey);
        const originCompany = await Company.findOne({ where: { id: decodedToken.id } });

        if (!originCompany) {
            return res.status(404).send({ message: 'Company not found' });
        }

        const users = await User.findAll({ where: { companyEmail: originCompany.email } });
        const userIds = users.map(user => user.id);

        const positions = await Positions.findAll({
            where: {
                userId: userIds
            }
        });

        return res.status(200).send({ positions });
    } catch (err) {
        console.error('Error fetching positions:', err);
        return res.status(500).send({ message: 'An error occurred', error: err.message });
    }
}

exports.getCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll();
        return res.status(200).send({ companies: companies });
    } catch (err) {
        return res.status(200).send({ message: "An error occurred while fetching companies" })
    }
}

exports.createCompany = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        let hashedPassword = '';
        const saltRounds = 10;
        if (password.length) {
            hashedPassword = await bcrypt.hash(password, saltRounds);
        } else {
            hashedPassword = await bcrypt.hash('123456', saltRounds);
        }
        const company = await Company.create({ email: email, password: hashedPassword, role: role });
        company.save();
        return res.status(200).send({ message: "Company created successfully" });
    } catch (err) {
        return res.status(200).send({ message: "An error occurred while creating companies" })
    }
}

exports.updateCompany = async (req, res) => {
    try {
        const { companyId, email, password, role } = req.body;
        const saltRounds = 10;
        let hashedPassword = '';
        if (password.length) {
            hashedPassword = await bcrypt.hash(password, saltRounds);
        } else {
            hashedPassword = await bcrypt.hash("123456", saltRounds);
        }
        const updatedAt = Date.now();
        await Company.update({ password: hashedPassword, email: email, role: role, updatedAt: updatedAt }, { where: { id: companyId } });
        return res.status(200).send({ message: "Updating successfully" });
    } catch (err) {
        return res.status(500).send({ message: "An error occured while updating company" });
    }
}

exports.deleteCompany = async (req, res) => {
    try {
        const { companyId } = req.body;
        const company = await Company.findOne({ where: { id: companyId } });
        if (!company) {
            return res.status(404).send({ message: 'Cannot find the company' });
        }
        await Company.destroy({ where: { id: companyId } });
        return res.status(200).send({ message: "Successfully deleted" });
    } catch (err) {
        return res.status(500).send({ message: "An error occurred while deleting company" });
    }
}

exports.getCommissions = async (req, res) => {
    try {
        const token = req.headers.authorization || "";
        const decodedToken = jwt.verify(token, secretKey);
        const originCompany = await Company.findOne({ where: { id: decodedToken.id } });
        const commissions = await Commission.findAll({ where: { companyEmail: originCompany.email } });
        return res.status(200).send({ commissions: commissions });
    } catch (err) {
        return res.status(200).send({ message: "An error occurred while fetching commissions" })
    }
}

exports.updateCommission = async (req, res) => {
    try {
        const { companyEmail, Forex, Indices, Crypto, Futures, commissionId } = req.body;
        const updatedAt = Date.now();
        await Commission.update({ companyEmail: companyEmail, Forex: Forex, Indices: Indices, Crypto: Crypto, Futures: Futures, updatedAt: updatedAt }, { where: { id: commissionId } });
        return res.status(200).send({ message: "Edit commission successfully" });
    } catch (err) {
        return res.status(500).send({ message: "An error occured while editing commission" });
    }
}

exports.createCommission = async (req, res) => {
    try {
        const { companyEmail, Forex, Indices, Crypto, Futures} = req.body;
        const createdAt = Date.now();
        const commission = await Commission.create({ companyEmail: companyEmail, Forex: Forex, Indices: Indices, Crypto: Crypto, Futures: Futures, createdAt: createdAt });
        commission.save();
        return res.status(200).send({ message: 'Create Commission successfully' })
    } catch (err) {
        return res.status(500).send({ message: 'An error occured while creating Commission', err })
    }
}

exports.deleteCommission = async (req, res) => {
    try {
        const { commissionId } = req.body;
        const commission = await Commission.findOne({ where: { id: commissionId } });
        if (!commission) {
            return res.status(404).send({ message: 'Cannot find the user' });
        }
        await Commission.destroy({ where: { id: commissionId } });
        return res.status(200).send({ message: "Successfully deleted" });
    } catch (err) {
        return res.status(500).send({ message: "An error occurred while deleting commission" });
    }
}

exports.getLeverages = async (req, res) => {
    try {
        const token = req.headers.authorization || "";
        const decodedToken = jwt.verify(token, secretKey);
        const originCompany = await Company.findOne({ where: { id: decodedToken.id } });
        const leverage = await Leverage.findAll({ where: { companyEmail: originCompany.email } });
        return res.status(200).send({ leverages: leverage });
    } catch (err) {
        console.log("GetLeveraged | ", err);
        return res.status(500).send({ message: "An error occurred while fetching leverages" })
    }
}

exports.updateLeverage = async (req, res) => {
    try {
        const { companyEmail, Forex, Indices, Crypto, Futures, leverageId } = req.body;
        const updatedAt = Date.now();
        await Leverage.update({ companyEmail: companyEmail, Forex: Forex, Indices: Indices, Crypto: Crypto, Futures: Futures, updatedAt: updatedAt }, { where: { id: leverageId } });
        return res.status(200).send({ message: "Edit leverage successfully" });
    } catch (err) {
        return res.status(500).send({ message: "An error occured while editing leverage" });
    }
}

exports.createLeverage = async (req, res) => {
    try {
        const { companyEmail, Forex, Indices, Crypto, Futures } = req.body;
        const createdAt = Date.now();
        const leverage = await Leverage.create({ companyEmail: companyEmail, Forex: Forex, Crypto: Crypto, Indices: Indices, Futures: Futures, createdAt: createdAt });
        leverage.save();
        return res.status(200).send({ message: 'Create Leverage successfully' })
    } catch (err) {
        return res.status(500).send({ message: 'An error occured while creating Leverage', err })
    }
}

exports.deleteLeverage = async (req, res) => {
    try {
        const { leverageId } = req.body;
        const leverage = await Leverage.findOne({ where: { id: leverageId } });
        if (!leverage) {
            return res.status(404).send({ message: 'Cannot find the leverage' });
        }
        await Leverage.destroy({ where: { id: leverageId } });
        return res.status(200).send({ message: "Successfully deleted" });
    } catch (err) {
        return res.status(500).send({ message: "An error occurred while deleting leverage" });
    }
}