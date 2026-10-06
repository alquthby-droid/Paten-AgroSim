import React from 'react';
import { CalculationMode, CropType } from '../types';
import { Sliders, Zap, ShieldCheck, MapPin } from 'lucide-react';

interface AreaAndModeControlProps {
  crop: CropType;
  mode: CalculationMode;
  onSelectMode: (mode: CalculationMode) => void;
  areaAre: number;
  onChangeArea: (are: number) => void;
  population: number;
  onOpenMap?: () => void;
}

export const AreaAndModeControl: React.FC<AreaAndModeControlProps> = ({
  crop,
  mode,
  onSelectMode,
  areaAre,
  onChangeArea,
  population,
  onOpenMap,
}) => {
  const presets = [10, 25, 50, 75, 100];
  const areaHa = areaAre / 100;
  const areaM2 = areaAre * 100;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Mode Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              2. Pilih Mode Aplikasi
            </label>
            <span className="text-[11px] text-slate-400">
              Pilihan strategi pemakaian
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => onSelectMode('irit')}
              className={`px-3 py-2.5 rounded-md text-left transition-all ${
                mode === 'irit'
                  ? 'bg-white shadow-sm text-slate-900 border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="font-semibold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Mode Irit (Efisiensi 0.5 Ha)
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {crop === 'padi'
                  ? '1 sachet Paten + 1 gelas ZA/Urea per tangki (Hemat 60% sachet).'
                  : 'Semprot foliar merata + kocor piringan terarah hemat air.'}
              </p>
            </button>

            <button
              onClick={() => onSelectMode('full_populasi')}
              className={`px-3 py-2.5 rounded-md text-left transition-all ${
                mode === 'full_populasi'
                  ? 'bg-white shadow-sm text-slate-900 border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="font-semibold text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Mode Full Populasi Kocor
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {crop === 'jagung'
                  ? 'Kocor 50ml ke semua 70.000 pohon/ha (H-12, H-26, H-35).'
                  : crop === 'tembakau'
                  ? 'Kocor 100ml ke semua 20.000 pohon/ha (H-14, H-28, H-30).'
                  : 'Semprot standar murni 2-3 sachet per tangki tanpa urea.'}
              </p>
            </button>
          </div>
        </div>

        {/* Area Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-600" />
              3. Luas Lahan (10 s/d 100 Are)
            </label>
            <div className="flex items-center gap-2">
              {onOpenMap && (
                <button
                  onClick={onOpenMap}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3 h-3 text-emerald-700" />
                  <span>Ukur di Peta</span>
                </button>
              )}
              <div className="text-xs font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {areaAre} Are = {areaHa.toFixed(2)} Ha ({areaM2.toLocaleString('id-ID')} m²)
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={areaAre}
              onChange={(e) => onChangeArea(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />

            <div className="flex flex-wrap items-center justify-between gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => onChangeArea(preset)}
                  className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                    areaAre === preset
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {preset} Are {preset === 50 ? '(0.5 Ha)' : preset === 100 ? '(1 Ha)' : ''}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                1 Are = 100 m² | 1 Hektar = 100 Are (10.000 m²)
              </span>
              <span className="font-medium text-slate-700">
                Populasi: {population.toLocaleString('id-ID')}{' '}
                {crop === 'padi' ? 'rumpun' : 'pohon'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
