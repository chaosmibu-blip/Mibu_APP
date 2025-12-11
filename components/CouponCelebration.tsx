import React from 'react';
import { GachaItem, Language } from '../types';
import { TRANSLATIONS, RARITY_COLORS } from '../constants';

interface CouponCelebrationProps {
  items: GachaItem[];
  language: Language;
  onClose: () => void;
}

export const CouponCelebration: React.FC<CouponCelebrationProps> = ({ items, language, onClose }) => {
  const t = TRANSLATIONS[language];

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
        <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative animate-pop-up overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            <div className="text-center mb-6">
                <div className="w-20 h-20 bg-yellow-100 rounded-full mx-auto flex items-center justify-center text-4xl mb-4 animate-bounce">
                    🎉
                </div>
                <h2 className="font-display font-bold text-2xl text-slate-900">{t.couponGot}</h2>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {items.map((item, idx) => {
                    const coupon = item.coupon_data!;
                    const title = typeof coupon.title === 'string' ? coupon.title : coupon.title[language];
                    const place = typeof item.place_name === 'string' ? item.place_name : item.place_name[language];
                    const color = RARITY_COLORS[item.rarity];

                    return (
                        <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50 relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{backgroundColor: color}}></div>
                            <h3 className="font-bold text-slate-800">{title}</h3>
                            <p className="text-sm text-slate-500 mb-2">{place}</p>
                            <div className="bg-white border border-dashed border-slate-300 rounded p-2 text-center font-mono font-bold text-slate-600 text-sm">
                                {coupon.code}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button 
                onClick={onClose}
                className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
                {t.claimCoupon}
            </button>
        </div>
    </div>
  );
};