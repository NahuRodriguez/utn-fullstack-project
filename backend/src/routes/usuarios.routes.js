const express = require("express");
const router = express.Router();

const {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    modificarUsuario,
    eliminarUsuario
} = require("../controllers/usuarios.controller");

router.get("/", obtenerUsuarios);
router.get("/:id", obtenerUsuarioPorId);
router.post("/", crearUsuario);
router.put("/:id", modificarUsuario);
router.delete("/:id", eliminarUsuario);

module.exports = router;