const mongoose = require("mongoose");
const validate = require("../utils/validation.utils");
const mongooseDelete = require("mongoose-delete");

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 0 },
    priceAtPurchase: { type: Number, required: true, min: 0 }
});

orderItemSchema.path("productId").validate(validate.schemaReference("Product"));

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
    items: [ orderItemSchema ],
    total: { type: Number, required: true, min: 0 },
}, { timestamps: true });

orderSchema.path("userId").validate(validate.schemaReference("User"));
orderSchema.path("addressId").validate(validate.schemaReference("Address"));

validate.deleteReferenced(orderSchema, "Payment", "orderId");

orderSchema.plugin(mongooseDelete, { overrideMethods: true, validateBeforeDelete: false });

module.exports = mongoose.model("Order", orderSchema);