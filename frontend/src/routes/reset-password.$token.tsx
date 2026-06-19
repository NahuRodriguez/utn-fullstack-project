import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute("/reset-password/$token")({
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  // Token leído desde la URL (/reset-password/:token).
  const { token } = Route.useParams();

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password/${token}`,
        { password: form.password },
      );

      setSuccess(true);
      setTimeout(() => navigate({ to: "/login" }), 1500);
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        "No se pudo actualizar la contraseña. El enlace puede haber expirado.";
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
          <h1 className="auth-title">Nueva contraseña</h1>
          <p className="auth-subtitle">
            Ingresá y confirmá tu nueva contraseña.
          </p>
        </div>

        {error && <div className="auth-alert auth-alert-error">{error}</div>}
        {success && (
          <div className="auth-alert auth-alert-success">
            ¡Contraseña actualizada! Redirigiendo al login...
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              Nueva contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirm" className="auth-label">
              Repetir contraseña
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={handleChange}
              placeholder="••••••••"
              className="auth-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="auth-btn-primary"
          >
            {loading ? "Actualizando..." : "Actualizar contraseña"}
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
