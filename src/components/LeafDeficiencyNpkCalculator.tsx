import React, { useState, useMemo } from 'react';
import { CropType, DeficiencySeverity, LeafDeficiencyInput } from '../types';
import { CROP_METADATA } from '../data/cropProtocols';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Info,
  Layers,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Droplets,
} from 'lucide-react';

interface LeafDeficiencyNpkCalculatorProps {
  crop: CropType;
  areaAre: number;
}

interface NutrientDeficiencySpec {
  name: string;
  symbol: string;
  role: string;
  symptoms: Record<CropType, string>;
  severityMultipliers: Record<DeficiencySeverity, number>;
  baseKgPerHa: number;
  recommendedCompound: Record<CropType, string>;
  applicationTip: string;
}

const DEFICIENCY_SPECS: Record<keyof LeafDeficiencyInput, NutrientDeficiencySpec> = {
  nitrogen: {
    name: 'Nitrogen (N)',
    symbol: 'N',
    role: 'Pertumbuhan vegetatif daun, pembentukan protein & zat hijau daun (klorofil)',
    symptoms: {
      jagung: 'Daun tua bagian bawah menguning mulai dari ujung membentuk huruf "V", tanaman kerdil & batang kurus.',
      padi: 'Seluruh daun bawah berwarna pucat kekuningan, jumlah anakan produktif berkurang drastis, daun tegak kaku.',
      tembakau: 'Daun bawah tipis, pucat menguning prematur, daun mudah rontok, bobot krosok ringan.',
      hortikultura: 'Daun bawah menguning merata, percabangan sedikit, tanaman lambat tumbuh.',
    },
    severityMultipliers: {
      normal: 0,
      ringan: 0.35,
      sedang: 0.7,
      berat: 1.0,
    },
    baseKgPerHa: 50, // 50 kg/ha NPK/Urea penyeimbang
    recommendedCompound: {
      jagung: 'NPK 16-16-16 (150 gr/tangki) atau ZA/Urea starter terlarut',
      padi: 'NPK Ponska / Urea (1 gelas/tangki) saat semprot kasar',
      tembakau: 'ZA (Amonium Sulfat) piringan akar — hindari Urea berlebih agar daun tidak gosong',
      hortikultura: 'NPK Mutiara 16-16-16 terlarut kocor',
    },
    applicationTip:
      'Campurkan 1 sachet Paten Gold + 1 gelas larutan pupuk nitrogen ke tangki 16L. Nano-chelate Paten mempercepat penyerapan N langsung ke klorofil dalam 15 menit.',
  },
  phosphorus: {
    name: 'Fosfor / Phospor (P)',
    symbol: 'P',
    role: 'Energi ATP sel, perakaran serabut, pembungaan & kekokohan anakan',
    symptoms: {
      jagung: 'Daun tua berwarna ungu kemerahan pada pinggirannya, perakaran lemah, tongkol bengkok/tidak terisi penuh.',
      padi: 'Batang kurus, anakan terlambat muncul, perakaran cokelat kehitaman, pembungaan terlambat.',
      tembakau: 'Tanaman kerdil kaku, daun hijau gelap kusam tidak elastis, perakaran lambat.',
      hortikultura: 'Daun tua memerah/keunguan, pembungaan rontok, akar terhambat.',
    },
    severityMultipliers: {
      normal: 0,
      ringan: 0.3,
      sedang: 0.65,
      berat: 1.0,
    },
    baseKgPerHa: 35, // 35 kg/ha suplemen P
    recommendedCompound: {
      jagung: 'SP-36 / NPK 16-16-16 atau pupuk Fosfat larut (MKP)',
      padi: 'SP-36 / TSP atau NPK seimbang',
      tembakau: 'DAP (Diammonium Phosphate) atau NPK rendah klorida',
      hortikultura: 'MKP (Mono Kalium Phosphate) larut air foliar',
    },
    applicationTip:
      'Unsur Fosfor di tanah sering terikat mati oleh ion Al dan Fe. Larutan Paten Gold memecah ikatan ion sehingga Fosfat cepat diserap rambut akar.',
  },
  potassium: {
    name: 'Kalium (K)',
    symbol: 'K',
    role: 'Pengisian biji/buah, kualitas krosok daun tembakau, elastisitas sel & daya tahan kekeringan',
    symptoms: {
      jagung: 'Pinggir daun tua kering kecokelatan seperti terbakar (marginal chlorosis/necrosis), tongkol kopong di pucuk, mudah roboh.',
      padi: 'Ujung daun mengering kecokelatan, malai padi rebah, bulir gabah hampa / banyak beluk.',
      tembakau: 'Tepi daun menggulung ke bawah, bercak nekrosis cokelat rapuh, daya bakar rokok menurun.',
      hortikultura: 'Pinggiran daun kering terbakar, buah lembek mudah busuk ujung (blossom end rot).',
    },
    severityMultipliers: {
      normal: 0,
      ringan: 0.4,
      sedang: 0.75,
      berat: 1.0,
    },
    baseKgPerHa: 45, // 45 kg/ha K
    recommendedCompound: {
      jagung: 'KCl (Kalium Klorida) atau NPK 15-9-20 fase pengisian tongkol',
      padi: 'KCl atau NPK berkadar K tinggi saat fase bunting (H-50 HST)',
      tembakau: 'ZK (Kalium Sulfat / K2SO4) atau KNO3 Putih — DILARANG pakai KCl karena klor merusak aroma & daya bakar tembakau!',
      hortikultura: 'KNO3 Putih atau Kalium Nitrat larut semprot',
    },
    applicationTip:
      'Kalium sangat krusial saat pembelahan sel generatif. Semprotkan Paten Gold + Kalium pada sore hari untuk translokasi pati maksimal.',
  },
  magnesium: {
    name: 'Magnesium (Mg)',
    symbol: 'Mg',
    role: 'Inti molekul klorofil, transportasi fosfat & pengaktif enzim respirasi',
    symptoms: {
      jagung: 'Klorosis interveinal (tulang daun tetap hijau, tetapi sela-sela antar tulang daun menguning bergaris-garis putih).',
      padi: 'Garis-garis kuning di antara tulang daun pada helai daun tua, fotosintesis melambat.',
      tembakau: 'Penyakit "sand drown" — daun bagian bawah memutih di antara tulang daun, daun tipis rapuh.',
      hortikultura: 'Tulang daun hijau tebal dengan lamina daun kuning pucat berbintik.',
    },
    severityMultipliers: {
      normal: 0,
      ringan: 0.25,
      sedang: 0.6,
      berat: 1.0,
    },
    baseKgPerHa: 25, // 25 kg/ha
    recommendedCompound: {
      jagung: 'Magnesium Sulfat (Kieserite) 1-2 sendok makan per tangki atau kapur dolomit perakaran',
      padi: 'Kieserite / Magnesium Sulfat larut air',
      tembakau: 'Kieserite atau Dolomit halus kadar Mg > 18%',
      hortikultura: 'Magnesium Sulfat (Epsom Salt) foliar',
    },
    applicationTip:
      'Magnesium mengaktifkan kembali fotosintesis daun yang menguning dalam tempo 3–5 hari jika dikombinasikan dengan Paten Gold.',
  },
};

