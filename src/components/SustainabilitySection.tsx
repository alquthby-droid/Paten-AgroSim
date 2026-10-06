import React, { useState } from 'react';
import { SimulationSummary, AreaMatrixRow, CropType } from '../types';
import { MULTI_YEAR_PROJECTIONS, CROP_METADATA } from '../data/cropProtocols';
import {
  Leaf,
  Award,
  TrendingUp,
  BarChart3,
  CheckCircle2,
  DollarSign,
  Layers,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface SustainabilitySectionProps {
  summary: SimulationSummary;
  matrix: AreaMatrixRow[];
  crop: CropType;
}

function formatRupiah(value: number): string {
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)} jt`;
  }
  return `Rp ${(value / 1_000).toFixed(0)} rb`;
}

export const SustainabilitySection: React.FC<SustainabilitySectionProps> = ({
  summary,
  matrix,
  crop,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'roi' | 'financial' | 'multiyear'>('roi');
  const meta = CROP_METADATA[crop];

  // 1. Data untuk grafik ROI (Rentang 10 s/d 100 Are)
  const roiChartData = matrix.map((row) => ({
    name: `${row.areaAre} Are`,
    areaHa: row.areaHa,
    'ROI Paten Gold (%)': row.roi,
    'ROI Kimia Konvensional (%)': summary.conventionalRoi,
  }));

  // 2. Data untuk perbandingan Finansial Modal vs Omzet vs Laba Bersih (Luas Terpilih)
  const financialComparisonData = [
    {
      kategori: 'Biaya Modal Input',
      'Kimia Konvensional': summary.totalConventionalCost,
      'Paten Gold System': summary.totalPatenSystemCost,
    },
    {
      kategori: 'Omzet Penjualan Panen',
      'Kimia Konvensional': summary.conventionalRevenue,
      'Paten Gold System': summary.patenRevenue,
    },
    {
      kategori: 'Laba Bersih Petani',
      'Kimia Konvensional': summary.conventionalNetProfit,
      'Paten Gold System': summary.patenNetProfit,
    },
  ];

  // 3. Data tren proyeksi 3 tahun
  const multiYearTrendData = [
    {
      period: 'Tahun 0 (Konvensional)',
      'Pengurangan Kimia (%)': 0,
      'Kenaikan Panen (%)': 0,
      'Laba Bersih (Juta Rp)': Math.round(summary.conventionalNetProfit / 1_000_000),
    },
    {
      period: 'Tahun 1 (Remidiasi Tanah)',
      'Pengurangan Kimia (%)': 40,
      'Kenaikan Panen (%)': 22,
      'Laba Bersih (Juta Rp)': Math.round((summary.patenNetProfit * 0.95) / 1_000_000),
    },
    {
      period: 'Tahun 2 (Regenerasi Struktur)',
      'Pengurangan Kimia (%)': 60,
      'Kenaikan Panen (%)': 32,
      'Laba Bersih (Juta Rp)': Math.round((summary.patenNetProfit * 1.1) / 1_000_000),
    },
    {
      period: 'Tahun 3+ (Kemandirian Hayati)',
      'Pengurangan Kimia (%)': 75,
      'Kenaikan Panen (%)': 40,
      'Laba Bersih (Juta Rp)': Math.round((summary.patenNetProfit * 1.25) / 1_000_000),
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="font-semibold text-sm text-slate-900">
              Analisis Visual Grafik ROI & Proyeksi Keberlanjutan Jangka Panjang
            </h3>
            <p className="text-xs text-slate-500">
              Visualisasi komparasi efisiensi pengembalian investasi (ROI) dan tren perbaikan hara multi-musim
            </p>
          </div>
        </div>

        {/* Chart View Switcher */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveChartTab('roi')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeChartTab === 'roi'
                ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Grafik ROI (%)</span>
          </button>

          <button
            onClick={() => setActiveChartTab('financial')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeChartTab === 'financial'
                ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Modal vs Laba Bersih</span>
          </button>

          <button
            onClick={() => setActiveChartTab('multiyear')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              activeChartTab === 'multiyear'
                ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tren 3 Tahun</span>
          </button>
        </div>
      </div>

      {/* Recharts Visual Container */}
      <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-200/80">
        {activeChartTab === 'roi' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs px-2">
              <span className="font-semibold text-slate-800">
                Perbandingan ROI (%): Paten Gold vs Pupuk Kimia Konvensional (Rentang 10 - 100 Are)
              </span>
              <span className="text-emerald-700 font-mono font-medium">
                Paten Gold ROI Rata-rata: {summary.patenRoi}% vs Kimia: {summary.conventionalRoi}%
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={roiChartData}
                  margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value}%`, name]}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
                  />
                  <Bar
                    dataKey="ROI Paten Gold (%)"
                    fill="#059669"
                    radius={[4, 4, 0, 0]}
                    name="ROI Paten Gold (%)"
                  />
                  <Bar
                    dataKey="ROI Kimia Konvensional (%)"
                    fill="#94a3b8"
                    radius={[4, 4, 0, 0]}
                    name="ROI Kimia Konvensional (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500 text-center italic">
              *Tingkat ROI dihitung dari (Laba Bersih / Total Biaya Input Modal) × 100%. Paten Gold melipatgandakan ROI berkat efisiensi biaya dan lonjakan panen.
            </p>
          </div>
        )}

        {activeChartTab === 'financial' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs px-2">
              <span className="font-semibold text-slate-800">
                Komparasi Finansial Pada Luas {summary.areaAre} Are ({summary.areaHa} Ha)
              </span>
              <span className="text-emerald-700 font-mono font-medium">
                Hemat Modal: {summary.costSavingPercent}% | Tambahan Laba: +
                {formatRupiah(summary.netProfitIncrease)}
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialComparisonData}
                  margin={{ top: 20, right: 20, left: 15, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="kategori"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickFormatter={(val) => formatRupiah(val)}
                  />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(value),
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
                  />
                  <Bar
                    dataKey="Kimia Konvensional"
                    fill="#cbd5e1"
                    radius={[4, 4, 0, 0]}
                    name="Pupuk Kimia Konvensional"
                  />
                  <Bar
                    dataKey="Paten Gold System"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Paten Gold System"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500 text-center italic">
              *Perhatikan bahwa biaya modal input Paten Gold jauh lebih rendah (warna hijau), namun omzet dan laba bersih petani melonjak signifikan.
            </p>
          </div>
        )}

        {activeChartTab === 'multiyear' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs px-2">
              <span className="font-semibold text-slate-800">
                Proyeksi Kurva Efisiensi & Kenaikan Laba Multi-Tahun (3 Tahun Penggunaan)
              </span>
              <span className="text-emerald-700 font-mono font-medium">
                Pengurangan Pupuk Kimia Bertahap hingga 75-80%
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={multiYearTrendData}
                  margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
                >
                  <defs>
                    <linearGradient id="colorLaba" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorKimia" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="period"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Pengurangan Kimia (%)"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorKimia)"
                    name="Pengurangan Pupuk Kimia (%)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Kenaikan Panen (%)"
                    stroke="#059669"
                    fillOpacity={1}
                    fill="url(#colorLaba)"
                    name="Kenaikan Panen (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500 text-center italic">
              *Tahun ke tahun, ketergantungan pupuk kimia anorganik terus menurun drastis, sementara hasil panen meningkat stabil karena kondisi biologi tanah kembali pulih.
            </p>
          </div>
        )}
      </div>

      {/* Multi-Year Projection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {MULTI_YEAR_PROJECTIONS.map((proj, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-emerald-50/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-emerald-800">
                  {proj.year}
                </span>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                  Hemat Kimia {proj.chemicalFertilizerReduction}
                </span>
              </div>

              <h4 className="text-xs font-semibold text-slate-900 mb-1">
                Kondisi Kesuburan Lahan:
              </h4>
              <p className="text-xs text-slate-600 mb-3">{proj.soilHealth}</p>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    <strong>Hasil Panen:</strong> {proj.yieldImpact}
                  </span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    <strong>Efisiensi Biaya:</strong> {proj.costSavings}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200/70 text-[11px] text-slate-500 italic">
              {proj.sustainabilityNote}
            </div>
          </div>
        ))}
      </div>

      {/* Callout Keunggulan Nano */}
      <div className="p-4 bg-emerald-950 text-emerald-100 rounded-lg text-xs leading-relaxed flex items-start gap-3">
        <Award className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-emerald-300 block mb-0.5">
            Keunggulan Fisiologis Teknologi Nano Paten Gold:
          </span>
          Pupuk kimia sintetis konvensional hanya terserap sekitar 30-40% oleh tanaman karena
          penguapan dan pencucian air hujan, sedangkan sisanya merusak pH tanah menjadi masam. Paten Gold memiliki partikel
          berukuran nano (&lt; 100 nm) yang langsung menembus membran sel dan stomata daun dalam hitungan 15-30 menit,
          menghasilkan efisiensi serapan nutrisi mendekati 95% tanpa meninggalkan residu asam di tanah.
        </div>
      </div>
    </div>
  );
};
