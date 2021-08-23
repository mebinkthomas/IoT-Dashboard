const { Sequelize,DataTypes } = require('sequelize');
const db = require ('../config/database');

const Relay = db.define('relay', {
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user:{
        type: DataTypes.UUIDV4,
        allowNull: false
    },
    relayName:{
        type: DataTypes.STRING
    },
    relayLabel:{
        type: DataTypes.STRING
    },
    relayStatus:{
        type: DataTypes.STRING,
        defaultValue: '0'
    }

});

module.exports = Relay;