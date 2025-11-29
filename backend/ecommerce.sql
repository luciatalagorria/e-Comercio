CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;


-- Tabla USUARIO

CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50),
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE NOT NULL
);


-- Tabla CATEGORIA

CREATE TABLE categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    cantidad_productos INT DEFAULT 0
);


-- Tabla PRODUCTO

CREATE TABLE producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    costo DECIMAL(10,2) NOT NULL,
    moneda VARCHAR(10),
    cantidad_vendidos INT DEFAULT 0,
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);


-- Tabla COMENTARIO

CREATE TABLE comentario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calificacion INT CHECK(calificacion BETWEEN 1 AND 5),
    descripcion TEXT,
    nombre_usuario VARCHAR(100),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    producto_id INT,
    FOREIGN KEY (producto_id) REFERENCES producto(id)
);


-- Tabla CARRITO

CREATE TABLE carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    cantidad_productos INT,
    subtotal DECIMAL(10,2),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);


-- Tabla PEDIDO

CREATE TABLE pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carrito_id INT,
    direccion_envio VARCHAR(255),
    tipo_envio VARCHAR(50),
    forma_pago VARCHAR(50),
    costos DECIMAL(10,2),
    FOREIGN KEY (carrito_id) REFERENCES carrito(id)
);


-- Tabla intermedia CARRITO_PRODUCTO

CREATE TABLE carrito_producto (
    carrito_id INT,
    producto_id INT,
    cantidad INT DEFAULT 1,
    PRIMARY KEY (carrito_id, producto_id),
    FOREIGN KEY (carrito_id) REFERENCES carrito(id),
    FOREIGN KEY (producto_id) REFERENCES producto(id)
);