const { Router } = require("express");
const { login, register, forgotPassword, resetPassword } = require("../controllers/auth.controller");
const { validate } = require("../validations/validate");
const { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } = require("../validations/auth.validation");

const router = Router();

router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema), resetPassword);

module.exports = router;
