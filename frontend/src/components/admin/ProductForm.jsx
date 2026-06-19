import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Api } from "../../api/api";
import { SaveButton } from "../button/SaveButton";


export function ProductForm({ product, categories, onSaved }) {
  const isEdit = Boolean(product);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    stock: product?.stock ?? "",
    categories: (product?.categories ?? []).map((c) => (typeof c === "object" ? c.id : c)),
  });
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const toggleCategory = (id) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((c) => c !== id)
        : [...prev.categories, id],
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "El nombre es obligatorio";
    if (form.price === "" || Number(form.price) < 0) e.price = "Precio inválido";
    if (form.stock === "" || Number(form.stock) < 0 || !Number.isInteger(Number(form.stock)))
      e.stock = "Stock inválido (entero ≥ 0)";
    if (form.categories.length === 0) e.categories = "Elegí al menos una categoría";
    if (!isEdit && !imageFile) e.image = "La imagen es obligatoria";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setFormError(null);
    try {
      if (isEdit) {
        await Api.updateProduct(product.id, {
          name: form.name.trim(),
          description: form.description,
          price: Number(form.price),
          stock: Number(form.stock),
          categories: form.categories,
        });
        onSaved("Producto actualizado");
      } else {
        const fd = new FormData();
        fd.append("name", form.name.trim());
        fd.append("description", form.description);
        fd.append("price", String(Number(form.price)));
        fd.append("stock", String(Number(form.stock)));
        form.categories.forEach((id) => fd.append("categories", id));
        fd.append("image", imageFile);
        await Api.createProduct(fd);
        onSaved("Producto creado");
      }
    } catch (err) {
      setFormError(err.response?.data?.mensaje || err.response?.data?.error || "Error al guardar el producto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {formError && (
        <div className="auth-alert auth-alert-error" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <AlertCircle size={16} /> {formError}
        </div>
      )}

      <div className="auth-field">
        <label className="auth-label">Nombre</label>
        <input
          className="auth-input"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          style={errors.name ? { borderColor: "var(--error)" } : {}}
        />
        {errors.name && <span style={{ fontSize: "0.75rem", color: "var(--error)" }}>{errors.name}</span>}
      </div>

      <div className="auth-field">
        <label className="auth-label">Descripción</label>
        <textarea
          className="auth-input"
          rows={3}
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          style={{ resize: "vertical", fontFamily: "inherit" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="auth-field">
          <label className="auth-label">Precio</label>
          <input
            className="auth-input"
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => setField("price", e.target.value)}
            style={errors.price ? { borderColor: "var(--error)" } : {}}
          />
          {errors.price && <span style={{ fontSize: "0.75rem", color: "var(--error)" }}>{errors.price}</span>}
        </div>
        <div className="auth-field">
          <label className="auth-label">Stock</label>
          <input
            className="auth-input"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={(e) => setField("stock", e.target.value)}
            style={errors.stock ? { borderColor: "var(--error)" } : {}}
          />
          {errors.stock && <span style={{ fontSize: "0.75rem", color: "var(--error)" }}>{errors.stock}</span>}
        </div>
      </div>

      <div className="auth-field">
        <label className="auth-label">Categorías</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {categories.map((cat) => {
            const checked = form.categories.includes(cat.id);
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`sidebar-item ${checked ? "active" : ""}`}
                style={{ width: "auto", flex: "0 0 auto", padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
        {errors.categories && <span style={{ fontSize: "0.75rem", color: "var(--error)" }}>{errors.categories}</span>}
      </div>

      {!isEdit ? (
        <div className="auth-field">
          <label className="auth-label">Imagen</label>
          <input
            className="auth-input"
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            style={errors.image ? { borderColor: "var(--error)" } : {}}
          />
          {errors.image && <span style={{ fontSize: "0.75rem", color: "var(--error)" }}>{errors.image}</span>}
        </div>
      ) : (
        <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
          La imagen no puede modificarse desde la edición.
        </p>
      )}

      <SaveButton saving={saving} />
    </form>
  );
}
