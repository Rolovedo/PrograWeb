const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rol = sequelize.define('roles', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
    timestamps: false,
    tableName: 'roles',
});

module.exports = Rol;