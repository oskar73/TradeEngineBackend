const Sequelize = require('sequelize');
const config = require("../config/main");

const sequelize = new Sequelize(config.database.name, config.database.user, config.database.pass, {
    host: config.database.host,
    dialect: config.database.type,
    port: config.database.port,
    logging: config.database.logging,
    pool: {
        max: 30,
        min: 0,
        acquire:30000,
        idle: 10000,
    },
    timezone: "+03:00"
});

const db = {}
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./user")(sequelize, Sequelize);
db.Positions = require("./positions")(sequelize, Sequelize);
db.Symbols = require("./symbols")(sequelize, Sequelize);
db.Assets = require("./assets")(sequelize, Sequelize);
db.Company = require("./company")(sequelize, Sequelize);
db.Commission = require("./commission")(sequelize, Sequelize);
db.Leverage = require("./leverage")(sequelize, Sequelize);

db.sync = async () => {
    await db.sequelize.sync();

    Object.keys(db).forEach(async (modelName) => {
        if(db[modelName].associate) {
            await db[modelName].associate(db);
        }
    });

    await db["User"].migrate();
    await db["Positions"].migrate();
    await db['Company'].migrate();
    await db['Symbols'].migrate();
    await db['Assets'].migrate();
    await db['Commission'].migrate();
    await db['Leverage'].migrate();
};

module.exports = db