const express = require('express');
const router = express.Router();
//Se importa el user controler para gestion de usuarios
const userController = require('../controllers/user.controller'); 
//Se importa el middlware de la autenticacion y el checkeo
const { authenticateToken, checkRole } = require('../middleware/auth.middleware');
//Se importan carpetas ROLES de la nueva carpeta utils
const ROLES = require('../utils/constants');
//Maneja los errores de forma centralizada
const errorHandler = require('../middleware/error.middleware');

// Ruta de usuarios
//Todos los endpoints son para users (Primer metodo create o post)
//Se genera la autenticacion, y el checkeo de si el usuario es administrador
router.post('/users/create', authenticateToken, checkRole([ROLES.ADMIN]), userController.createUser);
//Se le pasa el id del usuario como parametro (Segundo metodo update o put)
router.put('/users/update/:id', authenticateToken, checkRole([ROLES.ADMIN]), userController.updateUser);
//Obtiene todos los usuarios administrados por un administrador (Tercer metodo get)
router.get('/users', authenticateToken, checkRole([ROLES.ADMIN]), userController.getAllUsersByAdministradorId);
//Similar al update y se le pasa el id del usuario como parametro (Cuarto metodo delete)
router.delete('/users/delete/:id', authenticateToken, checkRole([ROLES.ADMIN]), userController.deleteUser);
//Tambien se le pasa el id del usuario como parametro (Quinto metodo get)
//Trae todos los usuarios con un rol especifico
router.get('/users/rol/:id', authenticateToken, checkRole([ROLES.ADMIN]), userController.getAllUsersByRolId);

// Middleware para manejar errores
router.use(errorHandler);

module.exports = router;
