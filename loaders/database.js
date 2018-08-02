const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const database = require("../models")
const config = require("../config/main");
const logger = require("../utils/logger");

module.exports = async () => {
    try {
        try {
            const conn = await mysql.createConnection({
                host: config.database.host,
                user: config.database.user,
                password: config.database.pass,
                port: config.database.port,
            });

            logger("info", "Database", `Database (${config.database.name}) creating...`);

            await conn.query("CREATE DATABASE `" + config.database.name + "` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;");
        } catch (error) {
            if (error.code == "ER_DB_CREATE_EXISTS") {
                logger("warn", "Database", `Database already exists. (${config.database.name})`);
            } else {
                logger("error", "Database", `Database creating failed... ${error.message}`);
                process.exit(0);
            }
        }

        // synchronize
        await database.sync();

    } catch (error) {
        logger("error", "Database", `Database connect failed... ${error.message}`);

        process.exit(0);
    }
}