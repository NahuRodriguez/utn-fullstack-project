const { obtenerRecursos, obtenerRecursoPorId, crearRecurso, modificarRecurso, eliminarRecurso } = require("../utils/http.utils");
const addressSchema = require("../schemas/address.schema");

const obtenerAddresses = async (req, res) => {
    await obtenerRecursos(req, res, addressSchema);
};

const obtenerAddressPorId = async (req, res) => {
    await obtenerRecursoPorId(req, res, addressSchema);
};

const crearAddress = async (req, res) => {
    await crearRecurso(req, res, addressSchema);
};

const modificarAddress = async (req, res) => {
    await modificarRecurso(req, res, addressSchema);
};

const eliminarAddress = async (req, res) => {
    await eliminarRecurso(req, res, addressSchema);
};

module.exports = {
    obtenerAddresses,
    obtenerAddressPorId,
    crearAddress,
    modificarAddress,
    eliminarAddress
};