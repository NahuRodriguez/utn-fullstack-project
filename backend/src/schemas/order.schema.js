const mongoose = require("mongoose");
const validate = require("../utils/validation.utils");

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, unique: true },
    quantity: { type: Number, required: true, min: 0 },
    priceAtPurchase: { type: Number, required: true, min: 0 }
});

orderItemSchema.path("productId").validate(validate.schemaReference("Product"));

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
    items: [ orderItemSchema ],
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: [ "PENDING", "SHIPPED", "CANCELLED" ], default: "PENDING" }
}, { timestamps: true });

orderSchema.path("userId").validate(validate.schemaReference("User"));
orderSchema.path("addressId").validate(validate.schemaReference("Address"));

validate.deleteReferenced(orderSchema, "Payment", "orderId");

module.exports = mongoose.model("Order", orderSchema);