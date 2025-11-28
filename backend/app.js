const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = 3000;
const SECRET_KEY = "clave_secreta_123";

app.use(cors());
app.use(express.json());

// JSON estáticos al frontend
app.use("/", express.static(path.join(__dirname, "emercado-api-main")));

// Login con token
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "usuario1" && password === "clave123") {
    const token = jwt.sign({ email, id: 25801 }, SECRET_KEY, { expiresIn: "1m" });
    return res.json({ token });
  }
  res.status(401).json({ error: "Usuario o contraseña incorrectos" });
});


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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});