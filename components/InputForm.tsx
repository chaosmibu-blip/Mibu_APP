import React from 'react';
import { Language } from '../types';
import { LOCATION_DATA, TRANSLATIONS, MAX_LEVEL } from '../constants';

interface InputFormProps {
  country: string;
  city: string;
  level: number;
  language: Language;
  setCountry: (v: string) => void;
  setCity: (v: string) => void;
  setLevel: (v: number) => void;
  onPull: () => void;
  loading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({
  country,
  city,
  level,
  language,
  setCountry,
  setCity,
  setLevel,
  onPull,
  loading
}) => {
  const t = TRANSLATIONS[language];
  const countries = Object.keys(LOCATION_DATA);

  return (
    <div className="space-y-6 w-full">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-600 ml-1">{t.selectCountry}</label>
        <div className="grid grid-cols-2 gap-3">
          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setCity('');
            }}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
          >
            <option value="" disabled>{t.regionPlaceholder}</option>
            {countries.map(key => (
              <option key={key} value={key}>
                {LOCATION_DATA[key].names[language]}
              </option>
            ))}
          </select>

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!country}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 disabled:opacity-50"
          >
            <option value="" disabled>{t.cityPlaceholder}</option>
            {country && Object.entries(LOCATION_DATA[country].cities).map(([key, data]) => (
              <option key={key} value={key}>
                {data[language]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
            <label className="text-sm font-semibold text-slate-600">{t.levelLabel}</label>
            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{level}</span>
        </div>
        <input
          type="range"
          min="5"
          max="12"
          step="1"
          value={level}
          onChange={(e) => setLevel(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
          <span>{t.levelLow}</span>
          <span>{t.levelHigh}</span>
        </div>
      </div>

      <button
        onClick={onPull}
        disabled={!country || !city || loading}
        className="w-full bg-indigo-600 text-white font-bold text-lg py-4 rounded-2xl hover:bg-indigo-700 transition-all hover:shadow-lg shadow-indigo-200 hover:-translate-y-1 active:translate-y-0 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
            <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.generating}
            </span>
        ) : t.generateBtn}
      </button>
    </div>
  );
};