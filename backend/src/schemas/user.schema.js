const mongoose = require("mongoose");
const validate = require("../utils/validation.utils");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: validate.alphanumericHispanicWithSpaces,
            message: "Name only allows Alphanumeric and Space characters"
        }
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: validate.alphanumericHispanicWithSpaces,
            message: "Name only allows Alphanumeric and Space characters"
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: validate.email,
            message: "Not a valid email"
        }
    },
    phone: {
        type: String,
        validate: {
            validator: validate.phone,
            message: "Phone only allows Numbers and a leading +. No spaces or hyphens."
        }
    },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: [ "USER", "ADMIN" ], default: "USER" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);