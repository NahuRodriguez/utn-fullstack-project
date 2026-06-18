const { verificarToken, soloAdmin } = require("../middleware/auth.middleware");
const { multerImage } = require("../middleware/multer");
const { validate } = require("../validations/validate");
const { createProductSchema, updateProductSchema } = require("../validations/product.validation");

const express = require("express");
const router = express.Router();

const {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    modificarProducto,
    eliminarProducto,
    restaurarProducto
} = require("../controllers/productos.controller");

router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);
router.post("/", [ multerImage, validate(createProductSchema), verificarToken, soloAdmin ], crearProducto);
router.put("/:id", [ verificarToken, soloAdmin, validate(updateProductSchema) ], modificarProducto);
router.delete("/:id", [ verificarToken, soloAdmin ], eliminarProducto);
router.patch("/restore/:id", [ verificarToken, soloAdmin ], restaurarProducto);

module.exports = router;