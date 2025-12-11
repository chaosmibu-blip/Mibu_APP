import React from 'react';
import { GachaItem, Language } from '../types';
import { TRANSLATIONS, CATEGORY_COLORS, RARITY_COLORS } from '../constants';

interface CollectionGridProps {
  items: GachaItem[];
  language: Language;
  merchantDb: Record<string, GachaItem>;
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({ items, language, merchantDb }) => {
  const t = TRANSLATIONS[language];

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
           <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-700">{t.collectionEmpty}</h3>
        <p className="text-slate-500 mt-2">{t.collectionEmptySub}</p>
      </div>
    );
  }

  // Reverse to show newest first
  const displayItems = [...items].reverse();

  return (
    <div className="w-full pb-20 animate-fade-in">
        <div className="flex justify-between items-end mb-6 px-2">
            <h2 className="font-display font-bold text-2xl text-slate-800">{t.collectionTitle}</h2>
            <span className="text-sm font-medium text-slate-500">{items.length} {t.items}</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {displayItems.map((item, idx) => {
                const rawName = item.place_name as any;
                const placeId = typeof rawName === 'string' ? rawName : rawName['en'] || rawName['zh-TW'];
                // Check if this item has been updated by merchant in DB (for dynamic updates)
                const merchantItem = merchantDb[placeId];
                const finalItem = merchantItem || item;

                const name = typeof finalItem.place_name === 'string' ? finalItem.place_name : finalItem.place_name[language];
                const rarityColor = RARITY_COLORS[finalItem.rarity];
                const catColor = CATEGORY_COLORS[finalItem.category];
                const isPremium = finalItem.merchant_id && finalItem.rarity !== 'R';

                return (
                    <div key={idx} className={`bg-white rounded-2xl overflow-hidden shadow-sm border ${isPremium ? 'border-amber-400 ring-1 ring-amber-400' : 'border-slate-100'} hover:shadow-md transition-all flex flex-col h-40 relative group`}>
                        <div className="h-1.5 w-full" style={{backgroundColor: rarityColor}}></div>
                        
                        <div className="absolute top-3 right-3 opacity-20 group-hover:opacity-100 transition-opacity">
                             <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{backgroundColor: catColor}}>
                                {finalItem.category.charAt(0)}
                             </div>
                        </div>

                        <div className="p-4 flex flex-col justify-between h-full">
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight mb-1">{name}</h4>
                                <p className="text-[10px] text-slate-500">{finalItem.city || finalItem.country}</p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">{finalItem.rarity}</span>
                                {finalItem.is_coupon && (
                                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1M12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"></path></svg>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};