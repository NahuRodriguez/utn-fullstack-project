import { Link } from "@tanstack/react-router";
import React from "react";

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="p-4 flex gap-6 items-center">
        <Link
          to="/"
          className="[&.active]:font-bold hover:text-yellow-400 transition-colors"
        >
          Inicio
        </Link>
        <Link
          to="/about"
          className="[&.active]:font-bold hover:text-yellow-400 transition-colors"
        >
          Producto
        </Link>
        <Link
          to="/category"
          className="[&.active]:font-bold hover:text-yellow-400 transition-colors"
        >
          Categoría
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
