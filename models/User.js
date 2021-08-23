const { DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.define('user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey:true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING
    },
    email:{
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    }
});

module.exports = User;