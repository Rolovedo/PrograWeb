const Project = require('../models/project.model');
const User = require('../models/user.model');

exports.assignUserToProject = async (data) => {
    const project  = await Project.findByPk(data.project);
    if (!project) throw new Error('Proyecto no encontrado');

    const users = await User.findAll({ ehre: { id: data.userIds } });
    if (users.length !== data.userIds.length) throw new Error('Algunos usuarios no fueron encontrados');

    await project.addUsuarios(users);
    return await project.findByPk(data.projectId, {
        include: [
            {
                model: User,
                as: 'usuarios',
                attributes: ['id, nombre, email'],
                through: { attributes: []}
            }
        ],
    });
};

exports.removeUserFromProject = async (data) => {
    const project = await Project.findByPk(data.prjectId);
    if (!project) throw new Error('Proyecto no encontrado');

    const user = await User.findByPk(data.userId);
    if (!user) throw new Error('Usuario no encontrado');

    await project.removeUsuario(user);
}

exports.createProject = async (nombre, descripcion, administrador_id) => {
    try {
        const projectExists = await Project.findOne({ where: { nombre, administrador_id } });
        if(projectExists) {
            throw new Error('Ya existe un proyecto con este nombre');
        }

        //Creamos el proyecto con la informacion que conocemos
        const newProject = await Project.create({
            nombre,
            descripcion,
            administrador_id
            // La fecha_creacion se genera automáticamente por default CURRENT_TIMESTAMP
        });
        
        return newProject; //Si todo esta correcto retorna el nuevo proyecto
    } catch (err) {
        throw new Error(`Error al crear el proyecto: ${err.message}`);
    }
};

//Se usa el async para que sea asincrona y usar el await
//Se usa para listar los proyectos vinculados al administrador 
exports.getAllProjects = async () => {
    try {
      const projects = await Project.findAll({
        include: [
          {
            model: User,
            as: 'administrador', // Relación con el usuario administrador del proyecto
            attributes: ['id', 'nombre'] // Solo se incluyen estos atributos
          },
          {
            model: User,
            as: 'usuarios', // Relación con los usuarios del proyecto
            attributes: ['id', 'nombre', 'email'], // Atributos específicos a incluir
            through: { attributes: [] } // No se incluyen atributos de la tabla intermedia
          }
        ]
      });
  
      return projects; // Retorna la lista de proyectos obtenidos
    } catch (err) {
      throw new Error(`Error al obtener los proyectos: ${err.message}`);
    }
  };

//Se busca un proyecto específico por su ID
exports.getProjectById = async (id, admin_from_token) => {
    try {
        //Se usa la busqueda por medio del id
        const project = await Project.findByPk(id);
        
        //Verifica si el proyecto existe
        if (!project) {
            throw new Error('Proyecto no encontrado');
        }
        
        //Compara el administrador_id con el token para verificar permisos
        if (project.administrador_id !== admin_from_token) {
            throw new Error('Acceso denegado, este proyecto no está bajo su administración');
        }
        
        //Retorna el proyecto consultado
        return project;
    } 
    //Al final se hace el error siempre por si algo sale mal
    catch (err) {
        throw new Error(`Error al obtener el proyecto: ${err.message}`);
    }
};

//Actualiza el proyecto con todos los parametros que se han ingresado
exports.updateProject = async (id, nombre, descripcion, admin_from_token) => {
    try {
        //findByPk (Find by primary key) del modelo project que saca el id del proyecto
        const project = await Project.findByPk(id);
        
        //Verifica si el proyecto existe
        if (!project) {
            //Si no existe saca el error del proyecto no encontrado
            throw new Error('Proyecto no encontrado');
        }

        //Compara el administrador_id con el token
        if (project.administrador_id !== admin_from_token) {
            //Si los id no coinciden muestra el error a acceso denegado
            throw new Error('Acceso denegado, este proyecto no está bajo su administración');
        }

        //Comprueba si el campo nombre fue proporcionado y si es diferente al nombre actual del proyecto
        if (nombre && nombre !== project.nombre) {
            //Busca en la base de datos si hay otro proyecto con el mismo nombre del mismo administrador
            const projectExists = await Project.findOne({ 
                where: { 
                    nombre,
                    administrador_id: admin_from_token 
                } 
            });
            if (projectExists) {
                //En caso de encontrar otro proyecto lanza este error diciendo que el nombre ya está en uso
                throw new Error('Ya existe un proyecto con este nombre');
            }
        }

        //Si no existen errores, actualiza el proyecto con la informacion proporcionada
        await project.update({
            nombre,
            descripcion
        });

        return project;
    } 
    //Si existe error lo lanzamos para el manejo de errores
    catch (error) {
        throw new Error(`Error al actualizar proyecto: ${error.message}`);
    }
};

//Elimina el proyecto de la base de datos buscandolo por el id
exports.deleteProject = async (id, admin_from_token) => {
    try {
        //Busca el proyecto por su id
        const project = await Project.findByPk(id);
        
        //Verifica si el proyecto NO existe
        if (!project) {
            //Lanza el error si el proyecto no fue encontrado
            throw new Error('Proyecto no encontrado');
        }

        //Compara administrador_id y el token
        if (project.administrador_id !== admin_from_token) {
            //Si no coinciden saca este error con acceso denegado
            throw new Error('Acceso denegado, este proyecto no está bajo su administración');
        }

        //Si pasan los filtros se elimina correctamente el proyecto
        await project.destroy();

        //Arroja un mensaje de eliminacion con exito
        return { message: 'Proyecto eliminado con éxito' };
    } 
    //En caso de existir error se va al manejo de errores
    catch (err) {
        throw new Error(`Error al eliminar el proyecto: ${err.message}`);
    }
};