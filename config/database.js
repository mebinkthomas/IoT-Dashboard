const { Sequelize } = require('sequelize');
const config = require('./config.json');

module.exports = new Sequelize(config.dbname, config.username, config.dbpass, {
    host: 'localhost',
    dialect: 'postgres',
    pool: {
        max:5,
        min:0,
        acquire: 30000,
        idle: 10000
    }
});