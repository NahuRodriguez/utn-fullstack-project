const categorySchema = require("../schemas/category.schema");
const { categoryDTO } = require("../dtos");

const obtenerCategories = async (req, res) => {
    try {
        const results = await categorySchema.find();
        res.status(200).json(results.map(categoryDTO));
    } catch (error) {
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const obtenerCategoryPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const recurso = await categorySchema.findById(id);
        if (!recurso) {
            return res.status(404).json({ mensaje: "Categoría no encontrada" });
        }
        res.status(200).json(categoryDTO(recurso));
    } catch (error) {
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const crearCategory = async (req, res) => {
    try {
        const recurso = await categorySchema.create(req.body);
        res.status(201).json({ mensaje: "Categoría creada", data: categoryDTO(recurso) });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const modificarCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const oldDoc = await categorySchema.findById(id).exec();
        if (!oldDoc) {
            return res.status(404).json({ mensaje: "Categoría no encontrada" });
        }
        Object.assign(oldDoc, req.body);
        const recurso = await oldDoc.save();
        res.status(200).json({ mensaje: "Categoría actualizada", data: categoryDTO(recurso) });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const eliminarCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const recurso = await categorySchema.deleteById(id);
        if (!recurso) {
            return res.status(404).json({ mensaje: "Categoría no encontrada" });
        }
        res.status(200).json({ mensaje: "Categoría eliminada" });
    } catch (error) {
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const restaurarCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const recurso = await categorySchema.restore({ _id: id });
        if (!recurso) {
            return res.status(404).json({ mensaje: "Categoría no encontrada" });
        }
        res.status(200).json({ mensaje: "Categoría restaurada" });
    } catch (error) {
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

module.exports = {
    obtenerCategories,
    obtenerCategoryPorId,
    crearCategory,
    modificarCategory,
    eliminarCategory,
    restaurarCategory
};
