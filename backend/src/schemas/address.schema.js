const mongoose = require("mongoose");
const validate = require("../utils/validation.utils");
const mongooseDelete = require("mongoose-delete");

const addressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    province: {
        type: String,
        required: true,
        validate: [
            {
                validator: validate.alphaNumHispForAddressNames,
                message: "Province only allows Alphanumeric and Space characters"
            }
        ]
    },
    city: {
        type: String,
        required: true,
        validate: {
            validator: validate.alphaNumHispForAddressNames,
            message: "City only allows Alphanumeric and Space characters"
        }
    },
    postalCode: {
        type: String,
        required: true,
        validate: {
            validator: validate.alphaNumHispForAddressNames,
            message: "Postal code only allows XXXX and X0000XXX formats (X for uppercase letter, 0 for number)"
        }
    },
    streetName: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: validate.alphaNumHispForAddressNames
        }
    },
    buildingNumber: { type: Number, required: true },
    addressDetails: { type: String, default: "" }
}, { timestamps: true });

addressSchema.path("userId").validate(validate.schemaReference("User"));

validate.deleteReferenced(addressSchema, "Order", "addressId");

addressSchema.plugin(mongooseDelete, { overrideMethods: true, validateBeforeDelete: false });

module.exports = mongoose.model("Address", addressSchema);