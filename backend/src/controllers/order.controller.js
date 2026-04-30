const { obtenerRecursos, obtenerRecursoPorId, crearRecurso, modificarRecurso, eliminarRecurso } = require("../utils/http.utils");
const orderSchema = require("../schemas/order.schema");

const obtenerOrders = async (req, res) => {
    await obtenerRecursos(req, res, orderSchema);
};

const obtenerOrderPorId = async (req, res) => {
    await obtenerRecursoPorId(req, res, orderSchema);
};

const crearOrder = async (req, res) => {
    await crearRecurso(req, res, orderSchema);
};

const modificarOrder = async (req, res) => {
    await modificarRecurso(req, res, orderSchema);
};

const eliminarOrder = async (req, res) => {
    await eliminarRecurso(req, res, orderSchema);
};

module.exports = {
    obtenerOrders,
    obtenerOrderPorId,
    crearOrder,
    modificarOrder,
    eliminarOrder
};