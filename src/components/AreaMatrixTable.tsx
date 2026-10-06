import React from 'react';
import { AreaMatrixRow } from '../types';
import { Grid, Sparkles } from 'lucide-react';

interface AreaMatrixTableProps {
  matrix: AreaMatrixRow[];
  currentAreaAre: number;
  onSelectArea: (are: number) => void;
  cropName: string;
  modeLabel: string;
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

export const AreaMatrixTable: React.FC<AreaMatrixTableProps> = ({
  matrix,
  currentAreaAre,
  onSelectArea,
  cropName,
  modeLabel,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4 text-emerald-600" />
          <h3 className="font-semibold text-sm text-slate-900">
            Tabel Komparasi Rentang Luas Lahan (10 Are s/d 100 Are / 1 Hektar)
          </h3>
        </div>
        <div className="text-xs text-slate-500">
          Klik baris mana saja untuk mensimulasikan langsung
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-3">Luas Lahan</th>
              <th className="py-3 px-3">Populasi</th>
              <th className="py-3 px-3">Paten Gold</th>
              <th className="py-3 px-3">Air (Liter)</th>
              <th className="py-3 px-3">Insek (ml)</th>
              <th className="py-3 px-3">Kimia (kg)</th>
              <th className="py-3 px-3">Biaya Paten</th>
              <th className="py-3 px-3">Biaya Kimia</th>
              <th className="py-3 px-3 text-emerald-800">Hemat (Rp / %)</th>
              <th className="py-3 px-3 text-right">Laba Bersih</th>
              <th className="py-3 px-3 text-right">ROI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matrix.map((row) => {
              const isSelected = row.areaAre === currentAreaAre;
              const isHalfHa = row.areaAre === 50;

              return (
                <tr
                  key={row.areaAre}
                  onClick={() => onSelectArea(row.areaAre)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-50/80 font-medium text-slate-900 ring-1 ring-inset ring-emerald-500/50'
                      : 'hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-emerald-600' : 'bg-slate-300'
                        }`}
                      ></span>
                      <span className="font-semibold text-slate-900">
                        {row.areaAre} Are
                      </span>
                      <span className="text-[11px] text-slate-400">
                        ({row.areaHa} Ha)
                      </span>
                      {isHalfHa && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded ml-1">
                          0.5 Ha
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                    {formatNumber(row.population)}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap font-medium text-amber-800">
                    {row.patenSachets} sct{' '}
                    <span className="text-[11px] text-slate-500">
                      ({row.patenBoxes} box)
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {formatNumber(row.waterLiters)} L
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-rose-600">
                    {row.insekMl > 0 ? `${row.insekMl} ml` : '-'}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {row.companionFertilizerKg > 0
                      ? `${row.companionFertilizerKg} kg`
                      : '-'}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-800">
                    Rp {formatNumber(row.patenTotalCost)}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-500 line-through">
                    Rp {formatNumber(row.conventionalTotalCost)}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-emerald-700 font-semibold">
                    Rp {formatNumber(row.costSavings)}{' '}
                    <span className="text-[11px] font-normal">
                      ({row.savingsPercent}%)
                    </span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-right font-semibold text-slate-900">
                    Rp {formatNumber(row.patenNetProfit)}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-right font-medium text-indigo-700">
                    {row.roi}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
