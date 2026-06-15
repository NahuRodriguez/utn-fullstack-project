const mongoose = require("mongoose");
const validate = require("../utils/validation.utils");
const mongooseDelete = require("mongoose-delete");

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, default: "" }
}, { timestamps: true });

validate.deleteReferenced(categorySchema, "Product", "categories");

categorySchema.plugin(mongooseDelete, { overrideMethods: true, validateBeforeDelete: false });

module.exports = mongoose.model("Category", categorySchema);