const { obtenerRecursos, obtenerRecursoPorId, crearRecurso, modificarRecurso, eliminarRecurso, restaurarRecurso } = require("../utils/http.utils");
const userSchema = require("../schemas/user.schema");

const obtenerUsuarios = async (req, res) => {
    await obtenerRecursos(req, res, userSchema);
};

const obtenerUsuarioPorId = async (req, res) => {
    const { id: userId } = req.params;
    const { id: currentUser, role } = req.user;

    if (currentUser !== userId && !(role === "ADMIN")) {
        return res.status(403).json({ message: "Acceso denegado" });
    }

    await obtenerRecursoPorId(req, res, userSchema);
};

const crearUsuario = async (req, res) => {
    req.body.role = "USER";
    await crearRecurso(req, res, userSchema);
};

const modificarUsuario = async (req, res) => {
    const { id: userId } = req.params;
    const { id: currentUser, role } = req.user;

    if (currentUser !== userId && !(role === "ADMIN")) {
        return res.status(403).json({ message: "Acceso denegado" });
    }

    if (req.body.role && role !== "ADMIN") {
        return res.status(403).json({ message: "Solo los administradores pueden cambiar el rol de un usuario" });
    }

    await modificarRecurso(req, res, userSchema);
};

const eliminarUsuario = async (req, res) => {
    await eliminarRecurso(req, res, userSchema);
};

const restaurarUsuario = async (req, res) => {
    await restaurarRecurso(req, res, userSchema);
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    modificarUsuario,
    eliminarUsuario,
    restaurarUsuario
};