const express = require('express');
const router = express.Router();
//Se importa el project controller para gestión de proyectos
const projectController = require('../controllers/project.controller'); 
//Se importa el middleware de la autenticación y el checkeo
const { authenticateToken, checkRole } = require('../middleware/auth.middleware');
//Se importan carpeta ROLES de la nueva carpeta utils
const ROLES = require('../utils/constants');

// Ruta de proyectos
//Todos los endpoints son para proyectos (Primer método create o post)
//Se genera la autenticación, y el checkeo de si el usuario es administrador
router.post('/projects/create', authenticateToken, checkRole([ROLES.ADMIN]), projectController.createProject);
//Se le pasa el id del proyecto como parámetro (Segundo método update o put)
router.put('/projects/update', authenticateToken, checkRole([ROLES.ADMIN]), projectController.updateProject);
//Obtiene todos los proyectos administrados por un administrador (Tercer método get)
router.get('/projects', authenticateToken, checkRole([ROLES.ADMIN, ROLES.USER]), projectController.getAllProjectsByAdministradorId);
//Similar al update y se le pasa el id del proyecto como parámetro (Cuarto método delete)
router.delete('/projects/delete/:id', authenticateToken, checkRole([ROLES.ADMIN]), projectController.deleteProject);
//También se obtiene un proyecto específico por su id (Quinto método get)
router.get('/projects/:id', authenticateToken, checkRole([ROLES.ADMIN, ROLES.USER]), projectController.getProjectById);

router.post('/projects/associate', authenticateToken, checkRole([ROLES.ADMIN]), projectController.assigUsersToProject);
router.delete('/pojects/disassociate', authenticateToken, checkRole([ROLES.ADMIN]), projectController.removeUserToProject)


module.exports = router;