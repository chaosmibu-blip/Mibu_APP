import React from 'react';
import { AppView, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface BottomNavProps {
  view: AppView;
  setView: (v: AppView) => void;
  language: Language;
  hasUpdateCollection: boolean;
  hasUpdateItemBox: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ view, setView, language, hasUpdateCollection, hasUpdateItemBox }) => {
  const t = TRANSLATIONS[language];

  const NavItem = ({ target, icon, label, hasUpdate }: { target: AppView, icon: React.ReactNode, label: string, hasUpdate: boolean }) => {
    const isActive = view === target || (target === 'home' && view === 'result');
    return (
        <button 
            onClick={() => setView(target)}
            className={`flex flex-col items-center justify-center w-full py-2 relative transition-all ${isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
            {hasUpdate && (
                <span className="absolute top-1 right-[calc(50%-12px)] w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white z-10 animate-pulse"></span>
            )}
            <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
                {icon}
            </div>
            <span className="text-[10px] font-bold mt-1">{label}</span>
        </button>
    )
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-slate-200 pb-safe-bottom z-50 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center max-w-md mx-auto h-16 px-2">
            <NavItem 
                target="home" 
                label={t.navHome}
                hasUpdate={false}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} 
            />
            <NavItem 
                target="collection" 
                label={t.navCollection}
                hasUpdate={hasUpdateCollection}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>} 
            />
            <NavItem 
                target="item_box" 
                label={t.navItemBox}
                hasUpdate={hasUpdateItemBox}
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>} 
            />
        </div>
    </div>
  );
};