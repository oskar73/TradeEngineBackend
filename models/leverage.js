const MD5 = require('md5.js');
const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
    const Leverage = sequelize.define(
        "Leverage",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            companyEmail: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            Forex: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            Indices: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            Crypto: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            Futures: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "leverage",
            freezeTableName: true,
            timestamps: true,
        }
    );

    Leverage.migrate = async () => {
        await Leverage.destroy({ truncate: true });
        await Leverage.create({
            companyEmail: "admin@gmail.com",
            Forex: 1,
            Indices: 1,
            Crypto: 1,
            Futures: 1,
        });
        // await Leverage.destroy({ truncate: true });
    }

    return Leverage;
}