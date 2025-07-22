DROP DATABASE IF EXISTS "Iker";



CREATE DATABASE "Iker"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Spain.1252'
    LC_CTYPE = 'Spanish_Spain.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- Conéctate a la base de datos "Iker" antes de crear las tablas
-- \c Iker; -- Esto se ejecutaría en un cliente psql, pero no directamente en un script de una sola ejecución

-- Tabla de Roles
-- Define los diferentes roles que pueden tener los trabajadores en el sistema.
CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Tabla de Trabajadores
-- Almacena la información de los empleados de la empresa, incluyendo su rol.
CREATE TABLE trabajadores (
    id_trabajador SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    identificacion VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    profesion VARCHAR(100),
    direccion VARCHAR(200),
    id_rol INT NOT NULL REFERENCES roles(id_rol),
    especialidad VARCHAR(100),
    contrasena VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE, -- Indica si el trabajador está activo o inhabilitado
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Eliminada la coma final aquí
);


-- Tipo de enumeración para el estado de los proyectos
CREATE TYPE estado_proyecto AS ENUM ('planificacion', 'en_progreso', 'en_revision', 'finalizado', 'cancelado');

-- Tabla de Proyectos
-- Contiene la información de los proyectos gestionados por la empresa.
CREATE TABLE proyectos (
    id_proyecto SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin_estimada DATE,
    id_lider INT NOT NULL REFERENCES trabajadores(id_trabajador), -- Clave foránea al líder del proyecto
    estado estado_proyecto DEFAULT 'planificacion'
);

-- Tabla de Asignaciones
-- Relaciona a los desarrolladores con los proyectos en los que están trabajando.
CREATE TABLE asignaciones (
    id_asignacion SERIAL PRIMARY KEY,
    id_proyecto INT NOT NULL REFERENCES proyectos(id_proyecto),
    id_desarrollador INT NOT NULL REFERENCES trabajadores(id_trabajador),
    fecha_asignacion DATE NOT NULL,
    activo BOOLEAN DEFAULT TRUE, -- Indica si la asignación está activa
    UNIQUE (id_proyecto, id_desarrollador, activo) -- Asegura que un desarrollador no esté asignado dos veces al mismo proyecto activamente
);

-- Tipo de enumeración para el estado de las etapas
CREATE TYPE estado_etapa AS ENUM ('pendiente', 'en_progreso', 'completada', 'atrasada');

-- Tabla de Etapas
-- Define las diferentes fases o etapas dentro de un proyecto.
CREATE TABLE etapas (
    id_etapa SERIAL PRIMARY KEY,
    id_proyecto INT NOT NULL REFERENCES proyectos(id_proyecto), -- Clave foránea al proyecto
    nombre VARCHAR(100) NOT NULL,
    fecha_inicio_estimada DATE,
    fecha_fin_estimada DATE,
    estado estado_etapa DEFAULT 'pendiente'
);

-- Tipo de enumeración para el estado de las actividades
CREATE TYPE estado_actividad AS ENUM ('pendiente', 'en_progreso', 'completada', 'atrasada');

-- Tabla de Actividades
-- Registra las tareas específicas a realizar por los desarrolladores dentro de una etapa.
CREATE TABLE actividades (
    id_actividad SERIAL PRIMARY KEY,
    id_etapa INT NOT NULL REFERENCES etapas(id_etapa), -- Clave foránea a la etapa a la que pertenece
    id_desarrollador INT NOT NULL REFERENCES trabajadores(id_trabajador), -- Clave foránea al desarrollador asignado
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_inicio_estimada DATE,
    fecha_fin_estimada DATE,
    estado estado_actividad DEFAULT 'pendiente'
);

