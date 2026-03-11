const express = require("express");
const productosRoutes = require("./routes/productos.routes");
const usuariosRoutes = require("./routes/usuarios.routes");

const app = express();

// Middleware global
app.use(express.json());

// Rutas
app.use("/api/productos", productosRoutes);
app.use("/api/usuarios", usuariosRoutes);

module.exports = app;
