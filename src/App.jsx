import React, { useState, useMemo, useEffect } from 'react';
import { UtensilsCrossed, Search, X } from 'lucide-react'; // Importamos X para el botón de limpiar
import { CategoryTabs } from './components/CategoryTabs';
import { ProductCard } from './components/ProductCard';
import { CartIcon } from './components/CartIcon';
import { CartDrawer } from './components/CartDrawer';
import { SplashIntro } from './components/SplashIntro';
import { ThemeToggle } from './components/ThemeToggle';
import { useProductStore } from './store/productStore';
import { useUIStore } from './store/uiStore';

function App() {
  const { showSplash, setShowSplash } = useUIStore();
  const [selectedCategory, setSelectedCategory] = useState('especialidades');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const { products, fetchProducts, loading, error } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    // Si hay búsqueda, ignorar la categoría y buscar en TODOS los productos
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return products.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      );
    }

    // Si no hay búsqueda, aplicar filtro de categoría normal
    if (selectedCategory === 'all') return products;

    if (selectedCategory === 'especialidades') {
      return products.filter((product) => product.es_especialidad === true);
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory, products, searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
    // No cerramos showSearch, permitimos que el usuario escriba de nuevo
  };

  const handleClearAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setShowSearch(false);
  };

  if (showSplash) {
    return (
      <SplashIntro
        onStart={() => {
          setShowSplash(false);
          setSelectedCategory('especialidades');
          setSearchQuery('');
          setShowSearch(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black/100 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300 shadow-sm dark:shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo y Título */}
          <button
            onClick={() => setShowSplash(true)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity p-1 -m-1"
          >
            {/* <div className="flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden shadow-lg shadow-gray-200 dark:shadow-black/50 border border-gray-100 dark:border-gray-700"> */}
            <div className="flex-shrink-0 w-28 h-28 rounded-md overflow-hidden p-4">
              <img
                src="/img/logo.png"
                alt="Logo"
                className="w-full h-full object-center object-cover"
              />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white hidden sm:block tracking-tighter">
              FRAPPUCCINO <span className="text-blue-600">MENÚ</span>
            </h1>
          </button>

          <div className="flex items-center gap-4">
            {/* Botón de búsqueda (Modernizado) */}
            <button
              onClick={() => {
                setShowSearch(!showSearch);
                if (showSearch) {
                  setSearchQuery(''); // Limpiar al cerrar
                }
              }}
              className={`p-3 rounded-full transition-all duration-200 shadow-sm ${showSearch || searchQuery
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              aria-label="Buscar productos"
            >
              <Search size={20} />
            </button>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />
              <CartIcon />
            </div>
          </div>
        </div>

        {/* Campo de búsqueda expandible (Modernizado) */}
        {showSearch && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 animate-in slide-in-from-top duration-300">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en todos los productos (ej: doble queso, papas)..."
                className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-3 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base shadow-md transition-all duration-200"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Categories - Ocultar cuando hay búsqueda activa */}
        {!searchQuery && (
          <div className="mb-1 sticky top-[80px] z-30 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm py-4 -mx-4 px-4 sm:mx-0 sm:px-0 transition-colors duration-300">
            <CategoryTabs
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Indicador de carrusel para móvil */}
            <div className="flex flex-col items-center gap-1 mt-2 md:hidden">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="animate-pulse">←</span>
                <span>Desliza para ver más categorías</span>
                <span className="animate-pulse">→</span>
              </div>
              <div className="h-1 w-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-red-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Productos: Mensaje de resultados para la búsqueda */}
        {/* {searchQuery && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Resultados para: <span className="text-blue-600">"{searchQuery}"</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}.
            </p>
          </div>
        )} */}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Cargando productos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">Error al cargar productos: {error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}

        {/* Empty State (Modernizado) */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="mb-6 text-gray-400 dark:text-gray-500">
                <UtensilsCrossed size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-gray-500 dark:text-gray-400 text-lg font-bold mb-2">
                  {searchQuery
                    ? `¡Vaya! No encontramos nada para "${searchQuery}"`
                    : 'Aún no hay productos en esta categoría.'}
                </p>
                {searchQuery && (
                  <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                    Intenta con otra palabra clave.
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl transition-colors font-medium"
                  >
                    Limpiar búsqueda
                  </button>
                )}

                {(searchQuery || selectedCategory !== 'all') && (
                  <button
                    onClick={handleClearAllFilters}
                    className="px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-extrabold active:scale-95 transition-all duration-300 
                               bg-gradient-to-r from-blue-500 to-red-500 text-white hover:from-blue-600 hover:to-red-600 shadow-lg shadow-blue-500/30"
                  >
                    Mostrar todos los productos
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
}

export default App;