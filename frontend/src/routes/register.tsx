import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import axios from "axios";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError("Nombre, apellido, email y contraseña son obligatorios");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        form
      );

      localStorage.setItem("token", data.token);
      setSuccess(true);

      setTimeout(() => navigate({ to: "/productos" }), 1200);
    } catch (err: any) {
      const msg =
        err.response?.data?.error || "Error al registrarse. Intentá de nuevo.";
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
          <h1 className="auth-title">Crear cuenta</h1>
          <p className="auth-subtitle">Completá tus datos para registrarte</p>
        </div>

        {/* Alertas */}
        {error && (
          <div className="auth-alert auth-alert-error">{error}</div>
        )}
        {success && (
          <div className="auth-alert auth-alert-success">
            ¡Cuenta creada! Redirigiendo...
          </div>
        )}

        {/* Formulario */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="auth-field">
              <label htmlFor="firstName" className="auth-label">Nombre</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Juan"
                className="auth-input"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="lastName" className="auth-label">Apellido</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Pérez"
                className="auth-input"
              />
            </div>
          </div>

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
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="phone" className="auth-label">
              Teléfono <span style={{ color: "var(--muted)", fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+541112345678"
              className="auth-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="auth-btn-primary"
          >
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        {/* Ir a login */}
        <div className="auth-divider">o</div>
        <div className="auth-footer">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="auth-link">
            Iniciá sesión
          </Link>
        </div>

      </div>
    </div>
  );
}
