import { Link } from "@tanstack/react-router";
import React from "react";

function Navbar({ links }) {
  return (
    <nav className="flex">
      <div className="" style={{display: 'flex', justifyContent: "center"}} >
        {links.map((item) => (
          <Link
            to={item.url}
            className="nav-link [&.active]:font-bold hover:text-yellow-400 transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
