import { Loader, Save } from "lucide-react";

export function SaveButton({ saving, label = "Guardar" }) {
  return (
    <button
      type="submit"
      className="auth-btn-primary"
      disabled={saving}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
    >
      {saving ? (
        <><Loader size={16} className="spin" /> Guardando...</>
      ) : (
        <><Save size={16} /> {label}</>
      )}
    </button>
  );
}
