import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '../store/authStore';
import { Api } from '../api/api';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  X,
  Loader,
  Save,
  Edit3,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const alphanumericHispanicWithSpaces = (value) => /^[a-z0-9ñáéíóú ]+$/gi.test(value);
const alphanumericHispanic = (value) => /^[a-z0-9ñáéíóú]+$/gi.test(value);
const email = (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
const phone = (value) => /^\+?[0-9]+$/.test(value);

export const Route = createFileRoute('/user-profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await Api.fetchUserProfile(user.id);
      setProfile(data);
      setForm({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
      });
    } catch {
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    if (name === 'firstName' || name === 'lastName') {
      if (!value.trim()) return 'Este campo es obligatorio';
      if (!alphanumericHispanicWithSpaces(value)) return 'Solo letras, números y espacios';
    }
    if (name === 'email') {
      if (!value.trim()) return 'El email es obligatorio';
      if (!email(value)) return 'Email inválido';
    }
    if (name === 'phone' && value.trim()) {
      if (!phone(value)) return 'Solo números y +';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const errors = {};
    for (const field of ['firstName', 'lastName', 'email', 'phone']) {
      const err = validateField(field, form[field]);
      if (err) errors[field] = err;
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await Api.updateUserProfile(user.id, form);
      const fresh = await Api.fetchUserProfile(user.id);
      setProfile(fresh);
      setEditing(false);
      setFieldErrors({});
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al guardar los cambios. Email ya registrado.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      email: profile.email || '',
      phone: profile.phone || '',
    });
    setEditing(false);
    setError(null);
    setFieldErrors({});
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="auth-wrapper">
        <div style={{ textAlign: 'center' }}>
          <Loader size={32} className="spin" style={{ color: 'var(--muted)' }} />
          <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '32rem', gap: '1.5rem' }}>

        {/* Avatar + Heading */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '4.5rem',
            height: '4.5rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--purple) 0%, var(--cyan) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(139, 92, 246, 0.35)',
          }}>
            <User size={28} color="white" />
          </div>
          <div className="auth-heading">
            <h1 className="auth-title">Mi Perfil</h1>
            <p className="auth-subtitle">
              {editing ? 'Editá tus datos personales' : 'Revisá y gestioná tu información'}
            </p>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="auth-alert auth-alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <CheckCircle size={16} />
            Cambios guardados correctamente
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="auth-alert auth-alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Profile Info / Edit Form */}
        {editing ? (
          <form className="auth-form" onSubmit={handleSave} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="auth-field">
                <label htmlFor="firstName" className="auth-label">Nombre</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="Juan"
                  style={fieldErrors.firstName ? { borderColor: 'var(--error)' } : {}}
                  required
                />
                {fieldErrors.firstName && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '0.25rem' }}>{fieldErrors.firstName}</span>
                )}
              </div>
              <div className="auth-field">
                <label htmlFor="lastName" className="auth-label">Apellido</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="Pérez"
                  style={fieldErrors.lastName ? { borderColor: 'var(--error)' } : {}}
                  required
                />
                {fieldErrors.lastName && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '0.25rem' }}>{fieldErrors.lastName}</span>
                )}
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="email" className="auth-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="auth-input"
                placeholder="tu@email.com"
                style={fieldErrors.email ? { borderColor: 'var(--error)' } : {}}
                required
              />
              {fieldErrors.email && (
                <span style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '0.25rem' }}>{fieldErrors.email}</span>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="phone" className="auth-label">
                Teléfono <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(opcional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="auth-input"
                placeholder="+541112345678"
                style={fieldErrors.phone ? { borderColor: 'var(--error)' } : {}}
              />
              {fieldErrors.phone && (
                <span style={{ fontSize: '0.75rem', color: 'var(--error)', marginTop: '0.25rem' }}>{fieldErrors.phone}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--purple)'; e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                <X size={16} />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="auth-btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {saving ? (
                  <><Loader size={16} className="spin" /> Guardando...</>
                ) : (
                  <><Save size={16} /> Guardar</>
                )}
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Info Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <InfoRow icon={User} label="Nombre" value={`${profile?.firstName || '—'} ${profile?.lastName || ''}`} />
              <InfoRow icon={Mail} label="Email" value={profile?.email || '—'} />
              <InfoRow icon={Phone} label="Teléfono" value={profile?.phone || '—'} />
              <InfoRow icon={Calendar} label="Miembro desde" value={formatDate(profile?.createdAt)} />
              <InfoRow
                icon={Shield}
                label="Rol"
                value={profile?.role === 'ADMIN' ? 'Administrador' : 'Usuario'}
                valueStyle={profile?.role === 'ADMIN' ? { color: 'var(--purple)', fontWeight: 600 } : {}}
              />
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setEditing(true)}
              className="auth-btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Edit3 size={16} />
              Editar perfil
            </button>
          </>
        )}

      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, valueStyle }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.875rem',
      padding: '0.875rem 1rem',
      background: 'var(--dark)',
      border: '1px solid var(--border)',
      borderRadius: '0.75rem',
      transition: 'border-color 0.2s ease',
    }}>
      <div style={{
        width: '2.25rem',
        height: '2.25rem',
        borderRadius: '0.625rem',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={16} style={{ color: 'var(--purple)' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', marginBottom: '0.125rem' }}>
          {label}
        </div>
        <div style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text)', ...valueStyle }}>
          {value}
        </div>
      </div>
    </div>
  );
}