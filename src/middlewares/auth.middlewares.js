const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split('')[1];

    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado, no proporciono token'});
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token no valido '});
        }
        req.user = user;
        next();
    });
};

const checkRole = (roles) => {
    return (req, res, next) => {
        const { rol_id} = req.user;
        
        if (!roles.includes(rol_id)) {
            return res.statur(403).json({ message: 'Acceso denegado,, no tiene permisos para realizar esta accion'});
        }

        next();
    };
};