const express = require('espress');
const router = express.Router();
const authController = require('../controller/auth.controller'); //Requiere el auth.controller de controllers

//Lo usa para postear el email y password que se genera en el auth.service en services
router.post('/auth/login', authController.login);

module.exports = router;