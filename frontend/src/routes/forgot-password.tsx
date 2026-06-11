import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Ingresá tu email");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`,
        { email },
      );

      setMessage(
        data.message ||
          "Si el correo existe, recibirás instrucciones para recuperar tu contraseña.",
      );
    } catch (err: any) {
      const msg =
        err.response?.data?.error || "Ocurrió un error. Intentá de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <div className="auth-heading">
          <h1 className="auth-title">Recuperar contraseña</h1>
          <p className="auth-subtitle">
            Ingresá tu email y te enviaremos un enlace para restablecerla.
          </p>
        </div>

        {error && <div className="auth-alert auth-alert-error">{error}</div>}
        {message && (
          <div className="auth-alert auth-alert-success">{message}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="tu@email.com"
              className="auth-input"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-btn-primary">
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>

        <div className="auth-divider">o</div>
        <div className="auth-footer">
          <Link to="/login" className="auth-link">
            Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
