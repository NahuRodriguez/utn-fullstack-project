const usuarios = require("../data/usuarios.data");
const generarId = require("../utils/array.utils");

const obtenerUsuarios = (req, res) => {
    res.status(200).json(usuarios);
};

const obtenerUsuarioPorId = (req, res) => {
    const idParam = parseInt(req.params.id);
    const usuario = usuarios.find((u) => u.id === idParam);

    if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
};

const crearUsuario = (req, res) => {
    const nuevoUsuario = {
        id: generarId(usuarios),
        ...req.body,
    };
    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
};

const modificarUsuario = (req, res) => {
    const idParam = parseInt(req.params.id);
    const index = usuarios.findIndex((u) => u.id === idParam);

    if (index === -1) {
        return res
            .status(404)
            .json({ mensaje: "Usuario no encontrado para actualizar" });
    }

    usuarios[index] = { id: idParam, ...req.body };
    res.status(200).json(usuarios[index]);
};

const eliminarUsuario = (req, res) => {
    const idParam = parseInt(req.params.id);
    const index = usuarios.findIndex((u) => u.id === idParam);

    if (index === -1) {
        return res
            .status(404)
            .json({ mensaje: "Usuario no encontrado para eliminar" });
    }

    usuarios.splice(index, 1);
    res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
};

module.exports = {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    modificarUsuario,
    eliminarUsuario
};