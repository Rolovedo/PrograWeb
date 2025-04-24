const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.createUser = async (nombre, email, password, rol_id, administrador_id) => {
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
        throw new Error(`Error al obtener los usuarios: ${err.message}`);
    }
};

//Se usa el async para que sea asincrona y usar el await
//Se usa para listar los usuarios vinculados al administrador 
exports.getAllUsersByAdministradorId = async (administrador_id, email) => {
    try {

        //Se usa como condicion de busqueda en la base de datos
        const WhereClause = { administrador_id };
        if (email) {
            
            //Hace que la consulta sea masa especifica
            WhereClause.email = email; //Se busca si el parametro email fue proporcionado
        }
        
        //Se usa una consulta con el modelo user y excluye el password para mantener la seguridad
        const users = await User.findAll({ where: WhereClause, attrtbutes: { exclude: ['password'] }});
        return users;
    } 

    //Se finaliza con el manejo de errores si algo falla en la consulta
    catch (err) {
        throw new Error(`Error al obtener los usuarios: ${err.message}`)
    }
};

//Se filtran los usuarios por medio del rol_id
exports.getAllUsersByRolId = async (rol_id) => {
    try {
        
        //Se usa la busqueda por medio del rol_id como filtro excluyendo el password
        const users = await User.findAll({ where: { rol_id }, attributes: { exclude: ['password'] } });
        
        //Retorna todos los usuarios consultados
        return users;
    } 

    //Al final se hace el error siempre por si algo sale mal
    catch (err) {
        throw new Error(`Error al obtener los usuarios: ${err.message}`);
    }
};

//Actualiza el usuario con todos los parametros que se han ingresado
exports.updateUser = async (id, nombre, email, rol_id, administrador_id, admin_from_token) => {
    try {

        //findByPk (Find by primary key) del modelo user que saca el id del usuario
        const user = await User.findByPk(id);

        //Compara el administrador_id con el token
        if (user.administrador_id != admin_from_token) {

            //Si los id no coinciden muestra el error a accesso denegado
            throw new Error('Acceso denegado, este usuario no está bajo su administración');
        }

        //Verifica si el ususario existe
        if (!user) {

            //Si no existe saca el error del usuario no encontrado
            throw new Error('Usuario no encontrado');
        }

        //Comprueba si el campo email fue proporcionado y si es diferente al email actual del usuario
        if (email && email !== user.email) {

            //Busca en la base de datos si hay otro usuario con el mismo email
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {

                //En caso de encontrar otro usuario lanza este error diciendo que esta en uso el email
                throw new Error('El email ya está en uso');
            }
        }

        //Si no existen errores, actualiza el usuario con la informacion proporcionada
        await user.update({
            nombre,
            email,
            rol_id,
            administrador_id
        });

        return user;
    } 

    //Si existe error lo lanzamos para el manejo de errores
    catch (error) {
        throw new Error(`Error al actualizar usuario: ${error.message}`);
    }
};

//Elimina el usuario de la base de datos buscandolo por el id
exports.deleteUser = async (id, admin_from_token) => {
    try {

        //Busca el usuario por su id
        const user = await User.findByPk(id);

        //Compara administrador_id y el token
        if (user.administrador_id !== admin_from_token) {

            //Si no coinciden saca este error con acceso denegado
            throw new Error('Acceso denegado, este usuario no está bajo su administración');
        }

        //Verifica si el ususarios NO existe
        if (!user) {

            //Lanza el error si el usuario no fue encontrado
            throw new Error('Usuario no encontrado');
        }

        //Si pasan los filtros se elimina correctamente el usuario
        await user.destroy();

        //Arroja un mensaje de eliminacion con exito
        return { message: 'Usuario eliminado con éxito' };
    } 

    //En caso de existir error se va al manejo de errores
    catch (err) {
        throw new Error(`Error al eliminar el usuario: ${err.message}`);
    }
};