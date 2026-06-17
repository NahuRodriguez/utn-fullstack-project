const express = require("express");
const router = express.Router();
// const orderItemRoutes = require("./order-product.routes");
const { verificarToken, soloAdmin } = require("../middleware/auth.middleware");

const {
    obtenerOrders,
    obtenerOrderPorId,
    crearOrder,
    // modificarOrder,
    eliminarOrder,
    restaurarOrder,
    obtenerOrderPorUsuario
} = require("../controllers/order.controller");

router.get("/", [verificarToken, soloAdmin], obtenerOrders);
router.get("/:id", verificarToken, obtenerOrderPorId);
router.post("/",  verificarToken, crearOrder);
// router.put("/:id", modificarOrder); Ver si existe un caso de uso para modificar una orden
router.delete("/:id", [verificarToken, soloAdmin], eliminarOrder);
router.patch("/restore/:id", [verificarToken, soloAdmin], restaurarOrder);
router.get("/user/:targetUserId", verificarToken, obtenerOrderPorUsuario);
// router.use("/items", orderItemRoutes); Sobreecrito por la nueva estructura de orden con items embebidos, no es necesario un subrouter para los items

module.exports = router;