const mongoose = require("mongoose");

const send500 = (res) => {
    res.status(500).json({mensaje: "Internal Server Error"});
}

const obtenerRecursos = async (req, res, schema) => {
    try {
        const results = await schema.find();
        res.status(200).json(results);
    } catch (error) {
        send500(res);
    }
};

const obtenerRecursoPorId = async (req, res, schema) => {
    const idParam = req.params.id;
    try {
        const recurso = await schema.findById(idParam);
        if (!recurso) {
            return res.status(404).json({ mensaje: `${schema.modelName} no encontrado` });
        }
        res.status(200).json(recurso);
    } catch (error) {
        send500(res);
    }
};

const crearRecurso = async (req, res, schema) => {
    try {
        const recurso = await schema.create(req.body);
        res.status(201).json({mensaje: `${schema.modelName} creado`, [`${schema.modelName}`]: recurso});
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ errors: error.errors });
        } else {
            send500(res);
        }
    }
};

const modificarRecurso = async (req, res, schema) => {
    const idParam = req.params.id;
    try {
        oldDoc = await schema.findById(idParam).exec();
        if (!oldDoc) {
            return res.status(404).json({ mensaje: `${schema.modelName} no encontrado` });
        }
        newAttributes = { ...req.body };
        newDoc = Object.assign(oldDoc, newAttributes);
        recurso = await newDoc.save();
        res.status(200).json({mensaje: `${schema.modelName} actualizado`, [`${schema.modelName}`]: recurso});
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ errors: error.errors });
        } else {
            send500(res);
        }
    }
};

const eliminarRecurso = async (req, res, schema) => {
    const idParam = req.params.id;
    try {
        const recurso = await schema.findByIdAndDelete(idParam, req.body);
        if (!recurso) {
            return res.status(404).json({ mensaje: `${schema.modelName} no encontrado` });
        }
        res.status(200).json({mensaje: `${schema.modelName} eliminado`, [`${schema.modelName}`]: recurso});
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ errors: error.errors });
        } else {
            console.log(error);
            send500(res);
        }
    }
};

module.exports = { obtenerRecursos, obtenerRecursoPorId, crearRecurso, modificarRecurso, eliminarRecurso }