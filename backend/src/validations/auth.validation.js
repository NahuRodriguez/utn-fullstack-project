const { z } = require("zod");

const registerSchema = z.object({
    firstName: z.string({ required_error: "El campo firstName es obligatorio" }).min(1, "El campo firstName no puede estar vacío").trim(),
    lastName: z.string({ required_error: "El campo lastName es obligatorio" }).min(1, "El campo lastName no puede estar vacío").trim(),
    email: z.string({ required_error: "El campo email es obligatorio" }).email("El email ingresado no es válido"),
    password: z.string({ required_error: "El campo password es obligatorio" }).min(6, "La contraseña debe tener al menos 6 caracteres"),
    phone: z.string().optional()
});

const loginSchema = z.object({
    email: z.string({ required_error: "El campo email es obligatorio" }).email("El email ingresado no es válido"),
    password: z.string({ required_error: "El campo password es obligatorio" }).min(1, "La contraseña no puede estar vacía")
});

const forgotPasswordSchema = z.object({
    email: z.string({ required_error: "El campo email es obligatorio" }).email("El email ingresado no es válido")
});

const resetPasswordSchema = z.object({
    password: z.string({ required_error: "El campo password es obligatorio" }).min(6, "La contraseña debe tener al menos 6 caracteres")
});

module.exports = { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema };
