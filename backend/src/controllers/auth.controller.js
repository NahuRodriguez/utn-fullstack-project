const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../schemas/user.schema");

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
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3h" });

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
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3h" });

        return res.status(201).json({ token });
    } catch (err) {
        console.error("Error en register", err);
        res.status(500).json({ error: "Error interno" });
    }
};

module.exports = { login, register };
