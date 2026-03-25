// hooks/useWhatsApp.js
import { useCallback } from "react";

export function useWhatsApp() {
  const openWhatsApp = useCallback(({ phone, message = "", onFail }) => {
    //const cleanPhone = phone.replace(/\D/g, "");
    const cleanPhone = (phone || "").toString().replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);

    const waMeUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    const appUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodedMessage}`;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      const timeout = setTimeout(() => {
        window.location.href = waMeUrl;
      }, 1200);

      window.location.href = appUrl;
      return;
    }

    try {
      window.open(waMeUrl, "_blank");
    } catch (err) {
      if (onFail) onFail(err);
    }
  }, []);

  return { openWhatsApp };
}
