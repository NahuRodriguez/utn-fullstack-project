const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: [ "USER", "ADMIN" ], default: "USER" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);