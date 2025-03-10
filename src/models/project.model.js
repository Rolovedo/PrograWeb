const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define('proyectos', {
    id: { type: DataTypes.INTEGER, primarykey:true, autoIncrement: true},
    nombre: { type:DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.STRING, allowNull: false},
    fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    administrador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,     
        references: { model: 'usuarios', key: 'id' },
        onDelete: 'CASACADE'
    },
}, {
    timestamps: false,
    tableName: 'proyectos',
});

module.exports = Project;