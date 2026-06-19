const { z } = require("zod");

const createCategorySchema = z.object({
    name: z.string({ required_error: "El campo name es obligatorio" }).min(1, "El campo name no puede estar vacío").trim(),
    description: z.string().optional().default("")
});

const updateCategorySchema = z.object({
    name: z.string({ required_error: "El campo name es obligatorio" }).min(1, "El campo name no puede estar vacío").trim().optional(),
    description: z.string().optional()
});

module.exports = { createCategorySchema, updateCategorySchema };
