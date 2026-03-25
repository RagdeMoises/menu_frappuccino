import React, { useRef, useEffect } from 'react';
import { CATEGORIES } from '../data/menu';

export const CategoryTabs = ({ selectedCategory, onSelectCategory }) => {
  const scrollContainerRef = useRef(null);

  // Función para centrar automáticamente la categoría seleccionada (Mejora UX móvil)
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [selectedCategory]);

  // Definición de estilos dinámicos
  const getButtonClass = (isActive) => {
    const baseClass = "flex-shrink-0 px-6 py-3 rounded-2xl whitespace-nowrap text-sm font-bold transition-all duration-300 border select-none";
    
    if (isActive) {
      // Estilo Activo: Degradado Naranja/Rojo con sombra difuminada (Estilo imagen referencia)
      return `${baseClass} bg-gradient-to-r from-yellow-500 to-red-500 text-white border-transparent shadow-lg shadow-yellow-500/30 transform scale-105`;
    }
    
    // Estilo Inactivo: Blanco limpio con borde suave
    return `${baseClass} bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-yellow-200 dark:hover:border-gray-600 hover:text-yellow-500 dark:hover:text-gray-200`;
  };

  return (
    <div className="w-full relative group">
      {/* Contenedor con scroll horizontal oculto */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-3 px-4 py-4 scrollbar-hide touch-pan-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Fallback para ocultar scrollbar
      >
        {/* Botón Especialidades */}
        <button
          onClick={() => onSelectCategory('especialidades')}
          data-active={selectedCategory === 'especialidades'}
          className={getButtonClass(selectedCategory === 'especialidades')}
        >
          🔥 Promociones
        </button>

        {/* Botón Todos */}
        {/* <button
          onClick={() => onSelectCategory('all')}
          data-active={selectedCategory === 'all'}
          className={getButtonClass(selectedCategory === 'all')}
        >
          Todos
        </button> */}

        {/* Mapeo de Categorías */}
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            data-active={selectedCategory === category.id}
            className={getButtonClass(selectedCategory === category.id)}
          >
            {category.label}
          </button>
        ))}
        
        {/* Espaciador final para que el último elemento no quede pegado al borde en móvil */}
        <div className="w-2 flex-shrink-0" />
      </div>
      
      {/* Gradientes de desvanecimiento laterales (Opcional: da un toque muy pro) */}
      <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
    </div>
  );
};