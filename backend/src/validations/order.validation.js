const { z } = require("zod");
const { objectId } = require("./validate");

const orderItemSchema = z.object({
    productId: z.string({ required_error: "El campo productId es obligatorio" }).regex(/^[a-f\d]{24}$/i, "Formato de ID inválido"),
    quantity: z.number({ required_error: "El campo quantity es obligatorio", invalid_type_error: "El campo quantity debe ser un número entero" }).int("El campo quantity debe ser un número entero").min(1, "La cantidad debe ser al menos 1")
});

const createOrderSchema = z.object({
    addressId: z.string({ required_error: "El campo addressId es obligatorio" }).regex(/^[a-f\d]{24}$/i, "Formato de ID inválido"),
    items: z.array(orderItemSchema, { required_error: "El campo items es obligatorio" }).min(1, "Se espera al menos un item en la orden")
});

module.exports = { createOrderSchema };
