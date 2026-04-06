const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    streetName: { type: String, required: true, trim: true },
    buildingNumber: { type: Number, required: true },
    addressDetails: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Address", addressSchema);