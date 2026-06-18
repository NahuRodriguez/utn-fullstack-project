const express = require("express");
const router = express.Router();
const { verificarToken, soloAdmin } = require("../middleware/auth.middleware");
const { validate } = require("../validations/validate");
const { createUserSchema, updateUserSchema } = require("../validations/user.validation");

const {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    modificarUsuario,
    eliminarUsuario,
    restaurarUsuario
} = require("../controllers/usuarios.controller");

router.get("/", [ verificarToken, soloAdmin ], obtenerUsuarios);
router.get("/:id", verificarToken, obtenerUsuarioPorId);
router.post("/", [verificarToken, soloAdmin, validate(createUserSchema)], crearUsuario);
router.put("/:id", verificarToken, validate(updateUserSchema), modificarUsuario);
router.delete("/:id", [ verificarToken, soloAdmin ], eliminarUsuario);
router.patch("/restore/:id", [ verificarToken, soloAdmin ], restaurarUsuario);

module.exports = router;