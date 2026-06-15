const express = require("express");
const router = express.Router();
const orderItemRoutes = require("./order-product.routes");

const {
    obtenerOrders,
    obtenerOrderPorId,
    crearOrder,
    modificarOrder,
    eliminarOrder,
    restaurarOrder
} = require("../controllers/order.controller");

router.get("/", obtenerOrders);
router.get("/:id", obtenerOrderPorId);
router.post("/", crearOrder);
router.put("/:id", modificarOrder);
router.delete("/:id", eliminarOrder);
router.patch("/restore/:id", restaurarOrder);

router.use("/items", orderItemRoutes);

module.exports = router;