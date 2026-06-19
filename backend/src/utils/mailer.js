const nodemailer = require("nodemailer");

const REQUIRED_ENV = [ "EMAIL_HOST", "EMAIL_PORT", "EMAIL_USER", "EMAIL_PASS", "EMAIL_FROM", "FRONTEND_URL" ];

const validarEnv = () => {
    const faltantes = REQUIRED_ENV.filter((clave) => !process.env[clave]);
    if (faltantes.length > 0) {
        throw new Error(`Faltan variables de entorno para el mailer: ${faltantes.join(", ")}`);
    }
};

let transporter = null;

const getTransporter = () => {
    validarEnv();
    if (transporter) return transporter;

    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: Number(process.env.EMAIL_PORT) === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    return transporter;
};

const buildHtml = (resetUrl) => `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #1f2937;">
        <h2 style="color: #111827;">Recuperación de contraseña</h2>
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
        <p>Hacé clic en el siguiente botón para crear una nueva contraseña:</p>
        <p style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}"
               style="background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; display: inline-block; font-weight: bold;">
                Restablecer contraseña
            </a>
        </p>
        <p style="font-size: 13px; color: #6b7280;">
            O copiá y pegá este enlace en tu navegador:<br/>
            <a href="${resetUrl}" style="color: #2563eb;">${resetUrl}</a>
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 13px; color: #6b7280;">
            ⏱️ Este enlace <strong>vence en 15 minutos</strong> y es de <strong>un solo uso</strong>.<br/>
            Si no solicitaste este cambio, podés ignorar este correo: tu contraseña no se modificará.
        </p>
    </div>
`;

/**
 * Envía el correo de recuperación de contraseña.
 * @param {string} to - Email del destinatario.
 * @param {string} resetUrl - Enlace temporal con el token en claro.
 */
const sendPasswordResetEmail = async (to, resetUrl) => {
    const mailer = getTransporter();

    await mailer.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject: "Recuperá tu contraseña",
        html: buildHtml(resetUrl),
        text: `Restablecé tu contraseña con este enlace (vence en 15 minutos, un solo uso): ${resetUrl}`
    });
};

module.exports = { sendPasswordResetEmail };
