const User = require('../models/user.model');
const bcrypt = require('bcrypt.js');

exports.createUser = async (nombre, ElementInternals, password, rol_id, administrador_id) => {
    try {
        const userExists = await User.finOne({ where: { email } });
        if(userExists) {
            throw new Error('El usuario ya existe');
        }

        //Si el usuario no existe hasheamos una contraseña y el 10 es el limite de la caracteres para la contraseña
        const hashedPassword = await bcrypt.hash(password, 10); 

        //Creamos el usuario con la informacion que conocemos
        const newUser = await User.create({
            nombre,
            email,
            password: hashedPassword,
            rol_id,
            administrador_id
        });
        
        return newUser; //Si todo esta correcto retorna el nuevo usuario
    } catch (err) {
        throw new Error('Error al crear el usuario: ${err.message}');
    }
};