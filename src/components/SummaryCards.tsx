import React from 'react';
import { SimulationSummary } from '../types';
import { Package, Droplets, TrendingUp, DollarSign, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface SummaryCardsProps {
  summary: SimulationSummary;
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

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const companionTotalKg =
    summary.totalUreaKg + summary.totalZaKg + summary.totalNpkKg;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Kebutuhan Paten Gold */}
      <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Paten Gold
          </span>
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <Package className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {summary.totalPatenSachets}
          </span>
          <span className="text-xs font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
            {summary.totalPatenBoxesRounded} Box (@ 24 sachet)
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Biaya Paten Gold:</span>
            <span className="font-semibold text-slate-800">
              {formatRupiah(summary.patenCost)}
            </span>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>Teknologi:</span>
            <span className="text-emerald-700 font-medium">100% Organik Nano</span>
          </div>
        </div>
      </div>

      {/* 2. Rincian Air & Insek */}
      <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Air & Insektisida
          </span>
          <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
            <Droplets className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            {formatNumber(summary.totalWaterLiters)}
          </span>
          <span className="text-xs font-medium text-slate-500">
            Liter Air (~{summary.totalSprayTanks} tangki)
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Kebutuhan Insek:</span>
            <span className="font-semibold text-slate-800">
              {summary.totalInsekMl} ml ({summary.totalInsekBottles} btl 100ml)
            </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Kimia Starter:</span>
            <span className="font-medium text-slate-700">
              {companionTotalKg} kg (Hemat 80%)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Penghematan Biaya Pemupukan */}
      <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Efisiensi Biaya Input
          </span>
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-emerald-700">
            {summary.costSavingPercent}%
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
            Hemat {formatRupiah(summary.costDifference)}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Sistem Paten:</span>
            <span className="font-medium text-slate-800">
              {formatRupiah(summary.totalPatenSystemCost)}
            </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Kimia Murni:</span>
            <span className="line-through text-slate-400">
              {formatRupiah(summary.totalConventionalCost)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Proyeksi Panen & ROI */}
      <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            ROI & Laba Tambahan
          </span>
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-indigo-700">
            {summary.patenRoi}%
          </span>
          <span className="text-xs font-medium text-slate-500">
            B/C Ratio {summary.patenBcRatio}
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Kenaikan Panen:</span>
            <span className="font-semibold text-emerald-700 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 inline mr-0.5" />
              +{summary.yieldIncreasePercent}% ({formatNumber(summary.yieldIncreaseKg)} kg)
            </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Tambahan Laba:</span>
            <span className="font-bold text-slate-800">
              +{formatRupiah(summary.netProfitIncrease)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
