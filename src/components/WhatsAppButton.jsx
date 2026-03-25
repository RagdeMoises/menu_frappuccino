// components/WhatsAppButton.jsx
import { useWhatsApp } from "../hooks/useWhatsApp";

export function WhatsAppButton({
  phone,
  message,
  children,
  className = "",
  onFail
}) {
  const { openWhatsApp } = useWhatsApp();

  const handleClick = () => {
    openWhatsApp({
      phone,
      message,
      onFail: onFail || (() => alert("No se pudo abrir WhatsApp"))
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 bg-green-600 text-white rounded ${className}`}
    >
      {children || "Enviar WhatsApp"}
    </button>
  );
}
