import { Link } from "@tanstack/react-router";

function Navbar({ links }) {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {links.map((item) => (
          <Link
            key={item.url}
            to={item.url}
            className="navbar-link"
            activeProps={{ className: "navbar-link active" }}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
