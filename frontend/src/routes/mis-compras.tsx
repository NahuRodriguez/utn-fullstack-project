import { useEffect } from "react";
import { createFileRoute, useNavigate, Outlet } from "@tanstack/react-router";
import { useAuth } from "../store/authStore";

export const Route = createFileRoute("/mis-compras")({
  component: MisComprasLayout,
});

function MisComprasLayout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className="main-content" style={{ display: "block", maxWidth: "48rem" }}>
      <Outlet />
    </div>
  );
}
