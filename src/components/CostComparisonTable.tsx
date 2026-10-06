import React from 'react';
import { SimulationSummary } from '../types';
import { CROP_METADATA } from '../data/cropProtocols';
import { Scale, Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface CostComparisonTableProps {
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

export const CostComparisonTable: React.FC<CostComparisonTableProps> = ({ summary }) => {
  const meta = CROP_METADATA[summary.crop];
  const companionTotalKg =
    summary.totalUreaKg + summary.totalZaKg + summary.totalNpkKg;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-600" />
          <h3 className="font-semibold text-sm text-slate-900">
            Tabel Komparasi Biaya: Pupuk Kimia Konvensional vs Sistem Paten Gold
          </h3>
        </div>
        <div className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-md border border-emerald-200/80">
          Efisiensi Biaya: Hemat {summary.costSavingPercent}% ({formatRupiah(summary.costDifference)})
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-4">Komponen Analisis</th>
              <th className="py-3 px-4 bg-slate-100/60 text-slate-700">
                Pupuk Kimia Konvensional (100%)
              </th>
              <th className="py-3 px-4 bg-emerald-50/60 text-emerald-900">
                Sistem Paten Gold Organik Nano
              </th>
              <th className="py-3 px-4 text-slate-700">Dampak & Selisih Efisiensi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* 1. Pupuk Utama */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-4 font-medium text-slate-800">
                1. Pupuk Utama / Hara Makro
              </td>
              <td className="py-3 px-4 bg-slate-50/40 text-slate-700">
                <span className="font-semibold text-slate-900">
                  {formatRupiah(summary.conventionalFertilizerCost)}
                </span>
                <span className="block text-[11px] text-slate-500">
                  Ratusan kg Urea, NPK, ZA padat
                </span>
              </td>
              <td className="py-3 px-4 bg-emerald-50/30 text-emerald-900">
                <span className="font-semibold text-emerald-800">
                  {formatRupiah(summary.patenCost + summary.chemicalCompanionCost)}
                </span>
                <span className="block text-[11px] text-emerald-700">
                  Paten ({summary.totalPatenBoxesRounded} box) + Starter ({companionTotalKg} kg)
                </span>
              </td>
              <td className="py-3 px-4 text-emerald-700 font-medium">
                Hemat{' '}
                {formatRupiah(
                  summary.conventionalFertilizerCost -
                    (summary.patenCost + summary.chemicalCompanionCost)
                )}
              </td>
            </tr>

            {/* 2. Insektisida / Pestisida */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-4 font-medium text-slate-800">
                2. Insektisida / Proteksi Hama
              </td>
              <td className="py-3 px-4 bg-slate-50/40 text-slate-700">
                <span className="font-semibold text-slate-900">
                  {formatRupiah(summary.conventionalPesticideCost)}
                </span>
                <span className="block text-[11px] text-slate-500">
                  Pestisida kimia dosis tinggi & sering
                </span>
              </td>
              <td className="py-3 px-4 bg-emerald-50/30 text-emerald-900">
                <span className="font-semibold text-emerald-800">
                  {formatRupiah(summary.insekCost)}
                </span>
                <span className="block text-[11px] text-emerald-700">
                  Insek terarah ({summary.totalInsekMl} ml / {summary.totalInsekBottles} botol)
                </span>
              </td>
              <td className="py-3 px-4 text-emerald-700 font-medium">
                Hemat {formatRupiah(summary.conventionalPesticideCost - summary.insekCost)}
              </td>
            </tr>

            {/* 3. Tenaga Kerja / Buruh Tani */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-4 font-medium text-slate-800">
                3. Ongkos Buruh Angkut & Tabur
              </td>
              <td className="py-3 px-4 bg-slate-50/40 text-slate-700">
                <span className="font-semibold text-slate-900">
                  {formatRupiah(summary.conventionalLaborCost)}
                </span>
                <span className="block text-[11px] text-slate-500">
                  Pikul karung pupuk 50kg ke tengah lahan
                </span>
              </td>
              <td className="py-3 px-4 bg-emerald-50/30 text-emerald-900">
                <span className="font-semibold text-emerald-800">
                  {formatRupiah(summary.patenLaborCost)}
                </span>
                <span className="block text-[11px] text-emerald-700">
                  Aplikasi semprot/kocor ringan sachet
                </span>
              </td>
              <td className="py-3 px-4 text-emerald-700 font-medium">
                Hemat {formatRupiah(summary.conventionalLaborCost - summary.patenLaborCost)}
              </td>
            </tr>

            {/* 4. Air Operasional */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-4 font-medium text-slate-800">
                4. Biaya Pompa Air Aplikasi
              </td>
              <td className="py-3 px-4 bg-slate-50/40 text-slate-500">
                <span>Included / Irigasi pasif</span>
              </td>
              <td className="py-3 px-4 bg-emerald-50/30 text-emerald-900">
                <span className="font-medium text-slate-700">
                  {formatRupiah(summary.waterCost)}
                </span>
                <span className="block text-[11px] text-slate-500">
                  {formatNumber(summary.totalWaterLiters)} Liter larutan
                </span>
              </td>
              <td className="py-3 px-4 text-slate-500">
                Biaya operasional terkontrol
              </td>
            </tr>

            {/* TOTAL BIAYA INPUT */}
            <tr className="bg-slate-100 font-semibold text-slate-900 border-t-2 border-slate-300">
              <td className="py-3.5 px-4 text-sm">TOTAL BIAYA INPUT MODAL</td>
              <td className="py-3.5 px-4 text-sm bg-slate-200/70 text-slate-900">
                {formatRupiah(summary.totalConventionalCost)}
              </td>
              <td className="py-3.5 px-4 text-sm bg-emerald-100 text-emerald-900">
                {formatRupiah(summary.totalPatenSystemCost)}
              </td>
              <td className="py-3.5 px-4 text-sm text-emerald-800">
                HEMAT {formatRupiah(summary.costDifference)} ({summary.costSavingPercent}%)
              </td>
            </tr>

            {/* HASIL PANEN */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-4 font-medium text-slate-800">
                Estimasi Hasil Panen Fisik
              </td>
              <td className="py-3 px-4 bg-slate-50/40 font-medium text-slate-800">
                {formatNumber(summary.conventionalYield)} {meta.unitProduce}
              </td>
              <td className="py-3 px-4 bg-emerald-50/30 font-semibold text-emerald-800">
                {formatNumber(summary.patenYield)} {meta.unitProduce}
              </td>
              <td className="py-3 px-4 text-emerald-700 font-semibold">
                +{formatNumber(summary.yieldIncreaseKg)} {meta.unitProduce} (+
                {summary.yieldIncreasePercent}%)
              </td>
            </tr>

            {/* OMZET KOTOR */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-4 font-medium text-slate-800">
                Nilai Penjualan Panen (Omzet)
              </td>
              <td className="py-3 px-4 bg-slate-50/40 text-slate-800">
                {formatRupiah(summary.conventionalRevenue)}
              </td>
              <td className="py-3 px-4 bg-emerald-50/30 font-semibold text-emerald-800">
                {formatRupiah(summary.patenRevenue)}
              </td>
              <td className="py-3 px-4 text-emerald-700 font-semibold">
                +{formatRupiah(summary.revenueDifference)}
              </td>
            </tr>

            {/* LABA BERSIH PETANI */}
            <tr className="bg-emerald-50/80 font-bold text-slate-900 border-t border-b border-emerald-200">
              <td className="py-3.5 px-4 text-sm text-emerald-950">
                LABA BERSIH PETANI (NET PROFIT)
              </td>
              <td className="py-3.5 px-4 text-sm text-slate-800 bg-slate-100">
                {formatRupiah(summary.conventionalNetProfit)}
              </td>
              <td className="py-3.5 px-4 text-sm text-emerald-900 bg-emerald-100">
                {formatRupiah(summary.patenNetProfit)}
              </td>
              <td className="py-3.5 px-4 text-sm text-emerald-800">
                TAMBAHAN LABA: +{formatRupiah(summary.netProfitIncrease)} (+
                {summary.netProfitIncreasePercent}%)
              </td>
            </tr>

            {/* ROI & B/C RATIO */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-4 font-medium text-slate-800">
                Analisis ROI & Kelayakan (B/C Ratio)
              </td>
              <td className="py-3 px-4 bg-slate-50/40 text-slate-700">
                ROI: <strong>{summary.conventionalRoi}%</strong> (B/C:{' '}
                {summary.conventionalBcRatio})
              </td>
              <td className="py-3 px-4 bg-emerald-50/30 text-emerald-900 font-semibold">
                ROI: <strong>{summary.patenRoi}%</strong> (B/C:{' '}
                {summary.patenBcRatio})
              </td>
              <td className="py-3 px-4 text-emerald-700 font-medium">
                Peningkatan ROI +
                {(summary.patenRoi - summary.conventionalRoi).toFixed(1)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
