import { Package } from "lucide-react";
import { formatPrice } from "../../utils/utils";
import { EditButton, DeactivateButton, RestoreButton } from "../button/AdminActionButtons";

export function AdminProductCard({ product, deleted, onEdit, onDeactivate, onRestore }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "1rem",
        overflow: "hidden",
      }}
    >
      <div style={{ height: "9rem", background: "var(--black)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {product.imgUrl ? (
          <img src={product.imgUrl} alt={product.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
        ) : (
          <Package size={36} style={{ color: "var(--muted)" }} />
        )}
      </div>
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}>{product.name}</h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="total-price">{formatPrice(product.price)}</span>
          <span style={{ fontSize: "0.8rem", color: product.stock > 0 ? "var(--text-secondary)" : "var(--error)" }}>
            Stock: {product.stock}
          </span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {(product.categories || []).map((c) =>
            typeof c === "object" ? (
              <span
                key={c.id}
                style={{ fontSize: "0.7rem", color: "var(--purple)", background: "rgba(139,92,246,0.12)", padding: "0.15rem 0.5rem", borderRadius: "9999px" }}
              >
                {c.name}
              </span>
            ) : null
          )}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto", paddingTop: "0.75rem" }}>
          {deleted ? (
            <RestoreButton onClick={() => onRestore(product)} />
          ) : (
            <>
              <EditButton onClick={() => onEdit(product)} />
              <DeactivateButton onClick={() => onDeactivate(product)} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
