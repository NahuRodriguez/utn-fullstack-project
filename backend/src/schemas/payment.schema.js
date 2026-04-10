const mongoose = require("mongoose");
const validate = require("../utils/validation.utils");
const orderSchema = require("./order.schema");

const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    amount: { type: Number, required: true, min: 0 }
}, { timestamps: true });

paymentSchema.path("orderId").validate(validate.schemaReference(orderSchema));

module.exports = mongoose.model("Payment", paymentSchema);