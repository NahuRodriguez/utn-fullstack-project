const express = require("express");
const router = express.Router();

const {
    obtenerPayments,
    obtenerPaymentPorId,
    crearPayment,
    modificarPayment,
    eliminarPayment
} = require("../controllers/payment.controller");

router.get("/", obtenerPayments);
router.get("/:id", obtenerPaymentPorId);
router.post("/", crearPayment);
router.put("/:id", modificarPayment);
router.delete("/:id", eliminarPayment);

module.exports = router;