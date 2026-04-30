const express = require("express");
const router = express.Router();

const {
    obtenerCategories,
    obtenerCategoryPorId,
    crearCategory,
    modificarCategory,
    eliminarCategory
} = require("../controllers/category.controller");

router.get("/", obtenerCategories);
router.get("/:id", obtenerCategoryPorId);
router.post("/", crearCategory);
router.put("/:id", modificarCategory);
router.delete("/:id", eliminarCategory);

module.exports = router;