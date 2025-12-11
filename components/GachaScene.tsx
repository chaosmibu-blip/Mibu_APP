import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface GachaSceneProps {
  language: Language;
}

export const GachaScene: React.FC<GachaSceneProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-indigo-600/95 backdrop-blur-sm transition-all duration-500">
      <div className="relative w-64 h-64 mb-8">
        {/* Animated Capsule */}
        <div className="absolute inset-0 flex items-center justify-center animate-bounce-soft">
           <div className="w-48 h-48 rounded-full border-8 border-white bg-gradient-to-br from-white/20 to-transparent relative overflow-hidden shadow-2xl animate-shake">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500"></div>
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border-4 border-slate-200 z-10 shadow-inner"></div>
           </div>
        </div>
        {/* Particles */}
        <div className="absolute top-0 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute bottom-10 right-10 w-3 h-3 bg-white rounded-full animate-ping delay-75 opacity-75"></div>
      </div>
      
      <h2 className="text-3xl font-display font-bold text-white mb-2 animate-pulse">{t.generating}</h2>
      <p className="text-indigo-200 text-sm font-medium">{t.generatingSub}</p>
    </div>
  );
};