const express = require("express");
const router = express.Router();

const {
    obtenerAddresses,
    obtenerAddressPorId,
    crearAddress,
    modificarAddress,
    eliminarAddress
} = require("../controllers/address.controller");

router.get("/", obtenerAddresses);
router.get("/:id", obtenerAddressPorId);
router.post("/", crearAddress);
router.put("/:id", modificarAddress);
router.delete("/:id", eliminarAddress);

module.exports = router;