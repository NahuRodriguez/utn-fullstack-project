const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const validate = require("../utils/validation.utils");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    imgUrl: { type: String, default: "" },
    categories: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        validate: validate.schemaReference("Category")
    } ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

productSchema.path("categories").validate( { validator: (array) => array.length > 0, message: "Se espera al menos una categoría" } );

productSchema.path("createdBy").validate(validate.schemaReference("User"));

validate.deleteReferenced(productSchema, "Order", "items.productId");

productSchema.plugin(mongooseDelete, { overrideMethods: true, validateBeforeDelete: false });

module.exports = mongoose.model("Product", productSchema);