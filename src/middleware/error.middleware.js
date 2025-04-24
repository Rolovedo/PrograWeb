const errorHandler = (err, req, res, next) => {
    console.error(err.stack);  // Registra el error en la consola

    // Si el error proviene de JWT (token inválido)
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Token inválido", error: err.message });
    }

    // Si el error es porque el token ha expirado
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expirado, inicia sesión nuevamente", error: err.message });
    }

    // Si es un error de Sequelize (por ejemplo, validación)
    if (err.name === "SequelizeValidationError") {
        return res.status(400).json({ message: "Error de validación", errors: err.errors.map(e => e.message) });
    }

    if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ message: "Error de unicidad", error: err.message });
    }

    // Si el error es porque falta autenticación
    if (err.message === "Acceso denegado, no se proporcionó un token") {
        return res.status(401).json({ message: err.message });
    }

    // Error por permisos insuficientes
    if (err.message === "Acceso denegado, no tienes permiso para realizar esta acción") {
        return res.status(403).json({ message: err.message });
    }

    // Otros errores internos del servidor
    res.status(500).json({ message: "Algo ha salido mal", error: err.message });
};

module.exports = errorHandler;
