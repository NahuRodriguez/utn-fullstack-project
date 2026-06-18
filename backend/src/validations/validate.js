const { z } = require("zod");

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const errorMessages = result.error.issues.map((issue) => {
            const field = issue.path.join(".");
            let message = issue.message;

            if (issue.code === "invalid_type" && issue.message.endsWith("received undefined")) {
                message = `El campo ${field} es obligatorio`;
            }

            return { field, message };
        });

        return res.status(400).json({
            status: "error",
            errors: errorMessages
        });
    }

    req.body = result.data;
    next();
};

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Formato de ID inválido");

module.exports = { validate, objectId };