const SEVERITY_OPTIONS: { id: DeficiencySeverity; label: string; badge: string; desc: string }[] = [
  {
    id: 'normal',
    label: 'Normal / Sehat',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    desc: 'Warna daun hijau segar, tanpa gejala klorosis atau nekrosis.',
  },
  {
    id: 'ringan',
    label: 'Defisiensi Ringan (10–25%)',
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    desc: 'Gejala mulai terlihat pada 1–2 helai daun tertua paling bawah.',
  },
  {
    id: 'sedang',
    label: 'Defisiensi Sedang (25–50%)',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    desc: 'Gejala meluas ke daun tingkat tengah, laju pertumbuhan tanaman tertahan.',
  },
  {
    id: 'berat',
    label: 'Defisiensi Berat (>50%)',
    badge: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
    desc: 'Daun bawah mengering/terbakar, jaringan daun mati (nekrotik), risiko anjlok panen tinggi.',
  },
];

export const LeafDeficiencyNpkCalculator: React.FC<LeafDeficiencyNpkCalculatorProps> = ({
  crop,
  areaAre,
}) => {
  const [deficiencies, setDeficiencies] = useState<LeafDeficiencyInput>({
    nitrogen: 'ringan',
    phosphorus: 'normal',
    potassium: 'sedang',
    magnesium: 'normal',
  });

  const [activeNutrientTab, setActiveNutrientTab] = useState<keyof LeafDeficiencyInput>('nitrogen');

  const areaHa = areaAre / 100;
  const meta = CROP_METADATA[crop];

  // Hitung rekomendasi kebutuhan kg NPK suplemen
  const calculation = useMemo(() => {
    let totalSupplementKg = 0;
    const details = (Object.keys(deficiencies) as (keyof LeafDeficiencyInput)[]).map((key) => {
      const spec = DEFICIENCY_SPECS[key];
      const severity = deficiencies[key];
      const multiplier = spec.severityMultipliers[severity];
      const kgPerHa = spec.baseKgPerHa * multiplier;
      const kgForArea = Math.round(kgPerHa * areaHa * 10) / 10;
      totalSupplementKg += kgForArea;

      return {
        key,
        spec,
        severity,
        multiplier,
        kgPerHa: Math.round(kgPerHa),
        kgForArea,
      };
    });

    const isAnyDeficient = details.some((d) => d.severity !== 'normal');
    const estimatedCost = Math.round(totalSupplementKg * 8500); // Rata-rata Rp 8.500/kg pupuk majemuk/kimia starter

    // Sendok makan per tangki semprot 16 Liter
    const spoonsPerTank =
      totalSupplementKg > 0
        ? Math.min(4, Math.max(1, Math.round((totalSupplementKg / (areaAre * 0.15)) * 1.5)))
        : 0;

    return {
      details,
      totalSupplementKg: Math.round(totalSupplementKg * 10) / 10,
      estimatedCost,
      isAnyDeficient,
      spoonsPerTank,
    };
  }, [deficiencies, areaHa, areaAre]);

  const activeSpec = DEFICIENCY_SPECS[activeNutrientTab];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
            <Activity className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-900">
                Kalkulator Kebutuhan NPK Tambahan (Diagnosis Defisiensi Daun)
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Kombinasi Paten Gold
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Input gejala visual daun tanaman {meta.name} Anda untuk rekomendasi dosis NPK starter & cara larut efektif
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-500 font-medium">Lahan Aktif:</span>
          <span className="ml-1.5 text-xs font-bold font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
            {areaAre} Are ({areaHa} Ha)
          </span>
        </div>
      </div>

      {/* Tabs Pilihan Unsur Hara: N, P, K, Mg */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.keys(DEFICIENCY_SPECS) as (keyof LeafDeficiencyInput)[]).map((key) => {
          const spec = DEFICIENCY_SPECS[key];
          const severity = deficiencies[key];
          const isActive = activeNutrientTab === key;

          return (
            <button
              key={key}
              onClick={() => setActiveNutrientTab(key)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{spec.name}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    severity === 'normal'
                      ? 'bg-emerald-500'
                      : severity === 'ringan'
                      ? 'bg-yellow-500'
                      : severity === 'sedang'
                      ? 'bg-amber-500'
                      : 'bg-rose-500 animate-pulse'
                  }`}
                ></span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 capitalize">{severity}</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {calculation.details.find((d) => d.key === key)?.kgForArea} kg
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Input Gejala & Seleksi Keparahan untuk Unsur Terpilih */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200/70 pb-2.5">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                Diagnosis Unsur: {activeSpec.name}
              </span>
              <span className="text-[11px] text-slate-500">· {activeSpec.role}</span>
            </div>
            <p className="text-xs text-slate-700 font-medium mt-1">
              Gejala Khas pada {meta.name}:{' '}
              <span className="text-amber-800 font-semibold">
                "{activeSpec.symptoms[crop]}"
              </span>
            </p>
          </div>

          <div className="text-xs font-medium text-slate-600">
            Tingkat Gejala Saat Ini:{' '}
            <span className="font-bold text-slate-900 capitalize">
              {deficiencies[activeNutrientTab]}
            </span>
          </div>
        </div>

        {/* 4 Opsi Tingkat Keparahan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SEVERITY_OPTIONS.map((opt) => {
            const isSelected = deficiencies[activeNutrientTab] === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() =>
                  setDeficiencies((prev) => ({
                    ...prev,
                    [activeNutrientTab]: opt.id,
                  }))
                }
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">{opt.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Rekomendasi Senyawa Khusus */}
        <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5">
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">
                Rekomendasi Pupuk Tambahan untuk {meta.name}:
              </span>
              <p className="text-slate-700 font-medium mt-0.5">
                {activeSpec.recommendedCompound[crop]}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{activeSpec.applicationTip}</span>
          </div>
        </div>
      </div>

      {/* Rangkuman Rekomendasi Gabungan & Sinergi Paten Gold */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Kolom Kiri: Tabel Kebutuhan Dosis */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-3.5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-900">
              Total Rekomendasi Pupuk Tambahan (Luas {areaAre} Are)
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700">
              {calculation.totalSupplementKg} kg Total
            </span>
          </div>

          <div className="space-y-2">
            {calculation.details.map((d) => (
              <div
                key={d.key}
                className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">{d.spec.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded border ${
                      d.severity === 'normal'
                        ? 'bg-slate-100 text-slate-500 border-slate-200'
                        : d.severity === 'ringan'
                        ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                        : d.severity === 'sedang'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
                    }`}
                  >
                    {d.severity.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-500">{d.kgPerHa} kg/Ha</span>
                  <span className="font-bold text-slate-900 w-16 text-right">
                    {d.kgForArea} kg
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Estimasi Tambahan Biaya Pupuk:</span>
            <span className="font-bold text-slate-900 font-mono">
              Rp {calculation.estimatedCost.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Kolom Kanan: Panduan Campur dengan Paten Gold */}
        <div className="lg:col-span-5 bg-emerald-900 text-emerald-50 rounded-xl p-3.5 space-y-2.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold text-xs border-b border-emerald-800 pb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Protokol Campur dengan Paten Gold</span>
            </div>

            <p className="text-[11px] text-emerald-200/90 mt-2 leading-relaxed">
              Karena pupuk Paten Gold menggunakan <strong>Teknologi Nano Organik</strong>, Anda{' '}
              <strong>TIDAK PERLU</strong> menebar ratusan kilogram pupuk NPK ke tanah.
            </p>

            <div className="mt-2 p-2 bg-emerald-800/80 rounded-lg border border-emerald-700/80 text-[11px] space-y-1">
              <div className="flex items-center justify-between font-semibold text-emerald-100">
                <span>Dosis per Tangki Sprayer (16L):</span>
                <span className="text-amber-300 font-mono">
                  1 Sachet Paten + {calculation.spoonsPerTank > 0 ? `${calculation.spoonsPerTank} Sdm NPK` : 'Tanpa NPK'}
                </span>
              </div>
              <p className="text-[10px] text-emerald-300">
                Larutkan NPK terlebih dahulu di ember kecil hingga larut sempurna, lalu tuang 1 sachet Paten Gold.
              </p>
            </div>
          </div>

          <div className="p-2 bg-emerald-950/60 rounded text-[10px] text-emerald-300 leading-tight">
            *Efisiensi serapan stomata Paten Gold &gt;90%, sehingga dosis NPK kimia starter dapat dipangkas hingga 50–70% tanpa mengurangi vigor daun.
          </div>
        </div>
      </div>
    </div>
  );
};
