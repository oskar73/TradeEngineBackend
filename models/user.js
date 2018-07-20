const MD5 = require('md5.js');
const bcrypt = require('bcrypt');
// const company = require('./company');
const jwt = require('jsonwebtoken');
const secretKey = 'tradeSecretKey';

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        "User",
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
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            companyEmail: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'admin@gmail.com'
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            token: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            balance: {
                type: Sequelize.DOUBLE(20, 2),
                allowNull: false,
                defaultValue: 10000
            },
            usedMargin: {
                type: Sequelize.DOUBLE(20, 2),
                allowNull: false,
                defaultValue: 0
            },
            allow: {
                type: Sequelize.ENUM("Allow", "Block"),
                allowNull: false,
            },
            totalProfit: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 0,
            },
            type : {
                type: Sequelize.ENUM("Phase1", "Phase2", "Live"),
                allowNull: false,
            },
            leverage : {
                type: Sequelize.DOUBLE(20, 2),
                allowNull: false,
                default: 1,
            }
        },
        {
            tableName: "users",
            freezeTableName: true,
            timestamps: true,
        }
    );

    User.migrate = async () => {
        // const count = await User.count();

        // if (!count) {
            await User.destroy({ truncate: true });
        //     const saltRounds = 10;
        //     const hashedPassword = await bcrypt.hash("123456", saltRounds);

        //     await User.create({
        //         email: "test@gmail.com",
        //         name: "Admin",
        //         companyEmail: "admin@gmail.com",
        //         password: hashedPassword,
        //         allow: "Allow",
        //         type: "Demo",
        //         token:  jwt.sign({hashedPassword, type:"Demo"}, secretKey)
        //     })
            
        //     await User.create({
        //         email: "test@gmail.com",
        //         name: "Admin",
        //         companyEmail: "admin@gmail.com",
        //         password: hashedPassword,
        //         allow: "Allow",
        //         type: "Live",
        //         token: jwt.sign({hashedPassword, type:"Live"}, secretKey)
        //     })
        // // }
    };

    return User; 
}