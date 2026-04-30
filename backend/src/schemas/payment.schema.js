const mongoose = require("mongoose");
const validate = require("../utils/validation.utils");

const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true, min: 0 }
}, { timestamps: true });

paymentSchema.path("orderId").validate(validate.schemaReference("Order"));

module.exports = mongoose.model("Payment", paymentSchema);