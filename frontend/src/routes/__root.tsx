import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    // nav bar
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Inicio
      </Link>{" "}
      <Link to="/about" className="[&.active]:font-bold">
        Producto
      </Link>{" "}
      <Link to="/category" className="[&.active]:font-bold">
        Categoría
      </Link>
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
