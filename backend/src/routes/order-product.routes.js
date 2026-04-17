const express = require("express");
const router = express.Router();

const {
    crearProductoEnOrden,
    modificarProductoEnOrden,
    eliminarProductoEnOrden
} = require("../controllers/order-product.controller");

router.post("/:id", crearProductoEnOrden);
router.put("/:id", modificarProductoEnOrden);
router.delete("/:id", eliminarProductoEnOrden);

module.exports = router;