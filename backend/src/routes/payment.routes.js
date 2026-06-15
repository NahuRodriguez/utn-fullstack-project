const express = require("express");
const router = express.Router();

const {
    obtenerPayments,
    obtenerPaymentPorId,
    crearPayment,
    modificarPayment,
    eliminarPayment,
    restaurarPayment
} = require("../controllers/payment.controller");

router.get("/", obtenerPayments);
router.get("/:id", obtenerPaymentPorId);
router.post("/", crearPayment);
router.put("/:id", modificarPayment);
router.delete("/:id", eliminarPayment);
router.patch("/restore/:id", restaurarPayment);

module.exports = router;