import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Loader, AlertCircle, CheckCircle, Users } from "lucide-react";
import { Api } from "../api/api";
import { AdminModal } from "../components/admin/AdminModal";
import { UserCard } from "../components/admin/UserCard";
import { UserForm } from "../components/admin/UserForm";

export const Route = createFileRoute("/admin/usuarios")({
  component: AdminUsuarios,
});

function AdminUsuarios() {
  const [view, setView] = useState("active"); // "active" | "deleted"
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null => creando

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetcher = view === "deleted" ? Api.fetchDeletedUsers : Api.fetchAllUsers;
      const data = await fetcher();
      setUsers(Array.isArray(data) ? data : data?.data ?? []);
    } catch {
      setError("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  const showSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const switchView = (next) => {
    if (next !== view) setView(next);
  };

  const openCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDeactivate = async (user) => {
    if (!window.confirm(`¿Dar de baja a ${user.firstName} ${user.lastName}?`)) return;
    try {
      await Api.deactivateUser(user.id);
      showSuccess("Usuario dado de baja");
      loadUsers();
    } catch {
      setError("No se pudo dar de baja el usuario");
    }
  };

  const handleRestore = async (user) => {
    try {
      await Api.restoreUser(user.id);
      showSuccess("Usuario reactivado");
      loadUsers();
    } catch {
      setError("No se pudo reactivar el usuario");
    }
  };

  const handleSaved = (msg) => {
    setModalOpen(false);
    showSuccess(msg);
    loadUsers();
  };

  return (
    <section className="products-section" style={{ width: "100%" }}>
      <div className="products-header">
        <h2 className="products-title" style={{ fontSize: "1.5rem" }}>
          Usuarios {view === "deleted" ? "dados de baja" : "activos"}
        </h2>
        {view === "active" && (
          <button
            className="auth-btn-primary"
            onClick={openCreate}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", width: "auto", padding: "0.65rem 1.1rem" }}
          >
            <Plus size={16} /> Nuevo usuario
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <button
          className={`sidebar-item ${view === "active" ? "active" : ""}`}
          onClick={() => switchView("active")}
          style={{ width: "auto", flex: "0 0 auto" }}
        >
          Activos
        </button>
        <button
          className={`sidebar-item ${view === "deleted" ? "active" : ""}`}
          onClick={() => switchView("deleted")}
          style={{ width: "auto", flex: "0 0 auto" }}
        >
          Dados de baja
        </button>
      </div>

      {success && (
        <div className="auth-alert auth-alert-success" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <CheckCircle size={16} /> {success}
        </div>
      )}
      {error && (
        <div className="auth-alert auth-alert-error" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <Loader size={32} className="spin" style={{ color: "var(--muted)" }} />
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Users className="w-12 h-12" style={{ color: "var(--muted)" }} />
          </div>
          <h3 className="empty-title">No hay usuarios para mostrar</h3>
        </div>
      ) : (
        <div className="order-list">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              deleted={view === "deleted"}
              onEdit={openEdit}
              onDeactivate={handleDeactivate}
              onRestore={handleRestore}
            />
          ))}
        </div>
      )}

      <AdminModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? "Editar usuario" : "Nuevo usuario"}
      >
        <UserForm key={editingUser?.id || "new"} user={editingUser} onSaved={handleSaved} />
      </AdminModal>
    </section>
  );
}
