import { X } from "lucide-react";

export function AdminModal({ open, onClose, title, children, maxWidth = "32rem" }) {
  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      style={{ position: "fixed", inset: 0 }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{ maxWidth, overflow: "visible" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Cerrar">
          <X className="w-5 h-5" style={{ color: "var(--text)" }} />
        </button>

        <div className="modal-details" style={{ maxHeight: "85vh" }}>
          {title && <h2 className="modal-title">{title}</h2>}
          {children}
        </div>
      </div>
    </div>
  );
}
