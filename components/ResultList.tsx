import React from 'react';
import { GachaResponse, GroundingChunk, Language, Category } from '../types';
import { CATEGORY_COLORS, TRANSLATIONS, RARITY_COLORS } from '../constants';

interface ResultListProps {
  result: GachaResponse;
  sources: GroundingChunk[];
  language: Language;
  onReset: () => void;
}

export const ResultList: React.FC<ResultListProps> = ({ result, sources, language, onReset }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className="w-full pb-20 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 mb-8">
        <div className="flex justify-between items-start mb-6 border-b border-slate-50 pb-4">
            <div>
                <h2 className="font-display font-bold text-2xl text-slate-800">{result.meta.city}</h2>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {typeof result.meta.locked_district === 'string' ? result.meta.locked_district : result.meta.locked_district?.[language] || 'District'}
                    </span>
                    <span className="text-xs text-slate-400">{result.meta.date}</span>
                </div>
            </div>
            <button 
                onClick={onReset}
                className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors"
            >
                {t.reset}
            </button>
        </div>

        <div className="space-y-4">
            {result.inventory.map((item, idx) => {
                const isPromo = item.store_promo && item.is_promo_active;
                const rarityColor = RARITY_COLORS[item.rarity];
                const catColor = CATEGORY_COLORS[item.category];
                
                return (
                    <div key={idx} className="relative group bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
                        {/* Rarity Tag */}
                        <div className="absolute -top-2 -right-2 text-xs font-bold text-white px-2 py-1 rounded-lg shadow-sm z-10" style={{backgroundColor: rarityColor}}>
                            {item.rarity}
                        </div>

                        {item.is_coupon && (
                            <div className="absolute -top-2 left-4 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-b-md shadow-sm z-10 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1M12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"></path></svg>
                                COUPON
                            </div>
                        )}

                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm shrink-0" style={{backgroundColor: catColor}}>
                                {item.category.charAt(0)}
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-slate-800 text-lg leading-tight">
                                        {typeof item.place_name === 'string' ? item.place_name : item.place_name[language]}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2 mt-1 mb-2">
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-slate-100 text-slate-500">
                                        {t.categories[item.category]}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        {item.duration}
                                    </span>
                                </div>
                                
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {typeof item.description === 'string' ? item.description : item.description[language]}
                                </p>

                                {isPromo && (
                                    <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-2 flex items-start gap-2">
                                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">HOT</span>
                                        <p className="text-xs text-red-700 font-medium">
                                            {typeof item.store_promo === 'string' ? item.store_promo : item.store_promo?.[language]}
                                        </p>
                                    </div>
                                )}
                                
                                <div className="mt-3 pt-3 border-t border-slate-200/50 flex gap-2">
                                    <a 
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.search_query)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        {t.openMaps}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
        
        {/* Source Grounding */}
        {sources.length > 0 && (
            <div className="mt-8 pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Verified Sources</p>
                <div className="flex flex-wrap gap-2">
                    {sources.map((source, idx) => {
                        const uri = source.web?.uri || source.maps?.uri;
                        const title = source.web?.title || source.maps?.title || 'Google Search Result';
                        if (!uri) return null;
                        return (
                             <a key={idx} href={uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded hover:bg-slate-200 transition-colors truncate max-w-[200px]">
                                {title}
                             </a>
                        )
                    })}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};