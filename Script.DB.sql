-- 3. Se ejecuta de tercero porque depende de roles.
create table usuarios (
id SERIAL primary key, 
nombre VARCHAR(50) not null, 
email VARCHAR(50) not null unique,
password VARCHAR(100) not null,
rol_id INT null,
administrador_id INT null,
foreign key (rol_id) references roles(id),
foreign key (administrador_id) references usuarios(id) on delete set null
);

-- 4. Se ejecuta de cuarto porque depende de usuarios.
create table proyectos(
id SERIAL primary key,
nombre VARCHAR(50) not null,
descripcion text,
fecha_creacion TIMESTAMP default CURRENT_TIMESTAMP,
administrador_id INT not null,
foreign key (administrador_id) references usuarios(id) on delete cascade
);

-- 5. Se ejecuta de quinto porque depende de usuarios y proyectos. 
create table usuarios_proyectos (
id SERIAL primary key,
usuario_id INT not null,
proyecto_id INT not null,
foreign key (usuario_id) references usuarios(id) on delete cascade,
foreign key (proyecto_id) references proyectos(id) on delete cascade,
unique (usuario_id, proyecto_id)
);

-- 1. Se debe de ejecutar primero porque no depende de nada
create table roles(
id SERIAL primary key,
nombre VARCHAR(50) not null unique
);

-- 2. Se ejcuta de segundo porque no depende de nada 
create table permisos (
id SERIAL primary key,
nombre VARCHAR(50) not null unique
);

-- 7. Se ejecuta de ultimo para generar una iniformacion
insert into permisos (nombre) values ('crear'), ('visualizar'), ('actualizar'), ('eliminar')

-- 6. Se ejecuta de sexto porque depende de roles y permisos.
create table roles_permisos (
id SERIAL primary key,
rol_id INT not null,
permiso_id INT not null,
foreign key (rol_id) references roles(id) on delete cascade,
foreign key (permiso_id) references permisos(id) on delete cascade,
unique (rol_id, permiso_id)
);
