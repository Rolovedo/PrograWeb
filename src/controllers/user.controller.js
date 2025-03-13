const userSErvice = require('../services/user.services');

exports.createUser = async (req, res) => {
    try {
        //Hacemos la primera validacion
        const { nombre, email, password, rol_id, administrador_id } = req.body;
        //Se crea el usuario con los campos que hemos pedido
        const newUser = await userSErvice.createUser(nombre, email, password, rol_id, administrador_id);
        //Mostramos la creacion con status 201 que muestra usuario creado con exito mostrando el usuario creado
        res.status(201).json({ message: 'Usuario creado con exito', user: newUser });
    } catch (err) {
        res.status(500).json({ message: err.message }); //Muestra el estado de error 500 en caso de no crear el usuario
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
};