-- Tabla de Errores
-- Registra los errores encontrados en los proyectos por los desarrolladores.
CREATE TABLE errores (
    id_error SERIAL PRIMARY KEY,
    id_proyecto INT NOT NULL REFERENCES proyectos(id_proyecto),
    id_etapa INT NOT NULL REFERENCES etapas(id_etapa),
    id_desarrollador INT NOT NULL REFERENCES trabajadores(id_trabajador),
    tipo_error VARCHAR(100) NOT NULL, -- Almacena el tipo de error directamente como texto
    descripcion TEXT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    solucionado BOOLEAN DEFAULT FALSE
);

-- Tabla de Interrupciones
-- Registra cualquier interrupción que afecte el desarrollo de un proyecto.
CREATE TABLE interrupciones (
    id_interrupcion SERIAL PRIMARY KEY,
    id_proyecto INT NOT NULL REFERENCES proyectos(id_proyecto),
    id_etapa INT NOT NULL REFERENCES etapas(id_etapa),
    id_desarrollador INT NOT NULL REFERENCES trabajadores(id_trabajador),
    tipo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha TIMESTAMP NOT NULL,
    duracion_minutos INT NOT NULL
);

CREATE TABLE reportes_desempeno (
    id_reporte SERIAL PRIMARY KEY,
    id_trabajador INT NOT NULL REFERENCES trabajadores(id_trabajador),
    id_asignacion INT REFERENCES asignaciones(id_asignacion), -- Si el reporte es específico a una asignación
    id_etapa INT REFERENCES etapas(id_etapa),                 -- Para identificar en qué etapa se generó
    id_proyecto INT REFERENCES proyectos(id_proyecto),        -- Relación explícita si no está en la asignación
    fecha_inicio DATE,
    fecha_fin DATE,
    tareas_completadas INT DEFAULT 0,
    tareas_atrasadas INT DEFAULT 0,
    errores_registrados INT DEFAULT 0,
    interrupciones_registradas INT DEFAULT 0,
    porcentaje_avance DECIMAL(5,2), -- Ej: 75.00%
    calificacion DECIMAL(3,2),      -- Ej: 8.5/10
    observaciones TEXT,
    fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Datos iniciales para la tabla de roles
INSERT INTO roles (nombre) VALUES
('Coordinador'),
('Líder'),
('Desarrollador');


-- Insertar un trabajador con el rol 'Coordinador'
INSERT INTO trabajadores (nombre, apellido, identificacion, email, profesion, direccion, id_rol, especialidad, contrasena, activo, fecha_registro)
VALUES ('Ana', 'Gómez', '11111111', 'ana@gmail.com', 'Ingeniera de Sistemas', 'Calle 10 # 20-30, Bogotá', (SELECT id_rol FROM roles WHERE nombre = 'Coordinador'), 'Gestión de Proyectos', '123456', TRUE, CURRENT_TIMESTAMP);

-- Insertar un trabajador con el rol 'Líder'
INSERT INTO trabajadores (nombre, apellido, identificacion, email, profesion, direccion, id_rol, especialidad, contrasena, activo, fecha_registro)
VALUES ('Carlos', 'Ramírez', '22222222', 'carlos@gmail.com', 'Ingeniero de Software', 'Carrera 5 # 15-25, Medellín', (SELECT id_rol FROM roles WHERE nombre = 'Líder'), 'Desarrollo Backend', '123456', TRUE, CURRENT_TIMESTAMP);

-- Insertar un trabajador con el rol 'Desarrollador'
INSERT INTO trabajadores (nombre, apellido, identificacion, email, profesion, direccion, id_rol, especialidad, contrasena, activo, fecha_registro)
VALUES ('Sofía', 'Martínez', '3333333', 'sofia@gmail.com', 'Desarrolladora Web', 'Avenida Siempre Viva 742, Springfield', (SELECT id_rol FROM roles WHERE nombre = 'Desarrollador'), 'Desarrollo Frontend', '123456', TRUE, CURRENT_TIMESTAMP);



INSERT INTO trabajadores (nombre, apellido, identificacion, email, profesion, direccion, id_rol, especialidad, contrasena, activo, fecha_registro)
VALUES ('Lucía', 'Torres', '44444444', 'lucia.torres@outlook.com', 'Ingeniera Industrial', 'Calle 45 # 10-22, Cali', (SELECT id_rol FROM roles WHERE nombre = 'Coordinador'), 'Gestión de Recursos', '123456', TRUE, CURRENT_TIMESTAMP);


INSERT INTO trabajadores (nombre, apellido, identificacion, email, profesion, direccion, id_rol, especialidad, contrasena, activo, fecha_registro)
VALUES 
('David', 'López', '55555555', 'david.lopez@hotmail.com', 'Ingeniero de Sistemas', 'Carrera 10 # 33-21, Barranquilla', (SELECT id_rol FROM roles WHERE nombre = 'Líder'), 'Arquitectura de Software', '123456', TRUE, CURRENT_TIMESTAMP),

('Juliana', 'Castro', '66666666', 'juliana.castro@gmail.com', 'Ingeniera Electrónica', 'Carrera 8 # 23-45, Bucaramanga', (SELECT id_rol FROM roles WHERE nombre = 'Líder'), 'Coordinación Técnica', '123456', TRUE, CURRENT_TIMESTAMP);


INSERT INTO trabajadores (nombre, apellido, identificacion, email, profesion, direccion, id_rol, especialidad, contrasena, activo, fecha_registro)
VALUES 
('Felipe', 'Ríos', '77777777', 'felipe.rios@gmail.com', 'Ingeniero de Sistemas', 'Calle 70 # 20-60, Medellín', (SELECT id_rol FROM roles WHERE nombre = 'Desarrollador'), 'Full Stack', '123456', TRUE, CURRENT_TIMESTAMP),

('Natalia', 'Vega', '88888888', 'natalia.vega@outlook.com', 'Ingeniera de Software', 'Avenida 3 # 40-20, Cali', (SELECT id_rol FROM roles WHERE nombre = 'Desarrollador'), 'Frontend React', '123456', TRUE, CURRENT_TIMESTAMP),

('Andrés', 'Cortés', '99999999', 'andres.cortes@gmail.com', 'Técnico en Sistemas', 'Carrera 12 # 5-10, Manizales', (SELECT id_rol FROM roles WHERE nombre = 'Desarrollador'), 'Backend Java', '123456', TRUE, CURRENT_TIMESTAMP),

('Valentina', 'Morales', '10101010', 'valentina.morales@outlook.com', 'Ingeniera de Telecomunicaciones', 'Calle 15 # 9-50, Neiva', (SELECT id_rol FROM roles WHERE nombre = 'Desarrollador'), 'Desarrollo Móvil', '123456', TRUE, CURRENT_TIMESTAMP),

('Sebastián', 'Mejía', '12121212', 'sebastian.mejia@gmail.com', 'Ingeniero de Sistemas', 'Carrera 7 # 14-20, Bogotá', (SELECT id_rol FROM roles WHERE nombre = 'Desarrollador'), 'Python y Django', '123456', TRUE, CURRENT_TIMESTAMP),

('Laura', 'Ortiz', '13131313', 'laura.ortiz@gmail.com', 'Ingeniera de Sistemas', 'Avenida 5 # 60-18, Cartagena', (SELECT id_rol FROM roles WHERE nombre = 'Desarrollador'), 'Testing QA', '123456', TRUE, CURRENT_TIMESTAMP),

('Camilo', 'Guzmán', '14141414', 'camilo.guzman@hotmail.com', 'Ingeniero de Software', 'Calle 80 # 25-12, Bogotá', (SELECT id_rol FROM roles WHERE nombre = 'Desarrollador'), 'DevOps', '123456', TRUE, CURRENT_TIMESTAMP),

('Daniela', 'Pérez', '15151515', 'daniela.perez@outlook.com', 'Desarrolladora de Software', 'Carrera 18 # 12-34, Medellín', (SELECT id_rol FROM roles WHERE nombre = 'Desarrollador'), 'Angular y Node.js', '123456', TRUE, CURRENT_TIMESTAMP);


	