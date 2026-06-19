const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../schemas/user.schema");
const { sendPasswordResetEmail } = require("../utils/mailer");

const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son obligatorios" });
    }

    try {
        // password tiene select:false en el schema, hay que pedirlo explicitamente
        const usuario = await User.findOne({ email }).select("+password");
        if (!usuario) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        const igual = await bcrypt.compare(password, usuario.password);
        if (!igual) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        if (!usuario.isActive) {
            return res.status(403).json({ error: "Usuario inactivo" });
        }

        const payload = { id: usuario._id.toString(), role: usuario.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        return res.json({ token });
    } catch (err) {
        console.error("Error en login", err);
        res.status(500).json({ error: "Error interno" });
    }
};

const register = async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "firstName, lastName, email y password son obligatorios" });
    }

    try {
        const existente = await User.findOne({ email });
        if (existente) {
            return res.status(409).json({ error: "El email ya está registrado" });
        }

        // El pre-save hook del schema se encarga del hash del password
        const usuario = await User.create({ firstName, lastName, email, password, ...(phone ? { phone } : {}) });

        const payload = { id: usuario._id.toString(), role: usuario.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        return res.status(201).json({ token });
    } catch (err) {
        console.error("Error en register", err);
        res.status(500).json({ error: "Error interno" });
    }
};

const GENERIC_FORGOT_MSG = "Si el correo existe, recibirás instrucciones para recuperar tu contraseña.";

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "El email es obligatorio" });
    }

    try {
        const usuario = await User.findOne({ email });

        if (usuario && usuario.isActive) {
            const token = crypto.randomBytes(32).toString("hex");

            usuario.resetPasswordToken = hashToken(token);
            usuario.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
            await usuario.save();

            const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

            try {
                await sendPasswordResetEmail(usuario.email, resetUrl);
            } catch (mailErr) {
                console.error("Error enviando email de recuperación", mailErr);
                usuario.resetPasswordToken = undefined;
                usuario.resetPasswordExpires = undefined;
                await usuario.save();
                return res.status(500).json({ error: "No se pudo enviar el correo. Intentá más tarde." });
            }
        }

        return res.json({ message: GENERIC_FORGOT_MSG });
    } catch (err) {
        console.error("Error en forgotPassword", err);
        res.status(500).json({ error: "Error interno" });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
        return res.status(400).json({ error: "Token no provisto" });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    try {
        const tokenHash = hashToken(token);
        const usuario = await User.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: new Date() }
        }).select("+password +resetPasswordToken +resetPasswordExpires");

        if (!usuario) {
            return res.status(400).json({ error: "Token inválido o expirado" });
        }

        usuario.password = password;

        usuario.resetPasswordToken = undefined;
        usuario.resetPasswordExpires = undefined;
        await usuario.save();

        return res.json({ message: "Contraseña actualizada correctamente" });
    } catch (err) {
        console.error("Error en resetPassword", err);
        res.status(500).json({ error: "Error interno" });
    }
};

module.exports = { login, register, forgotPassword, resetPassword };
