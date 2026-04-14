import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/productos")({
  component: Producto,
});

function Producto() {
  return <div className="p-2">Esto es producto!</div>;
}
