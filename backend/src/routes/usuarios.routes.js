const express = require("express");
const router = express.Router();

const {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    modificarUsuario,
    eliminarUsuario,
    restaurarUsuario
} = require("../controllers/usuarios.controller");

router.get("/", obtenerUsuarios);
router.get("/:id", obtenerUsuarioPorId);
router.post("/", crearUsuario);
router.put("/:id", modificarUsuario);
router.delete("/:id", eliminarUsuario);
router.patch("/restore/:id", restaurarUsuario);

module.exports = router;