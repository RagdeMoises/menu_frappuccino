import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

export const SplashIntro = ({ onStart }) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          //backgroundImage: 'url("https://images.unsplash.com/photo-1585238341710-4d3ff484184d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTAxMTZ8MHwxfHNlYXJjaHwzfHxnb3VybWV0JTIwYnVyZ2VyJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MHwwfHx8MTc2NDMwNDc1MHww&ixlib=rb-4.1.0&q=80&w=1080")',
          backgroundImage: 'url("/img/crispy.png")',
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        {/* <div className="bg-blue-600 p-4 rounded-2xl mb-6 shadow-lg shadow-blue-600/20 animate-fade-in-up">
          <UtensilsCrossed size={48} className="text-white" />
        </div> */}
       <div className="mb-6 animate-fade-in-up">
        <img 
          src="/img/logo.png" 
          alt="Utensilios" 
          className="w-40 h-40 md:w-40 md:h-40 object-contain" 
        />
      </div>

        {/* <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight animate-fade-in-up delay-100">
         IROUMBO
        </h1> */}
        
        {/* <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-lg font-light animate-fade-in-up delay-200">
          Sabor artesanal en cada mordida.
          <br />
          La mejor experiencia gourmet.
        </p> */}

        <button
          onClick={onStart}
          className="group relative px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-600/30 transition-all duration-300 animate-fade-in-up delay-300"
        >
          <span className="relative z-10 flex items-center gap-2">
            Ver Menú
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
        </button>
      </div>
    </div>
  );
};
