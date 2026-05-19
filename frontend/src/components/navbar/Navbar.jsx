import { Link } from "@tanstack/react-router";

function Navbar({ links }) {
  return (
    <nav className="flex">
      <div style={{ display: "flex", justifyContent: "center" }}>
        {links.map((item) => (
          <Link
            key={item.url}
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
