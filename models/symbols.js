const MD5 = require('md5.js');
const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
    const Symbols = sequelize.define(
        "Symbols",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            assetName: {
                type: Sequelize.ENUM("Forex", "Indices", "Crypto", "Futures"),
                allowNull: false,
            },
        },
        {
            tableName: "symbol",
            freezeTableName: true,
            timestamps: true,
        }
    );

    Symbols.migrate = async () => {
        await Symbols.destroy({ truncate: true });
        await Symbols.create({
            name: "EUR to USD",
            type: "FX:EURUSD",
            code: "EURUSD",
            assetName: "Forex",
        });
        await Symbols.create({
            name: "GBP to USD",
            type: "FX:GBPUSD",
            code: "GBPUSD",
            assetName: "Forex",
        });
        await Symbols.create({
            name: "USD to CHF",
            type: "FX:USDCHF",
            code: "USDCHF",
            assetName: "Forex",
        });
        await Symbols.create({
            name: "AUD to USD",
            type: "FX:AUDUSD",
            code: "AUDUSD",
            assetName: "Forex",
        });
        await Symbols.create({
            name: "USD to CAD",
            type: "FX:USDCAD",
            code: "USDCAD",
            assetName: "Forex",
        });
        await Symbols.create({
            name: "US30",
            type: "BLACKBULL:US30",
            code: "US30",
            assetName: "Indices",
        });
        await Symbols.create({
            name: "SPX500",
            type: "BLACKBULL:SPX500",
            code: "SPX500",
            assetName: "Indices",
        });
        await Symbols.create({
            name: "GER30",
            type: "BLACKBULL:GER30",
            code: "GER30",
            assetName: "Indices",
        });
        await Symbols.create({
            name: "BTC to USD",
            type: "CRYPTO:BTCUSD",
            code: "BTCUSD",
            assetName: "Crypto",
        });
        await Symbols.create({
            name: "ETH to USD",
            type: "CRYPTO:ETHUSD",
            code: "ETHUSD",
            assetName: "Crypto",
        });
        await Symbols.create({
            name: "USDT to USD",
            type: "CRYPTO:USDTUSD",
            code: "USDTUSD",
            assetName: "Crypto",
        });
        await Symbols.create({
            name: "Gold",
            type: "OANDA:XAUUSD",
            code: "XAUUSD",
            assetName: "Futures",
        });
        await Symbols.create({
            name: "Silver",
            type: "OANDA:XAGUSD",
            code: "XAGUSD",
            assetName: "Futures",
        });
        await Symbols.create({
            name: "Gas",
            type: "SKILLING:NATGAS",
            code: "NATGAS",
            assetName: "Futures",
        });
        await Symbols.create({
            name: "Oil",
            type: "EASYMARKETS:OILUSD",
            code: "OIL",
            assetName: "Futures",
        });
        
    }

    return Symbols;
}