import React from 'react';
import { CropType, SimulationSummary, UserYieldTarget } from '../types';
import { CROP_METADATA } from '../data/cropProtocols';
import {
  Calculator,
  Coins,
  TrendingUp,
  Scale,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';

interface HarvestProfitCalculatorProps {
  crop: CropType;
  summary: SimulationSummary;
  userTargets: UserYieldTarget;
  onChangeTargets: (targets: UserYieldTarget) => void;
  areaAre: number;
}

function formatRupiah(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

export const HarvestProfitCalculator: React.FC<HarvestProfitCalculatorProps> = ({
  crop,
  summary,
  userTargets,
  onChangeTargets,
  areaAre,
}) => {
  const meta = CROP_METADATA[crop];
  const areaHa = areaAre / 100;

  // Nilai aktif (jika user menginput, gunakan nilai user; jika tidak, gunakan benchmark meta)
  const currentSellingPrice =
    userTargets.customSellingPricePerKg && userTargets.customSellingPricePerKg > 0
      ? userTargets.customSellingPricePerKg
      : meta.sellingPricePerUnit;

  const currentPatenYieldTon =
    userTargets.customPatenYieldTonPerHa && userTargets.customPatenYieldTonPerHa > 0
      ? userTargets.customPatenYieldTonPerHa
      : meta.standardYieldPerHaPaten / 1000;

  const currentConvYieldTon =
    userTargets.customConventionalYieldTonPerHa &&
    userTargets.customConventionalYieldTonPerHa > 0
      ? userTargets.customConventionalYieldTonPerHa
      : meta.standardYieldPerHaConventional / 1000;

  const handlePriceChange = (val: number) => {
    onChangeTargets({
      ...userTargets,
      customSellingPricePerKg: val,
    });
  };

  const handlePatenYieldChange = (val: number) => {
    onChangeTargets({
      ...userTargets,
      customPatenYieldTonPerHa: val,
    });
  };

  const handleConvYieldChange = (val: number) => {
    onChangeTargets({
      ...userTargets,
      customConventionalYieldTonPerHa: val,
    });
  };

  const handleReset = () => {
    onChangeTargets({
      customSellingPricePerKg: undefined,
      customPatenYieldTonPerHa: undefined,
      customConventionalYieldTonPerHa: undefined,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
            <Calculator className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">
              Kalkulator Target Panen & Simulasi Keuntungan Bersih (Net Profit)
            </h3>
            <p className="text-xs text-slate-500">
              Ubah target harga jual dan estimasi tonase panen untuk menghitung proyeksi omzet & laba bersih di lahan {areaAre} Are ({areaHa} Ha)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md font-medium transition-colors"
          title="Kembalikan ke standar rata-rata agronomi"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Standar Pasar</span>
        </button>
      </div>

      {/* Input Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 text-xs">
        {/* 1. Target Harga Jual */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 flex items-center justify-between">
            <span>Target Harga Jual Hasil Panen</span>
            <span className="font-mono text-emerald-700 font-bold">
              {formatRupiah(currentSellingPrice)} / kg
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              step={100}
              min={1000}
              value={currentSellingPrice}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="w-full px-3 py-2 pl-9 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-semibold focus:ring-1 focus:ring-emerald-500"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 font-mono">Rp</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Satuan: {meta.unitProduce}
          </span>
        </div>

        {/* 2. Target Panen Paten Gold (Ton/Ha) */}
        <div className="space-y-1.5">
          <label className="font-semibold text-emerald-900 flex items-center justify-between">
            <span>Perkiraan Panen Sistem Paten</span>
            <span className="font-mono text-emerald-700 font-bold">
              {currentPatenYieldTon} Ton / Ha
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              step={0.1}
              min={0.5}
              max={50}
              value={currentPatenYieldTon}
              onChange={(e) => handlePatenYieldChange(Number(e.target.value))}
              className="w-full px-3 py-2 pr-12 bg-white border border-emerald-300 rounded-lg text-emerald-900 font-mono font-semibold focus:ring-1 focus:ring-emerald-500"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 font-mono">Ton/Ha</span>
          </div>
          <span className="text-[11px] text-emerald-600">
            Total panen di {areaAre} Are: <strong>{formatNumber(summary.patenYield)} kg</strong>
          </span>
        </div>

        {/* 3. Estimasi Panen Konvensional (Ton/Ha) */}
        <div className="space-y-1.5">
          <label className="font-semibold text-slate-700 flex items-center justify-between">
            <span>Panen Kimia Konvensional</span>
            <span className="font-mono text-slate-600 font-bold">
              {currentConvYieldTon} Ton / Ha
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              step={0.1}
              min={0.5}
              max={50}
              value={currentConvYieldTon}
              onChange={(e) => handleConvYieldChange(Number(e.target.value))}
              className="w-full px-3 py-2 pr-12 bg-white border border-slate-300 rounded-lg text-slate-700 font-mono font-medium focus:ring-1 focus:ring-emerald-500"
            />
            <span className="absolute right-3 top-2.5 text-slate-400 font-mono">Ton/Ha</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Total panen di {areaAre} Are: <strong>{formatNumber(summary.conventionalYield)} kg</strong>
          </span>
        </div>
      </div>

      {/* Output Live Calculations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Omzet Kotor */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Pendapatan Kotor (Omzet)
          </span>
          <div className="text-lg font-bold text-slate-900">
            {formatRupiah(summary.patenRevenue)}
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex justify-between">
            <span>Konvensional:</span>
            <span className="text-slate-600 line-through">
              {formatRupiah(summary.conventionalRevenue)}
            </span>
          </div>
        </div>

        {/* Modal Biaya Input */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Biaya Modal Input
          </span>
          <div className="text-lg font-bold text-emerald-700">
            {formatRupiah(summary.totalPatenSystemCost)}
          </div>
          <div className="text-[11px] text-emerald-700 pt-1 border-t border-slate-100 flex justify-between font-medium">
            <span>Hemat Modal:</span>
            <span>{summary.costSavingPercent}%</span>
          </div>
        </div>

        {/* Keuntungan Bersih (Net Profit) */}
        <div className="p-3.5 rounded-lg border border-emerald-300 bg-emerald-50/70 space-y-1">
          <span className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider block">
            Keuntungan Bersih (Net Profit)
          </span>
          <div className="text-xl font-extrabold text-emerald-900">
            {formatRupiah(summary.patenNetProfit)}
          </div>
          <div className="text-[11px] text-emerald-800 pt-1 border-t border-emerald-200/80 flex justify-between">
            <span>ROI Finansial:</span>
            <span className="font-bold">{summary.patenRoi}%</span>
          </div>
        </div>

        {/* Tambahan Laba Petani */}
        <div className="p-3.5 rounded-lg border border-amber-300 bg-amber-50/70 space-y-1">
          <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider block">
            Tambahan Keuntungan Bersih
          </span>
          <div className="text-xl font-extrabold text-amber-900 flex items-center">
            <ArrowUpRight className="w-5 h-5 mr-0.5 text-amber-700 inline shrink-0" />
            +{formatRupiah(summary.netProfitIncrease)}
          </div>
          <div className="text-[11px] text-amber-800 pt-1 border-t border-amber-200/80 flex justify-between font-semibold">
            <span>Kenaikan Laba Bersih:</span>
            <span>+{summary.netProfitIncreasePercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
