const { z } = require("zod");

const createUserSchema = z.object({
    firstName: z.string({ required_error: "El campo firstName es obligatorio" }).min(1, "El campo firstName no puede estar vacío").trim(),
    lastName: z.string({ required_error: "El campo lastName es obligatorio" }).min(1, "El campo lastName no puede estar vacío").trim(),
    email: z.string({ required_error: "El campo email es obligatorio" }).email("El email ingresado no es válido"),
    password: z.string({ required_error: "El campo password es obligatorio" }).min(6, "La contraseña debe tener al menos 6 caracteres"),
    phone: z.string().optional()
});

const updateUserSchema = z.object({
    firstName: z.string({ required_error: "El campo firstName es obligatorio" }).min(1, "El campo firstName no puede estar vacío").trim().optional(),
    lastName: z.string({ required_error: "El campo lastName es obligatorio" }).min(1, "El campo lastName no puede estar vacío").trim().optional(),
    email: z.string({ required_error: "El campo email es obligatorio" }).email("El email ingresado no es válido").optional(),
    password: z.string({ required_error: "El campo password es obligatorio" }).min(6, "La contraseña debe tener al menos 6 caracteres").optional(),
    phone: z.string().optional(),
    role: z.enum([ "USER", "ADMIN" ], { required_error: "El rol debe ser USER o ADMIN" }).optional()
});

module.exports = { createUserSchema, updateUserSchema };
