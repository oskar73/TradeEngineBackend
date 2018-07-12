const MD5 = require('md5.js');
const bcrypt = require('bcrypt');
const leverage = require('./leverage');

module.exports = (sequelize, Sequelize) => {
    const Positions = sequelize.define(
        "Positions",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            userID: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            type: {
                type: Sequelize.ENUM("Sell", "Buy"),                     
                allowNull: false,
            },
            size: {
                type: Sequelize.DOUBLE(20, 6),
                allowNull: false,
                defaultValue: 0
            },
            symbolName: {
                type: Sequelize.STRING,                     
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM("Open", "Close"),
                allowNull: false,
            },
            startPrice: {
                type: Sequelize.DOUBLE(20, 6),
                allowNull: false,
                defaultValue: 1
            },
            stopPrice: {
                type: Sequelize.DOUBLE(20, 6),
                allowNull: true
            },
            stopLoss: {
                type: Sequelize.DOUBLE(20, 6),
                allowNull: true,
                defaultValue: 0
            },
            takeProfit: {
                type: Sequelize.DOUBLE(20, 6),
                allowNull: true,
                defaultValue: 0
            },
            commission: {
                type: Sequelize.DOUBLE(20, 6),
                allowNull: false,
            },
            leverage: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            realProfit: {
                type: Sequelize.DOUBLE(20, 6),
                allowNull: true,
            },
            closeReason: {
                type: Sequelize.ENUM("TakeProfit", "StopLoss", "UserClose", "None"),
                allowNull: true
            }
        },
        {
            tableName: "positions",
            freezeTableName: true,
            timestamps: true,
        }
    );

    Positions.migrate = async () => {
        await Positions.destroy({ truncate: true });
    }

    return Positions;
}