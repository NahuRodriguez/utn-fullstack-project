const { obtenerRecursos, obtenerRecursoPorId, crearRecurso, modificarRecurso, eliminarRecurso } = require("../utils/http.utils");
const paymentSchema = require("../schemas/payment.schema");

const obtenerPayments = async (req, res) => {
    await obtenerRecursos(req, res, paymentSchema);
};

const obtenerPaymentPorId = async (req, res) => {
    await obtenerRecursoPorId(req, res, paymentSchema);
};

const crearPayment = async (req, res) => {
    await crearRecurso(req, res, paymentSchema);
};

const modificarPayment = async (req, res) => {
    await modificarRecurso(req, res, paymentSchema);
};

const eliminarPayment = async (req, res) => {
    await eliminarRecurso(req, res, paymentSchema);
};

module.exports = {
    obtenerPayments,
    obtenerPaymentPorId,
    crearPayment,
    modificarPayment,
    eliminarPayment
};