const { z } = require("zod");
const { objectId } = require("./validate");

const createProductSchema = z.object({
    name: z.string({ required_error: "El campo name es obligatorio" }).min(1, "El campo name no puede estar vacío").trim(),
    description: z.string().optional().default(""),
    price: z.coerce.number({ required_error: "El campo price es obligatorio", invalid_type_error: "El campo price debe ser un número" }).min(0, "El precio debe ser mayor o igual a 0"),
    stock: z.coerce.number({ required_error: "El campo stock es obligatorio", invalid_type_error: "El campo stock debe ser un número entero" }).int("El campo stock debe ser un número entero").min(0, "El stock debe ser mayor o igual a 0"),
    categories: z.preprocess(
        (value) => (value === undefined ? value : Array.isArray(value) ? value : [ value ]),
        z.array(objectId, { required_error: "El campo categories es obligatorio" }).min(1, "Se espera al menos una categoría")
    ),
    createdBy: objectId.optional()
});

const updateProductSchema = z.object({
    name: z.string().min(1, "El campo name no puede estar vacío").trim().optional(),
    description: z.string().optional(),
    price: z.number({ invalid_type_error: "El campo price debe ser un número" }).min(0, "El precio debe ser mayor o igual a 0").optional(),
    stock: z.number({ invalid_type_error: "El campo stock debe ser un número entero" }).int("El campo stock debe ser un número entero").min(0, "El stock debe ser mayor o igual a 0").optional(),
    categories: z.array(objectId).min(1, "Se espera al menos una categoría").optional(),
    createdBy: objectId.optional()
});

module.exports = { createProductSchema, updateProductSchema };
