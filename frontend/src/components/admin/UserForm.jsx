import { useState } from "react";
import { AlertCircle, Shield } from "lucide-react";
import { Api } from "../../api/api";
import { SaveButton } from "../button/SaveButton";

const reEmail = (value) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
const reName = (value) => /^[a-z0-9ñáéíóú ]+$/gi.test(value);
const rePhone = (value) => /^\+?[0-9]+$/.test(value);


export function UserForm({ user, onSaved }) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    password: "",
    phone: user?.phone ?? "",
    role: user?.role ?? "USER",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim() || !reName(form.firstName)) e.firstName = "Nombre inválido";
    if (!form.lastName.trim() || !reName(form.lastName)) e.lastName = "Apellido inválido";
    if (!reEmail(form.email)) e.email = "Email inválido";
    if (!isEdit && form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (isEdit && form.password && form.password.length < 6) e.password = "Mínimo 6 caracteres";
    if (form.phone.trim() && !rePhone(form.phone)) e.phone = "Solo números y +";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setFormError(null);
    try {
      if (isEdit) {
        const payload = {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          role: form.role,
        };
        if (form.password) payload.password = form.password;
        await Api.updateUser(user.id, payload);
        onSaved("Usuario actualizado");
      } else {
        await Api.createUser({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
          ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
        });
        onSaved("Usuario creado");
      }
    } catch (err) {
      setFormError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.response?.data?.mensaje ||
          "Error al guardar el usuario"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {formError && (
        <div className="auth-alert auth-alert-error" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <AlertCircle size={16} /> {formError}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="auth-field">
          <label className="auth-label">Nombre</label>
          <input className="auth-input" value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} style={errors.firstName ? { borderColor: "var(--error)" } : {}} />
          {errors.firstName && <span style={{ fontSize: "0.75rem", color: "var(--error)" }}>{errors.firstName}</span>}
        </div>
        <div className="auth-field">
          <label className="auth-label">Apellido</label>
          <input className="auth-input" value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} style={errors.lastName ? { borderColor: "var(--error)" } : {}} />
          {errors.lastName && <span style={{ fontSize: "0.75rem", color: "var(--error)" }}>{errors.lastName}</span>}
        </div>
      </div>

      <div className="auth-field">
        <label className="auth-label">Email</label>
        <input className="auth-input" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} style={errors.email ? { borderColor: "var(--error)" } : {}} />
        {errors.email && <span style={{ fontSize: "0.75rem", color: "var(--error)" }}>{errors.email}</span>}
      </div>

      <div className="auth-field">
        <label className="auth-label">
          Contraseña {isEdit && <span style={{ color: "var(--muted)", fontWeight: 400 }}>(dejar vacío para no cambiar)</span>}
        </label>
        <input className="auth-input" type="password" value={form.password} onChange={(e) => setField("password", e.target.value)} style={errors.password ? { borderColor: "var(--error)" } : {}} />
        {errors.password && <span style={{ fontSize: "0.75rem", color: "var(--error)" }}>{errors.password}</span>}
      </div>

      <div className="auth-field">
        <label className="auth-label">
          Teléfono <span style={{ color: "var(--muted)", fontWeight: 400 }}>(opcional)</span>
        </label>
        <input className="auth-input" type="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)} style={errors.phone ? { borderColor: "var(--error)" } : {}} />
        {errors.phone && <span style={{ fontSize: "0.75rem", color: "var(--error)" }}>{errors.phone}</span>}
      </div>

      {isEdit && (
        <div className="auth-field">
          <label className="auth-label" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <Shield size={14} /> Rol
          </label>
          <select className="auth-input" value={form.role} onChange={(e) => setField("role", e.target.value)} style={{ fontFamily: "inherit" }}>
            <option value="USER">Usuario</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
      )}

      <SaveButton saving={saving} />
    </form>
  );
}
