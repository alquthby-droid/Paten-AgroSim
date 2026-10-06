import React from 'react';
import { CropType } from '../types';
import { CROP_METADATA } from '../data/cropProtocols';
import { Wheat, Trees, Sparkles, Citrus } from 'lucide-react';

interface CommoditySelectorProps {
  selectedCrop: CropType;
  onSelectCrop: (crop: CropType) => void;
}

export const CommoditySelector: React.FC<CommoditySelectorProps> = ({
  selectedCrop,
  onSelectCrop,
}) => {
  const getIcon = (crop: CropType) => {
    switch (crop) {
      case 'jagung':
        return <Wheat className="w-5 h-5 text-amber-500" />;
      case 'padi':
        return <Sparkles className="w-5 h-5 text-emerald-500" />;
      case 'tembakau':
        return <Trees className="w-5 h-5 text-lime-600" />;
      case 'hortikultura':
        return <Citrus className="w-5 h-5 text-rose-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          1. Pilih Komoditas Tanaman
        </label>
        <span className="text-xs text-slate-400">
          Sesuai Brosur Resmi Pemakaian Produk Paten
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(CROP_METADATA) as CropType[]).map((cropKey) => {
          const item = CROP_METADATA[cropKey];
          const isSelected = selectedCrop === cropKey;

          return (
            <button
              key={cropKey}
              onClick={() => onSelectCrop(cropKey)}
              className={`text-left p-3.5 rounded-lg border transition-all relative ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isSelected
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {getIcon(cropKey)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-slate-900 truncate">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-xs italic text-slate-500">{item.scientificName}</p>

                  <div className="mt-2 text-[11px] text-slate-600 space-y-0.5">
                    <div>
                      <span className="text-slate-400">Populasi: </span>
                      <span className="font-medium text-slate-700">
                        {item.standardPopulationPerHa.toLocaleString('id-ID')}{' '}
                        {cropKey === 'padi' ? 'rumpun/ha' : 'pohon/ha'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Target Panen: </span>
                      <span className="font-semibold text-emerald-700">
                        {item.standardYieldPerHaPaten.toLocaleString('id-ID')}{' '}
                        {item.unitProduce}/ha
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
