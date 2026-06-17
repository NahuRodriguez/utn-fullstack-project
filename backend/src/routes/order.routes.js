const express = require("express");
const router = express.Router();
const orderItemRoutes = require("./order-product.routes");
const { verificarToken } = require("../middleware/auth.middleware");

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
router.post("/",  verificarToken, crearOrder);
router.put("/:id", modificarOrder);
router.delete("/:id", eliminarOrder);
router.patch("/restore/:id", restaurarOrder);

router.use("/items", orderItemRoutes);

module.exports = router;