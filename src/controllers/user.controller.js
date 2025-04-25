const userService = require('../services/user.services');

exports.createUser = async (req, res) => {
    try {
        
        //Hacemos la primera validacion
        const { nombre, email, password, rol_id, administrador_id } = req.body;
        
        //Se crea el usuario con los campos que hemos pedido
        const newUser = await userService.createUser(nombre, email, password, rol_id, administrador_id);
        
        //Mostramos la creacion con status 201 que muestra usuario creado con exito mostrando el usuario creado
        res.status(201).json({ message: 'Usuario creado con exito', user: newUser });
    } catch (err) {

        //Muestra el estado de error 500 en caso de no crear el usuario
        res.status(500).json({ message: err.message });
    }
};

//Relaciona los usuarios relacionados a un administrador especifico
exports.getAllUsersByAdministradorId = async (req, res) => {
    try {
        const admin_from_token = req.user.id;
        const { email } = req.query;

        //Llama a todos los usuarios
        const users = await userService.getAllUsersByAdministradorId(admin_from_token, email);
        
        //Responde al llamado listando a los usuarios que se requieren con un archivo .json
        res.status(200).json({ message: 'Usuarios consultados con éxito', users });
    }

    //Al final siempre el manejo de errores si algo paso mal 
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};

//Se usa el req (Almacenar la iniformaicion que se pide) y el res (La informacion con la que se responde al usuario)
exports.getAllUsersByRolId = async (req, res) => {
    try {

        //Utiliza el servicio de userservice para obtener la lista de los usuarios
        const users = await userService.getAllUsersByRolId(req.params.id);

        //Nos devuelve un mensaje de confirmacion con la lista de los usuarios .json
        res.status(200).json({ message: 'Usuarios consultados con éxito', users });
    } 

    //Mensaje de error por si algo sale mal
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error });
    }
};

//Controla la actualizacion de un usuario en la base de datos
exports.updateUser = async (req, res) => {
    const { id } = req.params;

    //Extrae los campos del cuerpo de la solicitud con req.body
    const { nombre, email, rol_id, administrador_id } = req.body;

    //Agrega un usuario a la solicitud con el req y token
    const admin_from_token = req.user.id;
    
    try {

        //Llama al servicio updateservice de userservice pasando los parametros requeridos
        const user = await userService.updateUser(id, nombre, email, rol_id, administrador_id, admin_from_token);
        
        //SE genera una respuesta con status 200 y mensaje personalizado
        res.status(200).json({ message: 'Usuario actualizado con éxito', user });
    } 
    
    //Validacion de error con status 500 (Error interno del servidor)
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//Procesa la eliminacion de un usuario verificando el id del eliminado y que lo haga un administrador
exports.deleteUser = async (req, res) => {

    //Almacena los parametros con el id
    const { id } = req.params;

    //Verifica que el usuario este autenticado y pueda eliminar usuarios
    const admin_from_token = req.user.id;
    
    try {

        //Llama el metodo deleteuser de userservice pasando el id y el token
        const result = await userService.deleteUser(id, admin_from_token);
        
        //Respuesta con status 200 y almacena en una constante result
        res.status(200).json(result);
    } 
    
    //Manejo de errores por si hay alguna falla
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
