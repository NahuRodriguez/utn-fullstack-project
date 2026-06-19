import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div>
            <div className="footer-brand-info">
              <div className="footer-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
              <span className="footer-logo-text">PECEI</span>
            </div>
            <p className="footer-description">
              Plataforma E-Commerce para Equipos Informáticos. Encontrá los
              mejores productos de tecnología al mejor precio.
            </p>
          </div>
        </div>

        <div className="footer-group">
          <h4 className="footer-group-title">Navegación</h4>
          <div className="footer-links">
            <Link to="/" className="footer-link">Inicio</Link>
            <Link to="/productos" className="footer-link">Productos</Link>
            <Link to="/carrito" className="footer-link">Carrito</Link>
          </div>
        </div>

        <div className="footer-group">
          <h4 className="footer-group-title">Contacto</h4>
          <div className="footer-links">
            <span className="footer-link">soporte@pecei.com</span>
            <span className="footer-link">+54 11 5555-0123</span>
            <span className="footer-link">Buenos Aires, Argentina</span>
          </div>
        </div>

        <div className="footer-group">
          <h4 className="footer-group-title">Horarios</h4>
          <div className="footer-links">
            <span className="footer-link">Lun a Vie: 9:00 - 18:00</span>
            <span className="footer-link">Sábados: 10:00 - 14:00</span>
            <span className="footer-link">Soporte online 24/7</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} PECEI. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
