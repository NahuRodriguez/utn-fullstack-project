import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../store/authStore";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const adminLinks = [
  { to: "/admin", label: "Inicio", exact: true },
  { to: "/admin/productos", label: "Productos" },
  { to: "/admin/usuarios", label: "Usuarios" },
  { to: "/admin/ordenes", label: "Órdenes" },
];

function AdminLayout() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  useEffect(() => {
    if (!isAdmin) {
      navigate({ to: "/" });
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return (
      <div className="auth-wrapper">
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <ShieldAlert size={40} style={{ color: "var(--error)" }} />
          <p style={{ color: "var(--muted)" }}>Acceso restringido al panel de administración.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content" style={{ flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 className="products-title" style={{ marginBottom: "0.25rem" }}>Panel de administración</h1>
        <p className="auth-subtitle">Gestioná productos, usuarios y consultá órdenes</p>
      </div>

      <nav className="navbar" style={{ position: "static", padding: 0, background: "transparent", border: "none" }}>
        <div className="navbar-inner" style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
          {adminLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="navbar-link"
              activeOptions={{ exact: link.exact ?? false }}
              activeProps={{ className: "navbar-link active" }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <Outlet />
    </div>
  );
}
