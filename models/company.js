const MD5 = require('md5.js');
const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
    const Company = sequelize.define(
        "Company",
        {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            token: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            role: {
                type: Sequelize.ENUM("Admin", "Company"),
                allowNull: false,
            },
        },
        {
            tableName: "company",
            freezeTableName: true,
            timestamps: true,
        }
    );

    Company.migrate = async () => {
       // const count = await Company.count();

        if (!count) {
            await Company.destroy({ truncate: true });
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash("123456", saltRounds);

            await Company.create({
                email: "admin@gmail.com",
                password: hashedPassword,
                role: "Admin",
            })
        }
    }

    return Company;
}