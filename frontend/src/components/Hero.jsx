import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-bg-decoration">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>
      <div className="hero-content">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Tienda de tecnología
        </div>
        <h1 className="hero-title">
          Equipos informáticos de{' '}
          <span className="hero-title-accent">alta calidad</span>
        </h1>
        <p className="hero-subtitle">
          Encontrá los mejores componentes, periféricos y equipos completos
          para potenciar tu experiencia digital al máximo.
        </p>
        <div className="hero-actions">
          <button
            className="hero-btn-primary"
            onClick={() => navigate({ to: "/productos" })}
          >
            Ver productos
            <ArrowRight size={18} />
          </button>
          <button
            className="hero-btn-secondary"
            onClick={() => navigate({ to: "/productos" })}
          >
            Explorar categorías
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">500+</span>
            <span className="hero-stat-label">Productos</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">100+</span>
            <span className="hero-stat-label">Marcas</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">50k+</span>
            <span className="hero-stat-label">Clientes</span>
          </div>
        </div>
      </div>
    </section>
  );
}
