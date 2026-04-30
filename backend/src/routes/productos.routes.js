const { multerImage } = require("../middleware/multer");

const express = require("express");
const router = express.Router();

const {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    modificarProducto,
    eliminarProducto
} = require("../controllers/productos.controller");

router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);
router.post("/", multerImage, crearProducto);
router.put("/:id", modificarProducto);
router.delete("/:id", eliminarProducto);

module.exports = router;