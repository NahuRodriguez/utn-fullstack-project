import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Users, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const cards = [
  {
    to: "/admin/productos",
    icon: Package,
    title: "Productos",
    description: "Crear, editar, dar de baja y reactivar productos.",
  },
  {
    to: "/admin/usuarios",
    icon: Users,
    title: "Usuarios",
    description: "Ver, editar, dar de baja y reactivar usuarios.",
  },
  {
    to: "/admin/ordenes",
    icon: ShoppingBag,
    title: "Órdenes",
    description: "Consultar las órdenes de compra (solo lectura).",
  },
];

function AdminDashboard() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
        gap: "1.25rem",
      }}
    >
      {cards.map(({ to, icon: Icon, title, description }) => (
        <Link
          key={to}
          to={to}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            padding: "1.5rem",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "1rem",
            textDecoration: "none",
            transition: "border-color 0.2s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--purple)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "0.75rem",
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={22} style={{ color: "var(--purple)" }} />
          </div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)" }}>{title}</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {description}
          </p>
        </Link>
      ))}
    </div>
  );
}
