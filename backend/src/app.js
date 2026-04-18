const express = require("express");

const productosRoutes = require("./routes/productos.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const ordersRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const categoryRoutes = require("./routes/category.routes");
const addressRoutes = require("./routes/address.routes");

const cors = require("cors");

const app = express();

// Indicación al backend para las solicitudes del puerto.
app.use(cors({ origin: "http://localhost:5173" }));

// Middleware global
app.use(express.json());

// Rutas
app.use("/api/products", productosRoutes);
app.use("/api/users", usuariosRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/addresses", addressRoutes);

module.exports = app;
