const { Sequelize,DataTypes } = require('sequelize');
const db = require ('../config/database');

const Sensor = db.define('sensor', {
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
    sensorName:{
        type: DataTypes.STRING
    },
    sensorLabel: {
        type: DataTypes.STRING
    },
    sensorValue:{
        type: DataTypes.STRING,
        defaultValue: '0'
    },
    sensorStyle:{
        type: DataTypes.STRING
    },
    symbol: {
        type: DataTypes.STRING
    }

});

module.exports = Sensor;