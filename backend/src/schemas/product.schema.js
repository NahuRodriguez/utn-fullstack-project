const mongoose = require("mongoose");
const validate = require("../utils/validation.utils");
const userSchema = require("./user.schema");
const categorySchema = require("./category.schema");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    imgUrl: { type: String, default: "" },
    categories: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        validate: validate.schemaReference(categorySchema)
    } ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

productSchema.path("createdBy").validate(validate.schemaReference(userSchema));

module.exports = mongoose.model("Product", productSchema);