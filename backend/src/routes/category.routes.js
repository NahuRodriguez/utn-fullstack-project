const express = require("express");
const router = express.Router();

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
router.post("/", crearCategory);
router.put("/:id", modificarCategory);
router.delete("/:id", eliminarCategory);
router.patch("/restore/:id", restaurarCategory);

module.exports = router;