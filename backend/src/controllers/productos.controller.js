const { obtenerRecursos, obtenerRecursoPorId, crearRecurso, modificarRecurso, eliminarRecurso } = require("../utils/http.utils");
const productSchema = require("../schemas/product.schema");

const obtenerProductos = async (req, res) => {
    await obtenerRecursos(req, res, productSchema);
};

const obtenerProductoPorId = async (req, res) => {
    await obtenerRecursoPorId(req, res, productSchema);
};

const crearProducto = async (req, res) => {
    await crearRecurso(req, res, productSchema);
};

const modificarProducto = async (req, res) => {
    await modificarRecurso(req, res, productSchema);
};

const eliminarProducto = async (req, res) => {
    await eliminarRecurso(req, res, productSchema);
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    modificarProducto,
    eliminarProducto
};