const projectService = require('../services/project.services');

// Asigna usuarios a un proyecto específico
exports.assignUserToProject = async (req, res) => {
    try {
        const { projectId, userIds } = req.body;
        
        // Preparamos los datos para el servicio
        const data = {
            projectId: projectId,
            userIds: userIds
        };
        
        // Llamamos al servicio para asignar usuarios al proyecto
        const updatedProject = await projectService.assignUserToProject(data);
        
        // Respondemos con el proyecto actualizado
        res.status(200).json({ 
            message: 'Usuarios asignados al proyecto con éxito', 
            project: updatedProject 
        });
    } catch (err) {
        // Manejo de errores
        res.status(500).json({ message: err.message });
    }
};

// Elimina un usuario de un proyecto específico
exports.removeUserFromProject = async (req, res) => {
    try {
        const { projectId, userId } = req.body;
        
        // Preparamos los datos para el servicio
        const data = {
            projectId: projectId,
            userId: userId
        };
        
        // Llamamos al servicio para eliminar el usuario del proyecto
        await projectService.removeUserFromProject(data);
        
        // Respondemos con mensaje de éxito
        res.status(200).json({ 
            message: 'Usuario eliminado del proyecto con éxito'
        });
    } catch (err) {
        // Manejo de errores
        res.status(500).json({ message: err.message });
    }
};

exports.createProject = async (req, res) => {
    try {
        //Hacemos la primera validacion
        const { nombre, descripcion } = req.body;
        const administrador_id = req.user.id;
        
        //Se crea el proyecto con los campos que hemos pedido
        const newProject = await projectService.createProject(nombre, descripcion, administrador_id);
        
        //Mostramos la creacion con status 201 que muestra proyecto creado con exito mostrando el proyecto creado
        res.status(201).json({ message: 'Proyecto creado con éxito', project: newProject });
    } catch (err) {
        //Muestra el estado de error 500 en caso de no crear el proyecto
        res.status(500).json({ message: err.message });
    }
};

//Obtiene todos los proyectos de un administrador específico
exports.getAllProjectsByAdministradorId = async (req, res) => {
    try {
        const admin_from_token = req.user.id;
        const { nombre } = req.query;

        //Llama a todos los proyectos del administrador
        const projects = await projectService.getAllProjectsByAdministradorId(admin_from_token, nombre);
        
        //Responde al llamado listando los proyectos que se requieren con un archivo .json
        res.status(200).json({ message: 'Proyectos consultados con éxito', projects });
    }
    //Al final siempre el manejo de errores si algo paso mal 
    catch (error) {
        console.error('ERROR AL OBTENER PROYECTOS:', error); // <-- esto te da el detalle real
        res.status(500).json({ message: 'Error al obtener los proyectos', error });
    }
};

//Obtiene un proyecto específico por su ID
exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin_from_token = req.user.id;

        //Utiliza el servicio de projectService para obtener el proyecto
        const project = await projectService.getProjectById(id, admin_from_token);

        //Nos devuelve un mensaje de confirmacion con el proyecto en formato .json
        res.status(200).json({ message: 'Proyecto consultado con éxito', project });
    } 
    //Mensaje de error por si algo sale mal
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Controla la actualizacion de un proyecto en la base de datos
exports.updateProject = async (req, res) => {
    const { id } = req.params;

    //Extrae los campos del cuerpo de la solicitud con req.body
    const { nombre, descripcion } = req.body;

    //Agrega un usuario a la solicitud con el req y token
    const admin_from_token = req.user.id;
    
    try {
        //Llama al servicio updateProject de projectService pasando los parametros requeridos
        const project = await projectService.updateProject(id, nombre, descripcion, admin_from_token);
        
        //Se genera una respuesta con status 200 y mensaje personalizado
        res.status(200).json({ message: 'Proyecto actualizado con éxito', project });
    } 
    //Validacion de error con status 500 (Error interno del servidor)
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};

//Procesa la eliminacion de un proyecto verificando el id del eliminado y que lo haga un administrador
exports.deleteProject = async (req, res) => {
    //Almacena los parametros con el id
    const { id } = req.params;

    //Verifica que el usuario este autenticado y pueda eliminar proyectos
    const admin_from_token = req.user.id;
    
    try {
        //Llama el metodo deleteProject de projectService pasando el id y el token
        const result = await projectService.deleteProject(id, admin_from_token);
        
        //Respuesta con status 200 y almacena en una constante result
        res.status(200).json(result);
    } 
    //Manejo de errores por si hay alguna falla
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};