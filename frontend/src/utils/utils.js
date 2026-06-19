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