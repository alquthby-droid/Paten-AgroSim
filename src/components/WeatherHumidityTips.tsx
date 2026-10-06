import React, { useState } from 'react';
import { CropType } from '../types';
import {
  CloudLightning,
  SunMedium,
  Wind,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Droplets,
  RotateCw,
  Sparkles,
} from 'lucide-react';

interface WeatherHumidityTipsProps {
  crop: CropType;
}

export const WeatherHumidityTips: React.FC<WeatherHumidityTipsProps> = ({ crop }) => {
  const [activeScenario, setActiveScenario] = useState<'hujan_lebat' | 'kemarau_ekstrem' | 'angin_lembab'>('hujan_lebat');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-700">
            <CloudLightning className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">
              Tips Cuaca & Kelembapan (Kondisi Ekstrem)
            </h3>
            <p className="text-xs text-slate-500">
              Protokol tindakan darurat saat terjadi hujan lebat mendadak atau kekeringan berkepanjangan
            </p>
          </div>
        </div>

        {/* Tab Buttons for Scenarios */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveScenario('hujan_lebat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeScenario === 'hujan_lebat'
                ? 'bg-white text-sky-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CloudLightning className="w-3.5 h-3.5 text-sky-600" />
            <span>Hujan Pasca Aplikasi</span>
          </button>

          <button
            onClick={() => setActiveScenario('kemarau_ekstrem')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeScenario === 'kemarau_ekstrem'
                ? 'bg-white text-amber-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SunMedium className="w-3.5 h-3.5 text-amber-600" />
            <span>Kekeringan / Cekaman Air</span>
          </button>

          <button
            onClick={() => setActiveScenario('angin_lembab')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              activeScenario === 'angin_lembab'
                ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-emerald-600" />
            <span>Angin & Kelembapan Tinggi</span>
          </button>
        </div>
      </div>

      {/* Skenario 1: Hujan Lebat Segera Setelah Aplikasi */}
      {activeScenario === 'hujan_lebat' && (
        <div className="space-y-3.5 text-xs text-slate-700 animate-in fade-in duration-200">
          <div className="p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-lg">
            <h4 className="font-semibold text-sky-950 mb-1 flex items-center gap-1.5">
              <RotateCw className="w-4 h-4 text-sky-600" />
              Kaidah Re-Aplikasi (Semprot Ulang) Jika Turun Hujan:
            </h4>
            <p className="text-[11px] text-sky-900/90 leading-relaxed">
              Karena Paten Gold diproduksi dengan <strong>Teknologi Nano Organik</strong>, ukuran partikelnya
              sangat halus (&lt; 100 nm). Berbeda dengan pupuk kimia konvensional yang butuh 3–5 jam,
              Paten Gold terserap ke dalam stomata daun hanya dalam <strong>15 hingga 20 menit</strong> saat stomata membuka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/50 space-y-1.5">
              <span className="font-semibold text-rose-700 text-xs block">
                Jika Hujan Turun &lt; 30 Menit Pasca Semprot:
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Kemungkinan terjadi pencucian larutan foliar pada daun sebesar 40–50%.
              </p>
              <div className="mt-2 text-slate-800 bg-white p-2 rounded border border-slate-200 text-[11px]">
                <strong>Solusi Petani:</strong> Tunggu hujan reda dan daun kering. Lakukan semprot ulang
                sulaman dengan <strong>dosis 50% Paten Gold</strong> (cukup 1 sachet per 2 tangki) dan wajib
                ditambahkan <em>perekat/sticker</em> (5–10 ml/tangki) agar hemat biaya.
              </div>
            </div>

            <div className="p-3.5 border border-slate-200 rounded-lg bg-slate-50/50 space-y-1.5">
              <span className="font-semibold text-emerald-700 text-xs block">
                Jika Hujan Turun &gt; 45–60 Menit Pasca Semprot:
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Partikel nano Paten Gold sudah <strong>85%–95% diserap sempurna</strong> ke jaringan sel tanaman.
              </p>
              <div className="mt-2 text-slate-800 bg-white p-2 rounded border border-slate-200 text-[11px]">
                <strong>Solusi Petani:</strong> <strong>TIDAK PERLU SEMPROT ULANG!</strong> Nutrisi sudah aman
                di dalam tanaman. Semprot ulang hanya akan membuang biaya operasional dan sachet pupuk.
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Tindakan Darurat untuk Pemupukan Kocor (Akar):</strong> Jika terjadi hujan lebat/banjir
              sesaat setelah kocor pada bedengan jagung/tembakau, jangan tabur pupuk kimia tambahan! Segera buka
              sodetan pembuangan agar air mengalir dalam &lt; 4 jam. Tanah lembap setelah surut justru memudahkan
              rambut akar menyerap nutrisi Paten Gold yang tersisa di rizosfer.
            </div>
          </div>
        </div>
      )}

      {/* Skenario 2: Kekeringan Ekstrem / Cekaman Air (Kemarau Panjang) */}
      {activeScenario === 'kemarau_ekstrem' && (
        <div className="space-y-3.5 text-xs text-slate-700 animate-in fade-in duration-200">
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-lg">
            <h4 className="font-semibold text-amber-950 mb-1 flex items-center gap-1.5">
              <SunMedium className="w-4 h-4 text-amber-700" />
              SOP Memaksimalkan Penyerapan Saat Cuaca Panas Terik & Tanah Kering:
            </h4>
            <p className="text-[11px] text-amber-900/90 leading-relaxed">
              Pada suhu udara di atas 32°C, tanaman mengalami cekaman air (*water stress*) dan secara otomatis menutup
              lubang stomata untuk menahan penguapan air. Pupuk yang disemprot saat siang terik tidak akan terserap dan
              berisiko membakar jaringan daun (*scorch*).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-1">
              <span className="font-semibold text-slate-900 block text-xs">
                1. Geser ke Pagi Buta / Sore
              </span>
              <p className="text-slate-600">
                Lakukan penyemprotan pada <strong>pukul 05.30 – 07.30 WIB</strong> saat embun pagi masih tersisa dan
                suhu masih &lt; 26°C, atau di sore hari pukul <strong>16.30 – 17.45 WIB</strong> menjelang matahari terbenam.
              </p>
            </div>

            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-1">
              <span className="font-semibold text-slate-900 block text-xs">
                2. Hidrasi Tanah Sebelum Kocor
              </span>
              <p className="text-slate-600">
                Kocor nutrisi jangan dilakukan di atas tanah yang kering kerontang dan pecah-pecah. Alirkan air irigasi tipis
                atau siram tanah terlebih dahulu, kemudian kocorkan larutan Paten Gold di lubang piringan.
              </p>
            </div>

            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-1">
              <span className="font-semibold text-slate-900 block text-xs">
                3. Manfaatkan Asam Amino Paten
              </span>
              <p className="text-slate-600">
                Paten Gold kaya kandungan asam amino organik aktif yang berfungsi sebagai <em>anti-stress osmoregulator</em>,
                membantu menjaga turgor sel tanaman agar tidak layu permanen saat kemarau panjang.
              </p>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong>Tips Tambahan Mulsa Organik:</strong> Tutupi permukaan tanah piringan jagung atau tembakau dengan
              cacahan jerami/daun kering setebal 3–5 cm. Mulsa ini mempertahankan kelembapan larutan kocor Paten Gold
              hingga 3 kali lebih lama daripada tanah gundul yang langsung terpapar matahari.
            </div>
          </div>
        </div>
      )}

      {/* Skenario 3: Angin Kencang & Kelembapan Udara Sangat Tinggi */}
      {activeScenario === 'angin_lembab' && (
        <div className="space-y-3.5 text-xs text-slate-700 animate-in fade-in duration-200">
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg">
            <h4 className="font-semibold text-emerald-950 mb-1 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-emerald-700" />
              SOP Penanganan Angin Kencang & Kelembapan Tinggi (Mendung Rapat):
            </h4>
            <p className="text-[11px] text-emerald-900/90 leading-relaxed">
              Angin kencang menyebabkan larutan semprot melayang (*drift*) tidak mengenai sasaran tanaman. Sedangkan
              cuaca mendung lembap terus-menerus memicu perkembangan spora jamur bulai dan blast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-1.5">
              <span className="font-semibold text-slate-900 text-xs block">
                Pengaturan Nozzle / Spuyer Semprot:
              </span>
              <p className="text-slate-600">
                Jika angin kencang (&gt; 15 km/jam), <strong>hindari nozzle kabut ekstra halus</strong>.
                Gunakan nozzle tipe kipas (*flat fan*) atau spuyer sedang dengan tekanan pompa 2–3 bar, arahkan ujung
                nozzle lebih dekat ke tajuk daun (jarak 25–30 cm).
              </p>
            </div>

            <div className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-1.5">
              <span className="font-semibold text-slate-900 text-xs block">
                Saat Mendung Berkepanjangan (Spora Jamur):
              </span>
              <p className="text-slate-600">
                Kurangi pupuk Urea kimia hingga 75%. Dosis Urea tinggi saat mendung membuat dinding sel tanaman berair
                dan empuk sehingga sangat mudah ditembus miselium jamur. Paten Gold mempertebal lapisan kutikula tanaman.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
