import { Link } from "@tanstack/react-router";
import React from "react";

function Navbar({ links }) {
  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="p-4 flex gap-6 items-center">
        {links.map((item) => (
          <Link
            to={item.url}
            className="[&.active]:font-bold hover:text-yellow-400 transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
