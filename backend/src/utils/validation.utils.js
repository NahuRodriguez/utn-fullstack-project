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

schemaReference = (schema) => {
    return {
        validator: async (value) => Boolean(await schema.findById(value)),
        message: `Reference to ${schema.modelName} does not exist`
    };
}



module.exports = {
    alphanumericHispanic,
    alphanumericHispanicWithSpaces,
    email,
    phone,
    postalCode,
    schemaReference
}