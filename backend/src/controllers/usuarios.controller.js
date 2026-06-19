const userSchema = require("../schemas/user.schema");
const { userDTO } = require("../dtos");

const obtenerUsuarios = async (req, res) => {
    try {
        const results = await userSchema.find();
        res.status(200).json(results.map(userDTO));
    } catch (error) {
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const obtenerUsuariosEliminados = async (req, res) => {
    try {
        const results = await userSchema.findDeleted();
        res.status(200).json(results.map(userDTO));
    } catch (error) {
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const obtenerUsuarioPorId = async (req, res) => {
    const { id: userId } = req.params;
    const { id: currentUser, role } = req.user;

    if (currentUser !== userId && role !== "ADMIN") {
        return res.status(403).json({ message: "Acceso denegado" });
    }

    try {
        const recurso = await userSchema.findById(userId);
        if (!recurso) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.status(200).json(userDTO(recurso));
    } catch (error) {
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const crearUsuario = async (req, res) => {
    try {
        req.body.role = "USER";
        const recurso = await userSchema.create(req.body);
        res.status(201).json({ mensaje: "Usuario creado", data: userDTO(recurso) });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const modificarUsuario = async (req, res) => {
    const { id: userId } = req.params;
    const { id: currentUser, role } = req.user;

    if (currentUser !== userId && role !== "ADMIN") {
        return res.status(403).json({ message: "Acceso denegado" });
    }

    if (req.body.role && role !== "ADMIN") {
        return res.status(403).json({ message: "Solo los administradores pueden cambiar el rol de un usuario" });
    }

    try {
        const oldDoc = await userSchema.findById(userId).exec();
        if (!oldDoc) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        Object.assign(oldDoc, req.body);
        const recurso = await oldDoc.save();
        res.status(200).json({ mensaje: "Usuario actualizado", data: userDTO(recurso) });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const eliminarUsuario = async (req, res) => {
    const { id: userId } = req.params;
    try {
        const recurso = await userSchema.deleteById(userId);
        if (!recurso) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.status(200).json({ mensaje: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

const restaurarUsuario = async (req, res) => {
    const { id: userId } = req.params;
    try {
        const recurso = await userSchema.restore({ _id: userId });
        if (!recurso) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.status(200).json({ mensaje: "Usuario restaurado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Internal Server Error" });
    }
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuariosEliminados,
    obtenerUsuarioPorId,
    crearUsuario,
    modificarUsuario,
    eliminarUsuario,
    restaurarUsuario
};
