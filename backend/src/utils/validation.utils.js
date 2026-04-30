const mongoose = require("mongoose");

alphanumericHispanicWithSpaces = (value) => {
    return /^[a-zñáéíóú ]+$/gi.test(value);
}

alphanumericHispanic = (value) => {
    return /^[a-zñáéíóú]+$/gi.test(value);
}

email = (value) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
}

phone = (value) => {
    return /^\+[0-9]+$/.test(value);
}

postalCode = (value) => {
    const regexCPViejo = /^[0-9]{4}$/;
    const regexCPNuevo = /^[A-Z][0-9]{4}[A-Z]{3}$/;
    return regexCPViejo.test(value) || regexCPNuevo.test(value);
}

schemaReference = (modelName) => {
    return {
        validator: async (value) => Boolean(await mongoose.model(modelName).findById(value)),
        message: `Reference to ${modelName} does not exist`
    };
}

deleteReferenced = (mainSchema, checkModelName, field) => {
    mainSchema.pre("findOneAndDelete", async function() {
        const error = new mongoose.Error.ValidationError(new mongoose.MongooseError());
        if (await mongoose.model(checkModelName).findOne({ [ field ] : this.getQuery()._id})) {
            error.errors = { ...error.errors, [ `${checkModelName}` ] : "Document requested for deletion has another document referencing it" }
        }
        if (Object.keys(error.errors).length !== 0) throw error;
        return;
    })
}

module.exports = {
    alphanumericHispanic,
    alphanumericHispanicWithSpaces,
    email,
    phone,
    postalCode,
    schemaReference,
    deleteReferenced
}