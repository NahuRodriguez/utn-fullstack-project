const { z } = require("zod");

const createAddressSchema = z.object({
    province: z.string({ required_error: "El campo province es obligatorio" }).min(1, "El campo province no puede estar vacío").trim(),
    city: z.string({ required_error: "El campo city es obligatorio" }).min(1, "El campo city no puede estar vacío").trim(),
    postalCode: z.string({ required_error: "El campo postalCode es obligatorio" }).min(1, "El campo postalCode no puede estar vacío").trim(),
    streetName: z.string({ required_error: "El campo streetName es obligatorio" }).min(1, "El campo streetName no puede estar vacío").trim(),
    buildingNumber: z.number({ required_error: "El campo buildingNumber es obligatorio", invalid_type_error: "El campo buildingNumber debe ser un número entero" }).int("El campo buildingNumber debe ser un número entero"),
    addressDetails: z.string().optional().default("")
});

module.exports = { createAddressSchema };
