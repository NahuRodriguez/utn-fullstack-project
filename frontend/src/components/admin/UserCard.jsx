import { User as UserIcon, Mail } from "lucide-react";
import { EditButton, DeactivateButton, RestoreButton } from "../button/AdminActionButtons";

export function UserCard({ user, deleted, onEdit, onDeactivate, onRestore }) {
  return (
    <div className="order-card" style={{ cursor: "default" }}>
      <div className="order-card-bar" />
      <div className="order-card-id">
        <UserIcon size={16} className="order-card-id-icon" />
        <span className="order-card-id-text">
          {user.firstName} {user.lastName}
        </span>
        <span
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            padding: "0.15rem 0.5rem",
            borderRadius: "9999px",
            color: user.role === "ADMIN" ? "var(--purple)" : "var(--text-secondary)",
            background: user.role === "ADMIN" ? "rgba(139,92,246,0.12)" : "var(--card-hover)",
          }}
        >
          {user.role}
        </span>
      </div>
      <div className="order-card-meta">
        <span className="order-card-meta-item">
          <Mail size={13} /> {user.email}
        </span>
        {user.phone && <span className="order-card-meta-item">{user.phone}</span>}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
        {deleted ? (
          <RestoreButton onClick={() => onRestore(user)} style={{ flex: "0 0 auto" }} />
        ) : (
          <>
            <EditButton onClick={() => onEdit(user)} style={{ flex: "0 0 auto" }} />
            <DeactivateButton onClick={() => onDeactivate(user)} style={{ flex: "0 0 auto" }} />
          </>
        )}
      </div>
    </div>
  );
}
