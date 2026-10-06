import React from 'react';
import { StepRequirement, CropType } from '../types';
import { BarChart3, Sprout, Sparkles } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface PhaseSachetDistributionChartProps {
  steps: StepRequirement[];
  crop: CropType;
}

export const PhaseSachetDistributionChart: React.FC<PhaseSachetDistributionChartProps> = ({
  steps,
  crop,
}) => {
  // Tentukan batas hari vegetatif vs generatif berdasarkan komoditas
  const getPhaseName = (day: number) => {
    if (day === 0) return 'Pra-Tanam';
    if (crop === 'tembakau') {
      return day <= 25 ? 'Fase Vegetatif' : 'Fase Generatif';
    }
    // Jagung & Padi & Hortikultura:
    return day <= 35 ? 'Fase Vegetatif' : 'Fase Generatif';
  };

  const chartData = steps.map((s) => {
    const phase = getPhaseName(s.day);
    return {
      label: s.label,
      day: s.day,
      phase,
      'Sachet Paten': s.patenSachets,
      waterLiters: s.waterLiters,
      method: s.method,
      color:
        phase === 'Pra-Tanam'
          ? '#0284c7'
          : phase === 'Fase Vegetatif'
          ? '#059669'
          : '#d97706',
    };
  });

  // Hitung total sachet per fase
  const vegetatifSachets = chartData
    .filter((d) => d.phase === 'Fase Vegetatif')
    .reduce((acc, curr) => acc + curr['Sachet Paten'], 0);

  const generatifSachets = chartData
    .filter((d) => d.phase === 'Fase Generatif')
    .reduce((acc, curr) => acc + curr['Sachet Paten'], 0);

  const praTanamSachets = chartData
    .filter((d) => d.phase === 'Pra-Tanam')
    .reduce((acc, curr) => acc + curr['Sachet Paten'], 0);

  const totalSachets = vegetatifSachets + generatifSachets + praTanamSachets;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="font-semibold text-sm text-slate-900">
              Distribusi Kebutuhan Pupuk Paten per Fase Pertumbuhan (Vegetatif vs Generatif)
            </h3>
            <p className="text-xs text-slate-500">
              Visualisasi jumlah sachet pupuk di setiap tahapan umur tanaman (HST)
            </p>
          </div>
        </div>

        {/* Legend Summary Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {praTanamSachets > 0 && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-sky-50 text-sky-800 border border-sky-200 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              Pra-Tanam: {praTanamSachets} sct ({Math.round((praTanamSachets / totalSachets) * 100)}%)
            </span>
          )}

          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            Vegetatif: {vegetatifSachets} sct ({Math.round((vegetatifSachets / totalSachets) * 100)}%)
          </span>

          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
            Generatif: {generatifSachets} sct ({Math.round((generatifSachets / totalSachets) * 100)}%)
          </span>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 15, right: 15, left: 0, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              stroke="#64748b"
              fontSize={11}
              angle={-20}
              textAnchor="end"
              height={45}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(val) => `${val} sct`}
            />
            <Tooltip
              formatter={(value: any, name: any, item: any) => [
                `${value} Sachet (${item.payload.method.toUpperCase()} · ${item.payload.waterLiters}L air)`,
                'Dosis Paten',
              ]}
              labelFormatter={(label) => `Jadwal: ${label}`}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '12px',
                border: 'none',
              }}
            />
            <Bar dataKey="Sachet Paten" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1">
          <Sprout className="w-3.5 h-3.5 text-emerald-600" />
          Warna Hijau: Fase Vegetatif (Akar & Daun) · Warna Kuning Emas: Fase Generatif (Bunga & Buah)
        </span>
        <span className="font-semibold text-slate-700">
          Total Kebutuhan: {totalSachets} Sachet (~{Math.ceil(totalSachets / 24)} Box)
        </span>
      </div>
    </div>
  );
};
