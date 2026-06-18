const express = require("express");
const router = express.Router();
const { verificarToken, soloAdmin } = require("../middleware/auth.middleware");
const { validate } = require("../validations/validate");
const { createOrderSchema } = require("../validations/order.validation");

const {
    obtenerOrders,
    obtenerOrderPorId,
    crearOrder,
    eliminarOrder,
    restaurarOrder,
    obtenerOrderPorUsuario
} = require("../controllers/order.controller");

router.get("/", [ verificarToken, soloAdmin ], obtenerOrders);
router.get("/:id", verificarToken, obtenerOrderPorId);
router.post("/", verificarToken, validate(createOrderSchema), crearOrder);
router.delete("/:id", [ verificarToken, soloAdmin ], eliminarOrder);
router.patch("/restore/:id", [ verificarToken, soloAdmin ], restaurarOrder);
router.get("/user/:targetUserId", verificarToken, obtenerOrderPorUsuario);

module.exports = router;