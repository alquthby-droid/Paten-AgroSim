import React, { useState } from 'react';
import { CostParameters } from '../types';
import { X, RotateCcw, Check } from 'lucide-react';
import { DEFAULT_COST_PARAMETERS } from '../data/cropProtocols';

interface CostSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: CostParameters;
  onSave: (params: CostParameters) => void;
}

export const CostSettingsModal: React.FC<CostSettingsModalProps> = ({
  isOpen,
  onClose,
  params,
  onSave,
}) => {
  const [localParams, setLocalParams] = useState<CostParameters>(params);

  if (!isOpen) return null;

  const handleChange = (key: keyof CostParameters, val: number) => {
    setLocalParams((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleReset = () => {
    setLocalParams(DEFAULT_COST_PARAMETERS);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localParams);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-semibold text-slate-900 text-base">
              Pengaturan Parameter Biaya & Harga Pasar
            </h3>
            <p className="text-xs text-slate-500">
              Sesuaikan dengan harga pupuk, obat, dan komoditas di daerah Anda
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Harga Paten Gold (Rp / Box 24 sachet)
              </label>
              <input
                type="number"
                value={localParams.patenBoxPrice}
                onChange={(e) => handleChange('patenBoxPrice', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Harga Insektisida (Rp / 100ml)
              </label>
              <input
                type="number"
                value={localParams.insekPricePer100ml}
                onChange={(e) => handleChange('insekPricePer100ml', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Harga Urea Kimia (Rp / kg)
              </label>
              <input
                type="number"
                value={localParams.ureaPricePerKg}
                onChange={(e) => handleChange('ureaPricePerKg', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Harga Pupuk ZA (Rp / kg)
              </label>
              <input
                type="number"
                value={localParams.zaPricePerKg}
                onChange={(e) => handleChange('zaPricePerKg', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Harga Pupuk NPK (Rp / kg)
              </label>
              <input
                type="number"
                value={localParams.npkPricePerKg}
                onChange={(e) => handleChange('npkPricePerKg', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Biaya Pompa Air (Rp / 1.000 Liter)
              </label>
              <input
                type="number"
                value={localParams.waterCostPer1000L}
                onChange={(e) => handleChange('waterCostPer1000L', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Upah Tenaga Kerja Semprot/Kocor (Rp / HOK)
              </label>
              <input
                type="number"
                value={localParams.laborRatePerHok}
                onChange={(e) => handleChange('laborRatePerHok', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Harga Jual Jagung Pipil Kering (Rp / kg)
              </label>
              <input
                type="number"
                value={localParams.sellingPriceCornPerKg}
                onChange={(e) => handleChange('sellingPriceCornPerKg', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Harga Jual Gabah Kering Panen GKP (Rp / kg)
              </label>
              <input
                type="number"
                value={localParams.sellingPriceRicePerKg}
                onChange={(e) => handleChange('sellingPriceRicePerKg', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Harga Jual Tembakau Rajangan Super (Rp / kg)
              </label>
              <input
                type="number"
                value={localParams.sellingPriceTobaccoPerKg}
                onChange={(e) => handleChange('sellingPriceTobaccoPerKg', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Harga Jual Cabe / Hortikultura Segar (Rp / kg)
              </label>
              <input
                type="number"
                value={localParams.sellingPriceHortiPerKg}
                onChange={(e) => handleChange('sellingPriceHortiPerKg', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset ke Standar
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-sm"
              >
                <Check className="w-4 h-4" />
                Simpan & Terapkan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
