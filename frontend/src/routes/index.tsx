import { createFileRoute } from "@tanstack/react-router";
import Inicio from "../pages/Inicio/Inicio";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <Inicio />;
}
