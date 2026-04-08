const { obtenerRecursos, obtenerRecursoPorId, crearRecurso, modificarRecurso, eliminarRecurso } = require("../utils/http.utils");
const userSchema = require("../schemas/user.schema");

const obtenerUsuarios = async (req, res) => {
    await obtenerRecursos(req, res, userSchema);
};

const obtenerUsuarioPorId = async (req, res) => {
    await obtenerRecursoPorId(req, res, userSchema);
};

const crearUsuario = async (req, res) => {
    await crearRecurso(req, res, userSchema);
};

const modificarUsuario = async (req, res) => {
    await modificarRecurso(req, res, userSchema);
};

const eliminarUsuario = async (req, res) => {
    await eliminarRecurso(req, res, userSchema);
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    modificarUsuario,
    eliminarUsuario
};