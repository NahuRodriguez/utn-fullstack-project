const mongoose = require("mongoose");
const validate = require("../utils/validation.utils");

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: "" }
}, { timestamps: true });

validate.deleteReferenced(categorySchema, "Product", "categories");

module.exports = mongoose.model("Category", categorySchema);