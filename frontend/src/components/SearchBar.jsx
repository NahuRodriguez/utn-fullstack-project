import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";

export const SearchBar = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    navigate({
      to: "/productos",
      search: (prev) => ({ ...prev, search: trimmed || undefined, page: 1 })
    });
  };

  const handleClear = () => {
    setValue("");
    navigate({
      to: "/productos",
      search: (prev) => ({ ...prev, search: undefined, page: 1 })
    });
  };

  return (
    <form onSubmit={handleSubmit} className="search-wrapper">
      <Search className="search-icon" />
      <input
        type="text"
        placeholder="Buscar productos..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="search-input"
      />
      {value && (
        <button type="button" onClick={handleClear} className="search-clear">
          <X size={16} />
        </button>
      )}
    </form>
  );
};
