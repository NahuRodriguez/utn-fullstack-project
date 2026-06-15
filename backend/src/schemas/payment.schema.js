const mongoose = require("mongoose");
const validate = require("../utils/validation.utils");
const mongooseDelete = require("mongoose-delete");

const paymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    amount: { type: Number, required: true, min: 0 }
}, { timestamps: true });

paymentSchema.path("orderId").validate(validate.schemaReference("Order"));

paymentSchema.plugin(mongooseDelete, { overrideMethods: true, validateBeforeDelete: false });

module.exports = mongoose.model("Payment", paymentSchema);