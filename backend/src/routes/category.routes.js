const express = require("express");
const router = express.Router();

const { verificarToken, soloAdmin } = require("../middleware/auth.middleware");
const { validate } = require("../validations/validate");
const { createCategorySchema, updateCategorySchema } = require("../validations/category.validation");

const {
    obtenerCategories,
    obtenerCategoryPorId,
    crearCategory,
    modificarCategory,
    eliminarCategory,
    restaurarCategory
} = require("../controllers/category.controller");

router.get("/", obtenerCategories);
router.get("/:id", obtenerCategoryPorId);
router.post("/", [ verificarToken, soloAdmin, validate(createCategorySchema) ], crearCategory);
router.put("/:id", [ verificarToken, soloAdmin, validate(updateCategorySchema) ], modificarCategory);
router.delete("/:id", [ verificarToken, soloAdmin ], eliminarCategory);
router.patch("/restore/:id", [ verificarToken, soloAdmin ], restaurarCategory);

module.exports = router;