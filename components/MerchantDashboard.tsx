import React, { useState } from 'react';
import { Language, GachaItem, Merchant, CouponConfig, Rarity, PlanTier } from '../types';
import { TRANSLATIONS, SUBSCRIPTION_PLANS, RARITY_COLORS } from '../constants';

interface MerchantDashboardProps {
  language: Language;
  globalCollection: GachaItem[];
  merchantDb: Record<string, GachaItem>;
  currentMerchant: Merchant | null;
  onLogin: (name: string, email: string) => void;
  onClaim: (item: GachaItem) => void;
  onUpdateItem: (item: GachaItem) => void;
  onUpdateMerchant: (m: Merchant) => void;
  onBack: () => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  language,
  globalCollection,
  merchantDb,
  currentMerchant,
  onLogin,
  onClaim,
  onUpdateItem,
  onUpdateMerchant,
  onBack
}) => {
  const t = TRANSLATIONS[language];
  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'claim'>('dashboard');
  
  // Coupon Edit State
  const [editingItem, setEditingItem] = useState<GachaItem | null>(null);
  const [newCoupon, setNewCoupon] = useState<Partial<CouponConfig>>({ rarity: Rarity.R });
  const [newPromo, setNewPromo] = useState('');
  
  // Payment Simulation
  const handleUpgrade = (planId: PlanTier) => {
      // In a real app, this would redirect to Stripe/Recurly
      // Here we simulate a success redirect
      const confirmed = window.confirm(`Simulate Payment for ${SUBSCRIPTION_PLANS[planId].name}?`);
      if(confirmed) {
          const params = new URLSearchParams(window.location.search);
          params.set('payment_success', 'true');
          params.set('session_id', 'mock_session_' + Date.now());
          window.location.search = params.toString();
      }
  };

  if (!currentMerchant) {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-slate-100 animate-pop-up mx-auto mt-10">
        <h2 className="font-display font-bold text-2xl text-slate-900 mb-6">{t.merchantLogin}</h2>
        <div className="space-y-4">
          <input 
            type="text" 
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            placeholder={t.merchantPlaceholder}
            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input 
            type="email" 
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder={t.merchantEmailPlaceholder}
            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={() => onLogin(loginName, loginEmail)}
            disabled={!loginName || !loginEmail}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {t.merchantLoginBtn}
          </button>
          <button onClick={onBack} className="w-full text-sm text-slate-400 font-bold hover:text-slate-600">Back</button>
        </div>
      </div>
    );
  }

  const plan = SUBSCRIPTION_PLANS[currentMerchant.subscriptionPlan];
  const myItems = currentMerchant.claimedPlaceNames.map(id => merchantDb[id]).filter(Boolean);

  const handleAddCoupon = () => {
      if(!editingItem || !newCoupon.title || !newCoupon.code) return;
      
      const config: CouponConfig = {
          id: Date.now().toString(),
          title: newCoupon.title,
          code: newCoupon.code,
          terms: newCoupon.terms || 'Terms apply',
          rarity: newCoupon.rarity || Rarity.R,
          total_quantity: Number(newCoupon.total_quantity) || 10,
          remaining_quantity: Number(newCoupon.total_quantity) || 10,
          redeemed_count: 0,
          is_active: true
      };

      const updatedItem = {
          ...editingItem,
          merchant_coupons: [...(editingItem.merchant_coupons || []), config]
      };
      
      // Also update promo text if changed
      if(newPromo) {
          updatedItem.store_promo = newPromo;
          updatedItem.is_promo_active = true;
      }

      onUpdateItem(updatedItem);
      setEditingItem(null); // Close modal
      setNewCoupon({ rarity: Rarity.R });
      setNewPromo('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{currentMerchant.name}</h1>
            <p className="text-slate-500 text-sm">ID: {currentMerchant.id}</p>
          </div>
          <div className="flex items-center gap-2">
               <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full uppercase">{plan.name}</span>
               <button onClick={onBack} className="text-slate-400 hover:text-slate-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-slate-200">
          <button 
            className={`pb-3 font-bold text-sm ${activeTab === 'dashboard' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}
            onClick={() => setActiveTab('dashboard')}
          >
              {t.merchantDashboard}
          </button>
          <button 
            className={`pb-3 font-bold text-sm ${activeTab === 'claim' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}
            onClick={() => setActiveTab('claim')}
          >
              {t.claimNew}
          </button>
      </div>

      {activeTab === 'dashboard' ? (
          <div className="space-y-6">
              {/* Plan Upgrade Banner */}
              {currentMerchant.subscriptionPlan === 'free' && (
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg">
                      <div>
                          <h3 className="font-bold text-lg">{t.unlockPremium}</h3>
                          <p className="text-slate-300 text-sm opacity-90">Get unlimited coupons, analytics & map highlight.</p>
                      </div>
                      <button onClick={() => handleUpgrade('premium')} className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-50 transition-colors">
                          Upgrade
                      </button>
                  </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myItems.map(item => (
                      <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between">
                          <div>
                              <div className="flex justify-between items-start mb-2">
                                  <h3 className="font-bold text-slate-800 truncate" title={typeof item.place_name === 'string' ? item.place_name : item.place_name[language]}>
                                      {typeof item.place_name === 'string' ? item.place_name : item.place_name[language]}
                                  </h3>
                                  <button onClick={() => { setEditingItem(item); setNewPromo(typeof item.store_promo === 'string' ? item.store_promo : (item.store_promo as any)?.[language] || ''); }} className="text-indigo-600 text-xs font-bold hover:underline">{t.editItem}</button>
                              </div>
                              <div className="flex gap-2 text-[10px] text-slate-500 font-mono mb-4">
                                  <span className="bg-slate-50 px-2 py-1 rounded">👀 {item.impressionCount || 0}</span>
                                  <span className="bg-slate-50 px-2 py-1 rounded">🎟️ {item.redemptionCount || 0}</span>
                              </div>
                              
                              <div className="space-y-2">
                                  <p className="text-xs font-bold text-slate-400 uppercase">{t.activeCouponsList}</p>
                                  {(item.merchant_coupons || []).filter(c => c.is_active).length === 0 ? (
                                      <p className="text-xs text-slate-300 italic">{t.noActiveCoupons}</p>
                                  ) : (
                                      (item.merchant_coupons || []).filter(c => c.is_active).map(c => (
                                          <div key={c.id} className="bg-slate-50 p-2 rounded border border-slate-100 text-xs flex justify-between items-center">
                                              <span className="truncate max-w-[100px]">{typeof c.title === 'string' ? c.title : c.title[language]}</span>
                                              <span className="font-mono bg-white px-1 rounded">{c.remaining_quantity}/{c.total_quantity}</span>
                                          </div>
                                      ))
                                  )}
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg mb-4">{t.claimNew}</h3>
              <p className="text-sm text-slate-500 mb-6">Found your business in the Gacha pool? Claim it to manage promotions.</p>
              
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {globalCollection.filter(i => !i.merchant_id).length === 0 ? (
                      <p className="text-center text-slate-400 py-10">{t.noAvailableItems}</p>
                  ) : (
                      globalCollection.filter(i => !i.merchant_id).map((item, idx) => {
                          const name = typeof item.place_name === 'string' ? item.place_name : item.place_name[language];
                          return (
                              <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition-colors">
                                  <div>
                                      <span className="font-bold text-slate-700 block">{name}</span>
                                      <span className="text-xs text-slate-400">{item.city}</span>
                                  </div>
                                  <button 
                                    onClick={() => onClaim(item)}
                                    className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-slate-700"
                                  >
                                      {t.claimBtn}
                                  </button>
                              </div>
                          )
                      })
                  )}
              </div>
          </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-pop-up max-h-[90vh] overflow-y-auto">
                  <h3 className="font-bold text-xl mb-4">Edit {typeof editingItem.place_name === 'string' ? editingItem.place_name : (editingItem.place_name as any)[language]}</h3>
                  
                  {/* Promo Section */}
                  <div className="mb-6">
                      <label className="block text-sm font-bold text-slate-700 mb-2">{t.promoLabel}</label>
                      <input 
                        type="text" 
                        value={newPromo}
                        onChange={e => setNewPromo(e.target.value)}
                        placeholder="e.g. Happy Hour 5-7PM!" 
                        className="w-full border border-slate-200 rounded-lg p-3 text-sm"
                      />
                  </div>

                  {/* Add Coupon Section */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                      <h4 className="font-bold text-sm text-slate-700 mb-3">{t.addCoupon}</h4>
                      <div className="space-y-3">
                          <input 
                            className="w-full p-2 border border-slate-200 rounded text-sm" 
                            placeholder={t.couponTitle}
                            value={newCoupon.title as string || ''}
                            onChange={e => setNewCoupon({...newCoupon, title: e.target.value})}
                          />
                           <input 
                            className="w-full p-2 border border-slate-200 rounded text-sm font-mono" 
                            placeholder="CODE (e.g. WELCOME10)"
                            value={newCoupon.code || ''}
                            onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                          />
                          <div className="flex gap-2">
                              <select 
                                className="w-1/2 p-2 border border-slate-200 rounded text-sm"
                                value={newCoupon.rarity}
                                onChange={e => setNewCoupon({...newCoupon, rarity: e.target.value as Rarity})}
                              >
                                  {plan.allowedRarities.map(r => <option key={r} value={r}>{r}</option>)}
                              </select>
                              <input 
                                type="number"
                                className="w-1/2 p-2 border border-slate-200 rounded text-sm"
                                placeholder="Qty"
                                value={newCoupon.total_quantity || ''}
                                onChange={e => setNewCoupon({...newCoupon, total_quantity: parseInt(e.target.value)})}
                              />
                          </div>
                      </div>
                  </div>

                  <div className="flex gap-3">
                      <button onClick={handleAddCoupon} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700">
                          {t.save}
                      </button>
                      <button onClick={() => setEditingItem(null)} className="px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100">
                          Cancel
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};