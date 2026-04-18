const express = require("express");
const router = express.Router();

const {
    crearProductoEnOrden,
    modificarProductoEnOrden,
    eliminarProductoEnOrden
} = require("../controllers/order-product.controller");

router.post("/:orderId/:productId", crearProductoEnOrden);
router.put("/:orderId/:productId", modificarProductoEnOrden);
router.delete("/:orderId/:productId", eliminarProductoEnOrden);

module.exports = router;