import { Pencil, Ban, RotateCcw } from "lucide-react";

export function EditButton({ onClick, style }) {
  return (
    <button className="admin-btn admin-btn-edit" onClick={onClick} style={style}>
      <Pencil size={15} /> Editar
    </button>
  );
}

export function DeactivateButton({ onClick, style }) {
  return (
    <button className="admin-btn admin-btn-danger" onClick={onClick} style={style}>
      <Ban size={15} /> Baja
    </button>
  );
}

export function RestoreButton({ onClick, style }) {
  return (
    <button className="admin-btn admin-btn-restore" onClick={onClick} style={style}>
      <RotateCcw size={15} /> Reactivar
    </button>
  );
}
