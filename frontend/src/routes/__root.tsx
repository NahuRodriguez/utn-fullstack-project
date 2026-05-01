import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Navbar from "../components/navbar/Navbar";
import { linkList } from "../assets/links";
import { Header } from "../components/Header";
import { CartProvider } from "../context/CartContext";
import axios from "axios";

const RootLayout = () => (
  <>
    <CartProvider>
      <Header/>
      <Navbar links={linkList} />
      <Outlet />
      <TanStackRouterDevtools />
    </CartProvider>
  </>
);

export const Route = createRootRoute({ component: RootLayout });
