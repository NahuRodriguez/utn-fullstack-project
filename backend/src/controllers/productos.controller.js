const productos = require("../data/productos.data");
const generarId = require("../utils/array.utils");

const obtenerProductos = (req, res) => {
    res.status(200).json(productos);
};

const obtenerProductoPorId = (req, res) => {
    const idParam = parseInt(req.params.id);
    const producto = productos.find((p) => p.id === idParam);

    if (!producto) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.status(200).json(producto);
};

const crearProducto = (req, res) => {
    const nuevoProducto = {
        id: generarId(productos),
        ...req.body,
    };
    productos.push(nuevoProducto);
    res.status(201).json(nuevoProducto);
};

const modificarProducto = (req, res) => {
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
};

const eliminarProducto = (req, res) => {
    const idParam = parseInt(req.params.id);
    const index = productos.findIndex((p) => p.id === idParam);

    if (index === -1) {
        return res
            .status(404)
            .json({ mensaje: "Producto no encontrado para eliminar" });
    }

    productos.splice(index, 1);
    res.status(200).json({ mensaje: "Producto eliminado correctamente" });
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    modificarProducto,
    eliminarProducto
};