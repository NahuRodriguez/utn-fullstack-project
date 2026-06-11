const { Router } = require("express");
const { login, register, forgotPassword, resetPassword } = require("../controllers/auth.controller");

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
