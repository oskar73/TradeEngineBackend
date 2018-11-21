const MD5 = require('md5.js');
const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
    const Commission = sequelize.define(
        "Commission",
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
                type: Sequelize.DOUBLE(20,6),
                allowNull: false,
            },
            Indices: {
                type: Sequelize.DOUBLE(20,6),
                allowNull: false,
            },
            Crypto: {
                type: Sequelize.DOUBLE(20,6),
                allowNull: false,
            },
            Futures: {
                type: Sequelize.DOUBLE(20,6),
                allowNull: false,
            },
        },
        {
            tableName: "commission",
            freezeTableName: true,
            timestamps: true,
        }
    );

    Commission.migrate = async () => {
        await Commission.destroy({ truncate: true });
        await Commission.create({
            companyEmail: "admin@gmail.com",
            Forex: 0.03,
            Indices: 0,
            Crypto: 0.03,
            Futures: 0.03,
        });
        // await Commission.destroy({ truncate: true });
    }

    return Commission;
}