const User = require('./use.model');
const Project = require('./project.model');
const UserProject = require('./UserProject.model');

//Relaciones muchos a muchos
User.belongsToMany(Project, { through: UserProject, foreignkey: 'usuario_id', as: 'proyectos'});
Project.belongsToMany(User, { through: UserProject, foreignkey: 'proyecto_id', as: 'usuarios'});

//Relacion de administrador
Project,belongsTo(User, { foreignkey: 'administrador_id', as: 'administrador'});

module.exports = { User, Project, UserProject };