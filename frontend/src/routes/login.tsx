import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "../store/authStore";
import axios from "axios";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Email y contraseña son obligatorios");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        form
      );

      login(data.token);
      setSuccess(true);

      setTimeout(() => navigate({ to: "/productos" }), 1200);
    } catch (err: any) {
      const msg =
        err.response?.data?.error || "Error al iniciar sesión. Intentá de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h1 className="auth-title">Iniciar sesión</h1>
          <p className="auth-subtitle">Ingresá con tu cuenta para continuar</p>
        </div>

        {/* Alertas */}
        {error && (
          <div className="auth-alert auth-alert-error">{error}</div>
        )}
        {success && (
          <div className="auth-alert auth-alert-success">
            ¡Sesión iniciada! Redirigiendo...
          </div>
        )}

        {/* Formulario */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="auth-input"
            />
          </div>

          <div className="auth-field" style={{ textAlign: "right" }}>
            <Link to="/forgot-password" className="auth-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="auth-btn-primary"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Ir a registro */}
        <div className="auth-divider">o</div>
        <div className="auth-footer">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="auth-link">
            Registrate
          </Link>
        </div>

      </div>
    </div>
  );
}
