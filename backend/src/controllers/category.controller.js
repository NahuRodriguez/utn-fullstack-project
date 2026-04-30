const { obtenerRecursos, obtenerRecursoPorId, crearRecurso, modificarRecurso, eliminarRecurso } = require("../utils/http.utils");
const categorySchema = require("../schemas/category.schema");

const obtenerCategories = async (req, res) => {
    await obtenerRecursos(req, res, categorySchema);
};

const obtenerCategoryPorId = async (req, res) => {
    await obtenerRecursoPorId(req, res, categorySchema);
};

const crearCategory = async (req, res) => {
    await crearRecurso(req, res, categorySchema);
};

const modificarCategory = async (req, res) => {
    await modificarRecurso(req, res, categorySchema);
};

const eliminarCategory = async (req, res) => {
    await eliminarRecurso(req, res, categorySchema);
};

module.exports = {
    obtenerCategories,
    obtenerCategoryPorId,
    crearCategory,
    modificarCategory,
    eliminarCategory
};