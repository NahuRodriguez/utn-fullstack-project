import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Navbar from "../components/navbar/Navbar";
import { linkList } from "../assets/links";
import { Header } from "../components/Header";
const RootLayout = () => (
  <>
    <Header />
    <Navbar links={linkList} />
    <Outlet />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
