import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/categorias")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/categoria"!</div>;
}
