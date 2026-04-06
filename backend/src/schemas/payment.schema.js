const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);