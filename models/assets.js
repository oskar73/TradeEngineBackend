const MD5 = require('md5.js');
const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
    const Assets = sequelize.define(
        "Assets",
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
            pip_size: {
                type: Sequelize.DOUBLE(20,6),
                allowNull: false,
            },
        },
        {
            tableName: "assets",
            freezeTableName: true,
            timestamps: true,
        }
    );

    Assets.migrate = async () => {
        await Assets.destroy({ truncate: true });
        await Assets.create({
            name: "Forex",
            pip_size: 0.0001,
        });
        await Assets.create({
            name: "Indices",
            pip_size: 0.0001,
        });
        await Assets.create({
            name: "Crypto",
            pip_size: 0.0001,
        });
        await Assets.create({
            name: "Futures",
            pip_size: 0.0001,
        });
    }

    return Assets;
}