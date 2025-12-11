import React from 'react';
import { GachaItem, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ItemBoxProps {
  items: GachaItem[];
  language: Language;
}

export const ItemBox: React.FC<ItemBoxProps> = ({ items, language }) => {
  const t = TRANSLATIONS[language];
  const coupons = items.filter(i => i.is_coupon && i.coupon_data);

  if (coupons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
        </div>
        <h3 className="text-xl font-bold text-slate-700">{t.itemBoxEmpty}</h3>
        <p className="text-slate-500 mt-2">{t.itemBoxEmptySub}</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-20 animate-fade-in">
       <div className="flex justify-between items-end mb-6 px-2">
            <h2 className="font-display font-bold text-2xl text-slate-800">{t.itemBoxTitle}</h2>
            <span className="text-sm font-medium text-slate-500">{coupons.length} Tickets</span>
        </div>

        <div className="space-y-4">
            {coupons.map((item, idx) => {
                const coupon = item.coupon_data!;
                const title = typeof coupon.title === 'string' ? coupon.title : coupon.title[language];
                const terms = typeof coupon.terms === 'string' ? coupon.terms : coupon.terms[language];
                const place = typeof item.place_name === 'string' ? item.place_name : item.place_name[language];

                return (
                    <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row border border-indigo-50 relative">
                        {/* Left Stub */}
                        <div className="bg-indigo-600 p-4 flex items-center justify-center md:w-32 relative">
                            <span className="text-white font-bold text-2xl tracking-widest rotate-0 md:-rotate-90 whitespace-nowrap">COUPON</span>
                            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-50 rounded-full hidden md:block"></div>
                            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-50 rounded-full hidden md:block"></div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-grow border-l-2 border-dashed border-slate-200">
                             <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-slate-800">{title}</h3>
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded uppercase">{item.rarity}</span>
                             </div>
                             <p className="text-sm text-slate-500 font-medium mb-4">{place}</p>
                             
                             <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.couponCode}</span>
                                    <span className="font-mono font-bold text-slate-700 text-lg select-all">{coupon.code}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-2">{t.couponTerms}: {terms}</p>
                             </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};