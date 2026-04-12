const express = require("express");
const router = express.Router();

const {
    obtenerOrders,
    obtenerOrderPorId,
    crearOrder,
    modificarOrder,
    eliminarOrder
} = require("../controllers/order.controller");

router.get("/", obtenerOrders);
router.get("/:id", obtenerOrderPorId);
router.post("/", crearOrder);
router.put("/:id", modificarOrder);
router.delete("/:id", eliminarOrder);

module.exports = router;