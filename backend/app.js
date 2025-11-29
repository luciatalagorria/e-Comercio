const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const mariadb = require("mariadb");

const app = express();
const PORT = 3000;
const SECRET_KEY = "claveSecreta123";

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecommerce",
  connectionLimit: 5
});

app.use(cors());
app.use(express.json());


// Login con token
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "usuario@hotmail.com" && password === "usuario123") {
    const token = jwt.sign({ email}, SECRET_KEY,);
    return res.status(200).json({ token });
  }else {
  res.status(401).json({ error: "Usuario o contraseña incorrectos" });
  }
});


// Endpoint de Carrito en la base de datos

app.post("/cart", async (req, res) => {
  const { usuario_id, items } = req.body;

  if (!usuario_id || !items || items.length === 0) {
    return res.status(400).json({ error: "Faltan datos del carrito" });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // Calcular subtotal
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.costo * item.cantidad;
    }

    // Crear carrito
    const result = await conn.query(
      "INSERT INTO carrito (usuario_id, cantidad_productos, subtotal) VALUES (?, ?, ?)",
      [usuario_id, items.length, subtotal]
    );

    const carrito_id = result.insertId;

    // Insertar productos en carrito
    for (const item of items) {
      await conn.query(
        "INSERT INTO carrito_producto (carrito_id, producto_id, cantidad) VALUES (?, ?, ?)",
        [carrito_id, item.producto_id, item.cantidad]
      );
    }

    res.json({ message: "Carrito guardado con éxito", carrito_id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al guardar el carrito" });
  } finally {
    if (conn) conn.end();
  }
});


// JSON estáticos al frontend
app.use("/", express.static(path.join(__dirname, "emercado-api-main")));


// Middleware de autorización
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ error: "Token requerido" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
}

// Rutas protegidas (ejemplos)
app.get("/user_cart/:id.json", verificarToken, (req, res) => {
  res.sendFile(path.join(__dirname, "emercado-api-main", "user_cart", req.params.id + ".json"));
});

app.get("/cart/buy.json", verificarToken, (req, res) => {
  res.sendFile(path.join(__dirname, "emercado-api-main", "cart", "buy.json"));
});

app.get("/products/:id.json", verificarToken, (req, res) => {
  res.sendFile(path.join(__dirname, "emercado-api-main", "products", req.params.id + ".json"));
});

app.get("/cats_products/:id.json", verificarToken, (req, res) => {
  res.sendFile(path.join(__dirname, "emercado-api-main", "cats_products", req.params.id + ".json"));
});

app.get("/cats.json", verificarToken, (req, res) => {
  res.sendFile(path.join(__dirname, "emercado-api-main", "cats.json"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});