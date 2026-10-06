import React, { useState } from 'react';
import { CropType, StepRequirement } from '../types';
import { CROP_METADATA } from '../data/cropProtocols';
import {
  Sprout,
  Sun,
  Wheat,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface CropGrowthTimelineProps {
  crop: CropType;
  steps: StepRequirement[];
}

interface CropPhase {
  name: string;
  startDay: number;
  endDay: number;
  color: string;
  accentBg: string;
  badgeBg: string;
  badgeText: string;
  description: string;
  targetOrgans: string;
}

export const CropGrowthTimeline: React.FC<CropGrowthTimelineProps> = ({
  crop,
  steps,
}) => {
  const meta = CROP_METADATA[crop];
  const totalDays = meta.typicalCycleDays;

  // Tentukan fase pertumbuhan spesifik komoditas
  const getPhases = (): CropPhase[] => {
    switch (crop) {
      case 'jagung':
        return [
          {
            name: 'Fase Vegetatif Awal & Aktif',
            startDay: 0,
            endDay: 35,
            color: 'bg-emerald-500',
            accentBg: 'border-emerald-500/40 bg-emerald-50/60',
            badgeBg: 'bg-emerald-100',
            badgeText: 'text-emerald-800',
            description:
              'Pertumbuhan akar serabut, perkecambahan, pencegahan virus bule, dan pembentukan 10–12 helai daun.',
            targetOrgans: 'Pucuk daun muda, stomata, dan zona rambut perakaran',
          },
          {
            name: 'Fase Generatif (Bunga & Tongkol)',
            startDay: 36,
            endDay: 75,
            color: 'bg-amber-500',
            accentBg: 'border-amber-500/40 bg-amber-50/60',
            badgeBg: 'bg-amber-100',
            badgeText: 'text-amber-800',
            description:
              'Inisiasi bunga jantan (tassel), silking bunga betina, serta pembentukan dan pengisian biji tongkol jagung.',
            targetOrgans: 'Pangkal batang tongkol, helai daun bendera fotosintesis',
          },
          {
            name: 'Fase Pematangan Biji & Panen',
            startDay: 76,
            endDay: totalDays,
            color: 'bg-indigo-500',
            accentBg: 'border-indigo-500/40 bg-indigo-50/60',
            badgeBg: 'bg-indigo-100',
            badgeText: 'text-indigo-800',
            description:
              'Pengerasan biji jagung (black layer), penurunan kadar air, kelobot mengering kecoklatan siap panen.',
            targetOrgans: 'Biji pipil padat bernas dan rendemen maksimal',
          },
        ];
      case 'padi':
        return [
          {
            name: 'Fase Vegetatif (Anakan Aktif)',
            startDay: 0,
            endDay: 35,
            color: 'bg-emerald-500',
            accentBg: 'border-emerald-500/40 bg-emerald-50/60',
            badgeBg: 'bg-emerald-100',
            badgeText: 'text-emerald-800',
            description:
              'Pemulihan akar pindah tanam, pembentukan anakan primer dan sekunder hingga 25–35 batang per rumpun.',
            targetOrgans: 'Pangkal anakan rumpun dan helai daun muda',
          },
          {
            name: 'Fase Generatif (Bunting & Malai)',
            startDay: 36,
            endDay: 80,
            color: 'bg-amber-500',
            accentBg: 'border-amber-500/40 bg-amber-50/60',
            badgeBg: 'bg-amber-100',
            badgeText: 'text-amber-800',
            description:
              'Inisiasi primordia malai, bunting (booting), keluarnya malai (heading), dan penyerbukan bunga padi.',
            targetOrgans: 'Daun bendera, tangkai malai, dan bulir padi awal',
          },
          {
            name: 'Fase Pematangan Bulir & Panen',
            startDay: 81,
            endDay: totalDays,
            color: 'bg-indigo-500',
            accentBg: 'border-indigo-500/40 bg-indigo-50/60',
            badgeBg: 'bg-indigo-100',
            badgeText: 'text-indigo-800',
            description:
              'Fase masak susu, masak kuning, dan masak penuh. 90% bulir menguning bernas hingga pangkal tangkai.',
            targetOrgans: 'Gabah bernas padat dan pengurangan bulir hampa',
          },
        ];
      case 'tembakau':
        return [
          {
            name: 'Fase Vegetatif Awal (Adaptasi)',
            startDay: 0,
            endDay: 25,
            color: 'bg-emerald-500',
            accentBg: 'border-emerald-500/40 bg-emerald-50/60',
            badgeBg: 'bg-emerald-100',
            badgeText: 'text-emerald-800',
            description:
              'Adaptasi bibit pasca tanam di guludan, penguatan akar tunggang, dan pembentukan 6–8 helai daun bawah.',
            targetOrgans: 'Pangkal batang dan rizosfer perakaran (Kocor ZA)',
          },
          {
            name: 'Fase Pertumbuhan Cepat (Grand Period)',
            startDay: 26,
            endDay: 50,
            color: 'bg-amber-500',
            accentBg: 'border-amber-500/40 bg-amber-50/60',
            badgeBg: 'bg-amber-100',
            badgeText: 'text-amber-800',
            description:
              'Perluasan helaian lamina daun (daun tengah dan atas), penebalan jaringan mesofil, dan pemupukan NPK kocor.',
            targetOrgans: 'Lamina helaian daun tembakau dan stomata',
          },
          {
            name: 'Fase Pematangan Daun & Panen Berkala',
            startDay: 51,
            endDay: totalDays,
            color: 'bg-indigo-500',
            accentBg: 'border-indigo-500/40 bg-indigo-50/60',
            badgeBg: 'bg-indigo-100',
            badgeText: 'text-indigo-800',
            description:
              'Pematangan bertahap dari daun kaki, daun tengah, hingga pucuk. Akumulasi getah aroma dan panen petik bertahap.',
            targetOrgans: 'Daun krosok berbobot dan elastisitas tinggi',
          },
        ];
      case 'hortikultura':
        return [
          {
            name: 'Fase Pra-Tanam & Vegetatif Awal',
            startDay: 0,
            endDay: 25,
            color: 'bg-emerald-500',
            accentBg: 'border-emerald-500/40 bg-emerald-50/60',
            badgeBg: 'bg-emerald-100',
            badgeText: 'text-emerald-800',
            description:
              'Sterilisasi lahan H-2 dengan Paten Imun, kocor H-7 Paten Hijau + Imun, pembentukan percabangan Y dan daun rimbun.',
            targetOrgans: 'Rizosfer perakaran, batang utama, dan tunas produktif',
          },
          {
            name: 'Fase Pembungaan & Pembesaran Buah',
            startDay: 26,
            endDay: 60,
            color: 'bg-amber-500',
            accentBg: 'border-amber-500/40 bg-amber-50/60',
            badgeBg: 'bg-amber-100',
            badgeText: 'text-amber-800',
            description:
              'Bunga mekar serentak, pembentukan bakal buah cabe/tomat/melon, kocor berkala H-25 & H-45 serta semprot 7 harian.',
            targetOrgans: 'Bunga tidak rontok, kutikula kulit buah mengkilap',
          },
          {
            name: 'Fase Panen Petik Berkala',
            startDay: 61,
            endDay: totalDays,
            color: 'bg-indigo-500',
            accentBg: 'border-indigo-500/40 bg-indigo-50/60',
            badgeBg: 'bg-indigo-100',
            badgeText: 'text-indigo-800',
            description:
              'Panen petik bertahap setiap 5–7 hari sekali. Kocor H-65 memperpanjang masa petik hingga 20–30 kali petik.',
            targetOrgans: 'Bobot buah padat, warna merah menyala, daya simpan lama',
          },
        ];
    }
  };

  const phases = getPhases();

  // State untuk titik aplikasi terpilih
  const [selectedDay, setSelectedDay] = useState<number>(steps[0]?.day || 5);

  const activeStep = steps.find((s) => s.day === selectedDay) || steps[0];

  // Cari fase yang memuat hari terpilih
  const currentPhase =
    phases.find(
      (p) => activeStep.day >= p.startDay && activeStep.day <= p.endDay
    ) || phases[0];

  const progressPercent = Math.min(
    100,
    Math.round((activeStep.day / totalDays) * 100)
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-sm space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
            <Sprout className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">
              Timeline Dinamis Fase Pertumbuhan & Titik Aplikasi Paten Gold
            </h3>
            <p className="text-xs text-slate-500">
              Siklus penuh tanaman: {totalDays} Hari Setelah Tanam (HST) · Klik pada titik aplikasi untuk melihat sasaran nutrisi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/70">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-600">Posisi Hari:</span>
          <strong className="text-emerald-800 font-semibold">
            {activeStep.label} ({progressPercent}% siklus)
          </strong>
        </div>
      </div>

      {/* Dynamic Segmented Progress Bar */}
      <div className="space-y-2 pt-2">
        {/* Phase Labels on top of progress bar */}
        <div className="grid grid-cols-3 gap-2 text-[11px] font-semibold text-slate-700">
          {phases.map((p, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg border text-center transition-all ${
                currentPhase.name === p.name
                  ? `${p.accentBg} ring-1 ring-emerald-500/40 font-bold`
                  : 'bg-slate-50 border-slate-200/80 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <span className={`w-2 h-2 rounded-full ${p.color}`}></span>
                <span className="truncate">{p.name}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                H-{p.startDay} s/d H-{p.endDay} HST
              </span>
            </div>
          ))}
        </div>

        {/* Visual Progress Bar with Interactive Application Node Markers */}
        <div className="relative pt-4 pb-2">
          {/* Background Track with 3 Colored Phases */}
          <div className="h-3.5 w-full bg-slate-200 rounded-full flex overflow-hidden shadow-inner">
            <div
              style={{
                width: `${(phases[0].endDay / totalDays) * 100}%`,
              }}
              className="bg-emerald-500 opacity-90 relative"
              title={phases[0].name}
            ></div>
            <div
              style={{
                width: `${
                  ((phases[1].endDay - phases[1].startDay) / totalDays) * 100
                }%`,
              }}
              className="bg-amber-500 opacity-90 relative"
              title={phases[1].name}
            ></div>
            <div
              style={{
                width: `${
                  ((phases[2].endDay - phases[2].startDay) / totalDays) * 100
                }%`,
              }}
              className="bg-indigo-500 opacity-90 relative"
              title={phases[2].name}
            ></div>
          </div>

          {/* Interactive Step Node Markers */}
          <div className="absolute top-2.5 left-0 right-0 h-5 pointer-events-none">
            {steps.map((st, i) => {
              const leftPercent = Math.min(
                98,
                Math.max(2, (st.day / totalDays) * 100)
              );
              const isSelected = st.day === selectedDay;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedDay(st.day)}
                  style={{ left: `${leftPercent}%` }}
                  className={`pointer-events-auto absolute -translate-x-1/2 -top-1 w-5 h-5 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                    isSelected
                      ? 'bg-slate-900 border-white ring-2 ring-emerald-500 scale-125 z-20 shadow-md'
                      : 'bg-white border-slate-700 hover:scale-110 z-10'
                  }`}
                  title={`${st.label}: ${st.description}`}
                >
                  <span
                    className={`text-[9px] font-bold ${
                      isSelected ? 'text-white' : 'text-slate-800'
                    }`}
                  >
                    {st.day}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Click Badges for Application Steps */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 text-[11px] mr-1">Titik Aplikasi:</span>
          {steps.map((st, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDay(st.day)}
              className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
                selectedDay === st.day
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st.label} ({st.method})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Application Point Detail Card */}
      <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${currentPhase.badgeBg} ${currentPhase.badgeText}`}
            >
              {currentPhase.name}
            </span>
            <h4 className="font-semibold text-slate-900 text-sm">
              {activeStep.label} · Metode {activeStep.method.toUpperCase()}
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Dosis: <strong>{activeStep.patenSachets} Sachet Paten Gold</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Fisiologi Fase Tanaman:
            </span>
            <p className="mt-0.5 text-slate-800 leading-relaxed">
              {currentPhase.description}
            </p>
            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                <strong>Organ Sasaran:</strong> {currentPhase.targetOrgans}
              </span>
            </div>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Formulasi Brosur & Instruksi:
            </span>
            <p className="font-medium text-slate-900">{activeStep.description}</p>
            <p className="text-[11px] text-slate-500 italic">{activeStep.notes}</p>
            <div className="pt-1 text-[11px] text-slate-600 flex justify-between">
              <span>Volume Air: <strong>{activeStep.waterLiters} Liter</strong></span>
              {activeStep.insekMl > 0 && (
                <span className="text-rose-600">Insek: <strong>{activeStep.insekMl} ml</strong></span>
              )}
              {activeStep.chemicalCompanion !== '-' && (
                <span>Kimia: <strong>{activeStep.chemicalCompanion}</strong></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
