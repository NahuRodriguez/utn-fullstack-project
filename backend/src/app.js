const express = require("express");

const app = express();

app.use(express.json());

let productos = [];
let usuarios = [];

const generarId = (array) => {
  if (array.length === 0) return 1;
  return array[array.length - 1].id + 1;
};

// Crea el producto
app.post("/productos", (req, res) => {
  const nuevoProducto = {
    id: generarId(productos),
    ...req.body,
  };
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});
// Obtiene productos
app.get("/productos", (req, res) => {
  res.status(200).json(productos);
});

// Obtiene un producto por id
app.get("/productos/:id", (req, res) => {
  const idParam = parseInt(req.params.id);
  const producto = productos.find((p) => p.id === idParam);

  if (!producto) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }
  res.status(200).json(producto);
});

app.put("/productos/:id", (req, res) => {
  const idParam = parseInt(req.params.id);
  const index = productos.findIndex((p) => p.id === idParam);

  if (index === -1) {
    return res
      .status(404)
      .json({ mensaje: "Producto no encontrado para actualizar" });
  }

  // Actualiza el producto manteniendo su ID original
  productos[index] = { id: idParam, ...req.body };
  res.status(200).json(productos[index]);
});

// 5. Elimina un producto
app.delete("/productos/:id", (req, res) => {
  const idParam = parseInt(req.params.id);
  const index = productos.findIndex((p) => p.id === idParam);

  if (index === -1) {
    return res
      .status(404)
      .json({ mensaje: "Producto no encontrado para eliminar" });
  }

  productos.splice(index, 1);
  res.status(200).json({ mensaje: "Producto eliminado correctamente" });
});

// ENDPOINTS DE USUARIOS

// Crea el usuario
app.post("/usuarios", (req, res) => {
  const nuevoUsuario = {
    id: generarId(usuarios),
    ...req.body,
  };
  usuarios.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
});

// Obtener usuarios
app.get("/usuarios", (req, res) => {
  res.status(200).json(usuarios);
});

// Obtener un usuario por id
app.get("/usuarios/:id", (req, res) => {
  const idParam = parseInt(req.params.id);
  const usuario = usuarios.find((u) => u.id === idParam);

  if (!usuario) {
    return res.status(404).json({ mensaje: "Usuario no encontrado" });
  }
  res.status(200).json(usuario);
});

// Actualiza un usuario
app.put("/usuarios/:id", (req, res) => {
  const idParam = parseInt(req.params.id);
  const index = usuarios.findIndex((u) => u.id === idParam);

  if (index === -1) {
    return res
      .status(404)
      .json({ mensaje: "Usuario no encontrado para actualizar" });
  }

  usuarios[index] = { id: idParam, ...req.body };
  res.status(200).json(usuarios[index]);
});

// Elimina un usuario
app.delete("/usuarios/:id", (req, res) => {
  const idParam = parseInt(req.params.id);
  const index = usuarios.findIndex((u) => u.id === idParam);

  if (index === -1) {
    return res
      .status(404)
      .json({ mensaje: "Usuario no encontrado para eliminar" });
  }

  usuarios.splice(index, 1);
  res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

module.exports = app;
