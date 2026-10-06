import React from 'react';
import { CropType, SeasonType } from '../types';
import { SEASONAL_GUIDANCE } from '../data/seasonGuidance';
import { Sun, CloudRain, Clock, Droplet, ShieldAlert, Sparkles, AlertTriangle } from 'lucide-react';

interface SeasonalApplicationGuideProps {
  crop: CropType;
  season: SeasonType;
  onSelectSeason: (season: SeasonType) => void;
}

export const SeasonalApplicationGuide: React.FC<SeasonalApplicationGuideProps> = ({
  crop,
  season,
  onSelectSeason,
}) => {
  const guide = SEASONAL_GUIDANCE[crop][season];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
      {/* Header & Season Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            <h3 className="font-semibold text-sm text-slate-900">
              Rekomendasi Waktu & Teknis Aplikasi Berdasarkan Musim
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Efektivitas pupuk nano dan kocor sangat dipengaruhi kelembapan tanah, suhu udara, dan buka-tutup stomata
          </p>
        </div>

        {/* Season Toggle Buttons */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => onSelectSeason('kemarau')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              season === 'kemarau'
                ? 'bg-amber-500 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Musim Kemarau (Gadu)</span>
          </button>

          <button
            onClick={() => onSelectSeason('hujan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              season === 'hujan'
                ? 'bg-sky-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Musim Hujan (Rendeng)</span>
          </button>
        </div>
      </div>

      {/* Main Guidance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
        {/* Waktu Semprot & Kocor Optimal */}
        <div className="p-3.5 rounded-lg border border-slate-200/90 bg-slate-50/60 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-900 font-semibold border-b border-slate-200/80 pb-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Waktu Aplikasi Optimal (Stomata & Penyerapan)</span>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Penyemprotan Foliar (Daun):
              </span>
              <p className="font-medium text-slate-800 mt-0.5">
                {guide.optimalSprayHours}
              </p>
              <p className="text-[11px] text-slate-500 italic mt-0.5">
                Stomata membuka maksimal pada rentang suhu 20°C - 28°C sebelum terik matahari.
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Pemupukan Kocor (Perakaran):
              </span>
              <p className="font-medium text-slate-800 mt-0.5">
                {guide.optimalKocorHours}
              </p>
            </div>
          </div>
        </div>

        {/* Kelembapan Tanah & Perekat/Adjuvant */}
        <div className="p-3.5 rounded-lg border border-slate-200/90 bg-slate-50/60 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-900 font-semibold border-b border-slate-200/80 pb-2">
            <Droplet className="w-4 h-4 text-sky-600" />
            <span>Kondisi Tanah & Penyesuaian Larutan Air</span>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Kondisi Kelembapan Tanah Ideal:
              </span>
              <p className="text-slate-800 font-medium mt-0.5">
                {guide.soilMoistureCondition}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Perekat / Pembasah (Adjuvant) & Dosis Air:
              </span>
              <p className="text-slate-700 mt-0.5">
                {guide.adjuvantAdvice}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {guide.waterAdjustmentAdvice}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Warning & Best Practices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
        <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-lg text-amber-900">
          <div className="flex items-center gap-1.5 font-semibold text-xs text-amber-950 mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Tantangan & Risiko di {season === 'hujan' ? 'Musim Hujan' : 'Musim Kemarau'}:</span>
          </div>
          <ul className="space-y-1 pl-4 list-disc text-[11px] text-amber-900/90">
            {guide.keyRisks.map((risk, i) => (
              <li key={i}>{risk}</li>
            ))}
          </ul>
        </div>

        <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-lg text-emerald-900">
          <div className="flex items-center gap-1.5 font-semibold text-xs text-emerald-950 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>SOP Rekomendasi Agronomi Terbaik:</span>
          </div>
          <ul className="space-y-1 pl-4 list-disc text-[11px] text-emerald-900/90">
            {guide.bestPractices.map((bp, i) => (
              <li key={i}>{bp}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
