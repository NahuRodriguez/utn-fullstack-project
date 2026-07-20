export const scrollToTop = () => {
  window.scrollTo({
    top: "0%",
    behavior: 'smooth'
  });
};

export const formatPrice = (price) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price ?? 0);

export const formatDate = (iso) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" });
  const time = d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  return { date, time };
};