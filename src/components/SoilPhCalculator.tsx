import React, { useState } from 'react';
import { CropType } from '../types';
import {
  FlaskConical,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface SoilPhCalculatorProps {
  areaAre: number;
  crop: CropType;
}

export const SoilPhCalculator: React.FC<SoilPhCalculatorProps> = ({
  areaAre,
  crop,
}) => {
  const [phValue, setPhValue] = useState<number>(5.2); // Default typical Indonesian soil pH
  const [dolomitePricePerKg, setDolomitePricePerKg] = useState<number>(750); // Rp 750/kg (~Rp 37.500 / karung 50kg)

  const areaHa = areaAre / 100;

  // Analisis Kondisi pH Tanah
  const getPhStatus = (ph: number) => {
    if (ph < 4.5) {
      return {
        label: 'Sangat Masam (Kritis)',
        color: 'text-rose-700 bg-rose-50 border-rose-300',
        badgeColor: 'bg-rose-500',
        efficiencyRate: 35,
        dolomitePerHaTon: 6.0, // 6 ton/ha
        description:
          'Kondisi kritis! Toksisitas Alumunium (Al) dan Besi (Fe) tinggi. Unsur Fosfor (P) terikat mati dan tidak bisa diserap akar. Mikroba tanah menguntungkan pasif.',
        recommendation:
          'Wajib pengapuran dolomit intensif sebelum tanam. Tebar rata bersama bajak/olah tanah 2–3 minggu sebelum bibit masuk.',
      };
    }
    if (ph < 5.5) {
      return {
        label: 'Masam (Perlu Koreksi)',
        color: 'text-amber-800 bg-amber-50 border-amber-300',
        badgeColor: 'bg-amber-500',
        efficiencyRate: 55,
        dolomitePerHaTon: 3.5, // 3.5 ton/ha
        description:
          'pH tanah umum di perkebunan dan sawah Indonesia. Penyerapan pupuk kimia terbuang sekitar 40–45%. Efisiensi Paten Gold masih bisa ditingkatkan.',
        recommendation:
          'Koreksi dengan dolomit untuk menaikkan pH ke rentang ideal 6.0–6.8 agar penyerapan hara nano dan unsur hara tanah mencapai potensi puncak.',
      };
    }
    if (ph <= 6.8) {
      return {
        label: 'Ideal & Netral (Optimal)',
        color: 'text-emerald-800 bg-emerald-50 border-emerald-300',
        badgeColor: 'bg-emerald-500',
        efficiencyRate: 95,
        dolomitePerHaTon: 0, // Optimal
        description:
          'Kondisi tanah sangat ideal! Seluruh unsur hara makro (N, P, K) dan mikro tersedia bebas. Rambut akar menyerap larutan Paten Gold secara maksimal tanpa hambatan.',
        recommendation:
          'Lahan prima! Tidak perlu penambahan dolomit koreksi. Cukup gunakan kapur pemeliharaan tipis (200–300 kg/ha) jika tanah miskin kalsium/magnesium.',
      };
    }
    if (ph <= 7.5) {
      return {
        label: 'Agak Alkalis / Basa',
        color: 'text-sky-800 bg-sky-50 border-sky-300',
        badgeColor: 'bg-sky-500',
        efficiencyRate: 75,
        dolomitePerHaTon: 0,
        description:
          'Kadar kapur tanah tinggi. Unsur hara mikro seperti Besi (Fe), Mangan (Mn), dan Seng (Zn) mulai mengendap.',
        recommendation:
          'JANGAN menambah kapur/dolomit! Tambahkan bahan organik atau belerang (ZA) untuk menggeser pH tanah ke arah netral.',
      };
    }
    return {
      label: 'Sangat Basa / Alkalis Ekstrem',
      color: 'text-purple-800 bg-purple-50 border-purple-300',
      badgeColor: 'bg-purple-500',
      efficiencyRate: 45,
      dolomitePerHaTon: 0,
      description:
        'Tanah salin/alkalin ekstrem. Terjadi defisiensi unsur hara mikro parah.',
      recommendation:
        'Perbaiki aerasi dengan pupuk organik asam, hindari semua jenis kapur pertanian.',
    };
  };

  const status = getPhStatus(phValue);

  // Perhitungan Kebutuhan Dolomit untuk Luas Lahan Aktif
  const totalDolomiteKg = Math.round(status.dolomitePerHaTon * 1000 * areaHa);
  const totalSacks50kg = Math.ceil(totalDolomiteKg / 50);
  const estimatedCost = totalDolomiteKg * dolomitePricePerKg;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700">
            <FlaskConical className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">
              Kalkulator Koreksi pH Tanah & Dosis Kapur Dolomit
            </h3>
            <p className="text-xs text-slate-500">
              Hitung kebutuhan dolomit berdasarkan pH tanah riil untuk memaksimalkan daya serap pupuk Paten Gold
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Harga Dolomit:</span>
          <div className="flex items-center gap-1 font-mono">
            <span className="text-slate-400">Rp</span>
            <input
              type="number"
              step={50}
              value={dolomitePricePerKg}
              onChange={(e) => setDolomitePricePerKg(Number(e.target.value))}
              className="w-20 px-2 py-0.5 border border-slate-300 rounded text-slate-800 text-xs text-right font-mono font-medium"
            />
            <span className="text-slate-500">/kg</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left: pH Slider & Gauge */}
        <div className="lg:col-span-7 space-y-3.5 p-4 rounded-xl bg-slate-50/70 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              Geser Tingkat pH Tanah Lahan Anda:
            </label>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold font-mono text-slate-900">
                {phValue.toFixed(1)}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded border ${status.color}`}
              >
                {status.label}
              </span>
            </div>
          </div>

          {/* Range Slider */}
          <input
            type="range"
            min={3.5}
            max={8.5}
            step={0.1}
            value={phValue}
            onChange={(e) => setPhValue(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />

          {/* Scale Labels */}
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>3.5 (Sangat Asam)</span>
            <span>5.0 (Masam)</span>
            <span className="text-emerald-700 font-bold">6.5 (Ideal Netral)</span>
            <span>7.5 (Agak Basa)</span>
            <span>8.5 (Alkali)</span>
          </div>

          {/* Efficiency Bar */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600 font-medium">
                Efisiensi Potensi Penyerapan Hara pada pH {phValue.toFixed(1)}:
              </span>
              <span
                className={`font-bold font-mono ${
                  status.efficiencyRate >= 80
                    ? 'text-emerald-700'
                    : status.efficiencyRate >= 50
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                {status.efficiencyRate}%
              </span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                style={{ width: `${status.efficiencyRate}%` }}
                className={`h-full transition-all duration-300 ${
                  status.efficiencyRate >= 80
                    ? 'bg-emerald-500'
                    : status.efficiencyRate >= 50
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
              ></div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">{status.description}</p>
          </div>
        </div>

        {/* Right: Dolomite Calculation Card */}
        <div className="lg:col-span-5 p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-3">
          <div className="flex items-center justify-between border-b border-teal-200/80 pb-2">
            <span className="font-semibold text-teal-950 text-xs">
              Rekomendasi Dosis Kapur Dolomit
            </span>
            <span className="text-[11px] font-mono text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
              Luas: {areaAre} Are ({areaHa} Ha)
            </span>
          </div>

          {totalDolomiteKg > 0 ? (
            <div className="space-y-2.5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-2xl font-bold text-slate-900 font-mono">
                    {totalDolomiteKg.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs font-medium text-slate-600 ml-1">kg</span>
                </div>
                <span className="text-xs font-semibold text-teal-800 bg-teal-100/90 px-2 py-0.5 rounded">
                  ~{totalSacks50kg} Karung (@ 50kg)
                </span>
              </div>

              <div className="text-xs text-slate-700 space-y-1 pt-1 border-t border-teal-200/60">
                <div className="flex justify-between">
                  <span className="text-slate-500">Kebutuhan per Hektar:</span>
                  <span className="font-semibold text-slate-800">
                    {status.dolomitePerHaTon} Ton / Ha
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimasi Biaya Dolomit:</span>
                  <span className="font-bold text-teal-900">
                    Rp {estimatedCost.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-teal-900 bg-white p-2 rounded border border-teal-200/80 leading-relaxed">
                <strong>Cara Aplikasi:</strong> Tebar rata dolomit pada tanah olahan saat kondisi lembap minimal <strong>2–3 minggu sebelum tanam</strong>. Jangan mencampur dolomit bersamaan dengan pupuk nitrogen kimia (Urea) karena dapat memicu penguapan gas amonia.
              </div>
            </div>
          ) : (
            <div className="py-4 text-center space-y-1.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="font-semibold">Tanah Sudah di Rentang Ideal (pH {phValue.toFixed(1)})</p>
              <p className="text-[11px] text-slate-600">
                Tidak memerlukan penambahan kapur dolomit koreksi. Penyerapan partikel nano Paten Gold akan bekerja pada efisiensi maksimal (&gt; 90%).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
