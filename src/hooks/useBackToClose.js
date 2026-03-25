import { useEffect, useRef } from 'react';

/**
 * Hook para cerrar modales o drawers usando el botón "atrás" del navegador/móvil.
 * Soporta múltiples modales anidados usando un identificador único.
 * 
 * @param {boolean} isOpen - Estado que indica si la modal está abierta.
 * @param {function} onClose - Función para cerrar la modal.
 */
export const useBackToClose = (isOpen, onClose) => {
  // Usamos un ref para la función onClose para evitar que cambios en su referencia
  // disparen el efecto de nuevo unnecessarily.
  const onCloseRef = useRef(onClose);
  
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    // Solo actuamos si la modal está abierta
    if (!isOpen) return;

    // Generamos un ID único para esta instancia de modal abierta
    // Esto es crucial para que el efecto no se limpie y se vuelva a ejecutar
    // en cada renderizado (por ejemplo, al cambiar la cantidad de un producto).
    const modalId = Math.random().toString(36).substring(2, 9);
    const state = { modalOpen: true, modalId };
    
    // Añadimos una entrada al historial del navegador
    window.history.pushState(state, '');

    const handlePopState = (event) => {
      // Si el ID del estado al que volvimos NO coincide con el nuestro,
      // significa que nuestra entrada en el historial fue eliminada (el usuario dio atrás).
      if (event.state?.modalId !== modalId) {
        onCloseRef.current();
      }
    };

    // Escuchamos el evento de retroceso
    window.addEventListener('popstate', handlePopState);

    // Limpieza al desmontar o cerrar la modal
    return () => {
      // Primero removemos el listener para evitar bucles
      window.removeEventListener('popstate', handlePopState);
      
      // Si la modal se cierra por otros medios (botón cerrar, overlay, submit),
      // debemos quitar nuestra entrada específica del historial si aún somos la entrada actual.
      if (window.history.state?.modalId === modalId) {
        window.history.back();
      }
    };
  }, [isOpen]); // Solo dependemos de isOpen
};
