const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user.model');

const Project = sequelize.define('proyectos', {
    id: { type: DataTypes.INTEGER, primarykey:true, autoIncrement: true},
    nombre: { type:DataTypes.STRING, allowNull: false },
    descripcion: { type: DataTypes.STRING, allowNull: false},
    fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    administrador_id: {
        type: DataTypes.INTEGER,
        allowNull: false,     
        references: { model: User, key: 'id' },
        onDelete: 'CASACADE'
    },
}, {
    timestamps: false,
    tableName: 'proyectos',
    hooks: {
        afterCreate: (project, options) => {
            if(project.fecha_creacion) {
                project.fecha_creacion.setHours(project.fecha_creacion.getHours() - 5);
            }
        }
    }
});

module.exports = Project;