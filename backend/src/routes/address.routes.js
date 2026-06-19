const express = require("express");
const router = express.Router();

const { verificarToken, soloAdmin } = require("../middleware/auth.middleware");
const { validate } = require("../validations/validate");
const { createAddressSchema } = require("../validations/address.validation");

const {
    obtenerAddresses,
    obtenerAddressPorId,
    crearAddress,
    eliminarAddress,
    restaurarAddress,
    obtenerAddressPorUsuario
} = require("../controllers/address.controller");


router.get("/", [ verificarToken, soloAdmin ], obtenerAddresses);
router.get("/:id", verificarToken, obtenerAddressPorId);
router.post("/", verificarToken, validate(createAddressSchema), crearAddress);
router.delete("/:id", verificarToken, eliminarAddress);
router.patch("/restore/:id", [ verificarToken, soloAdmin ], restaurarAddress);
router.get("/user/:targetUserId", verificarToken, obtenerAddressPorUsuario);

module.exports = router;