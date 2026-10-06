import React, { useState, useMemo } from 'react';
import { CropType, StepRequirement } from '../types';
import { CROP_METADATA } from '../data/cropProtocols';
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  AlertCircle,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Droplets,
  CalendarCheck2,
} from 'lucide-react';

interface AutomaticScheduleReminderProps {
  crop: CropType;
  steps: StepRequirement[];
  areaAre: number;
}

export const AutomaticScheduleReminder: React.FC<AutomaticScheduleReminderProps> = ({
  crop,
  steps,
  areaAre,
}) => {
  // Tanggal Tanam Petani (Default: Hari ini)
  const [plantingDateStr, setPlantingDateStr] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [notificationTime, setNotificationTime] = useState<string>('07:00');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const cropMeta = CROP_METADATA[crop];

  // Helper untuk menambah hari ke tanggal tanam
  const plantingDate = useMemo(() => {
    return new Date(`${plantingDateStr}T00:00:00`);
  }, [plantingDateStr]);

  // Kalkulasi tanggal riil untuk setiap tahapan aplikasi dan tanggal notifikasi H-1
  const scheduledSteps = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return steps.map((step, idx) => {
      // step.day adalah HST (Hari Setelah Tanam) atau hari sebelum tanam jika negatif
      const appDate = new Date(plantingDate);
      appDate.setDate(plantingDate.getDate() + step.day);

      // Tanggal Notifikasi H-1
      const reminderDateHMinus1 = new Date(appDate);
      reminderDateHMinus1.setDate(appDate.getDate() - 1);

      // Selisih hari dari hari ini ke tanggal aplikasi
      const diffTime = appDate.getTime() - now.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      // Status
      let status: 'past' | 'today' | 'h_minus_1' | 'upcoming' = 'upcoming';
      if (diffDays < 0) {
        status = 'past';
      } else if (diffDays === 0) {
        status = 'today';
      } else if (diffDays === 1) {
        status = 'h_minus_1';
      } else {
        status = 'upcoming';
      }

      return {
        ...step,
        stepIndex: idx + 1,
        appDate,
        reminderDateHMinus1,
        diffDays,
        status,
        appDateFormatted: appDate.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        reminderDateFormatted: reminderDateHMinus1.toLocaleDateString('id-ID', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
      };
    });
  }, [steps, plantingDate]);

  // Cari aplikasi terdekat berikutnya yang belum lewat
  const nextUpcoming = useMemo(() => {
    return scheduledSteps.find((s) => s.status !== 'past') || scheduledSteps[scheduledSteps.length - 1];
  }, [scheduledSteps]);

  // Helper untuk generate Google Calendar URL
  const generateGoogleCalendarUrl = (stepItem: typeof scheduledSteps[0]) => {
    const dateStr = stepItem.appDate.toISOString().replace(/[-:]/g, '').split('T')[0];
    const startTimeStr = `${dateStr}T${notificationTime.replace(':', '')}00`;
    // Durasi 2 jam
    const endHour = (parseInt(notificationTime.split(':')[0], 10) + 2).toString().padStart(2, '0');
    const endTimeStr = `${dateStr}T${endHour}${notificationTime.split(':')[1]}00`;

    const title = `[Paten Gold] ${stepItem.label} - ${cropMeta.name}`;
    const description = `PENGINGAT APLIKASI PUPUK PATEN GOLD (H-1 Siapkan Bahan)
Komoditas: ${cropMeta.name} (Luas: ${areaAre} Are)
Fase/HST: ${stepItem.label}
Metode: ${stepItem.method.toUpperCase()}

KEBUTUHAN NUTRISI:
• Paten Gold: ${stepItem.patenSachets} Sachet
• Air Bersih: ${stepItem.waterLiters.toLocaleString('id-ID')} Liter (~${stepItem.sprayTanks} tangki)
${stepItem.insekMl > 0 ? `• Insektisida: ${stepItem.insekMl} ml` : ''}
${stepItem.chemicalCompanion !== '-' ? `• Pupuk Kimia Starter: ${stepItem.chemicalAmountKg} kg ${stepItem.chemicalCompanion}` : ''}

PANDUAN APLIKASI:
${stepItem.description}
Catatan: ${stepItem.notes}

TIPS H-1: Periksa ketersediaan air bersih, sachet Paten Gold, dan cek ramalan cuaca pagi!`;

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startTimeStr}/${endTimeStr}&details=${encodeURIComponent(
      description
    )}&location=${encodeURIComponent('Lahan Pertanian')}`;

    return url;
  };

  // Helper untuk generate Outlook Calendar URL
  const generateOutlookCalendarUrl = (stepItem: typeof scheduledSteps[0]) => {
    const dateStr = stepItem.appDate.toISOString().split('T')[0];
    const startIso = `${dateStr}T${notificationTime}:00`;
    const endHour = (parseInt(notificationTime.split(':')[0], 10) + 2).toString().padStart(2, '0');
    const endIso = `${dateStr}T${endHour}:${notificationTime.split(':')[1]}:00`;

    const title = `[Paten Gold] ${stepItem.label} - ${cropMeta.name}`;
    const description = `PENGINGAT APLIKASI PUPUK PATEN GOLD (H-1 Notifikasi Otomatis)
Komoditas: ${cropMeta.name} (Luas: ${areaAre} Are)
Fase/HST: ${stepItem.label}
Metode: ${stepItem.method.toUpperCase()}
Kebutuhan: ${stepItem.patenSachets} Sachet Paten Gold, ${stepItem.waterLiters.toLocaleString('id-ID')} Liter Air
${stepItem.description}`;

    const url = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(
      title
    )}&startdt=${encodeURIComponent(startIso)}&enddt=${encodeURIComponent(
      endIso
    )}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(
      'Lahan Pertanian'
    )}`;

    return url;
  };

  // Helper untuk Download Semua Jadwal ke file .ics (iCalendar) dengan Alarm H-1
  const handleDownloadFullICS = () => {
    const nowIso = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Paten AgroSim//Jadwal Pemupukan Paten Gold//ID
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Jadwal Paten Gold - ${cropMeta.name}
X-WR-TIMEZONE:Asia/Jakarta
`;

    scheduledSteps.forEach((stepItem) => {
      const year = stepItem.appDate.getFullYear();
      const month = String(stepItem.appDate.getMonth() + 1).padStart(2, '0');
      const day = String(stepItem.appDate.getDate()).padStart(2, '0');
      const startDateTime = `${year}${month}${day}T070000`;
      const endDateTime = `${year}${month}${day}T090000`;
      const uid = `paten-${crop}-${stepItem.stepIndex}-${plantingDateStr}@patenagrosim.local`;

      const summaryText = `[Paten Gold] ${stepItem.label} - ${cropMeta.name}`;
      const descText = `Jadwal Aplikasi Paten Gold\\nKomoditas: ${cropMeta.name} (${areaAre} Are)\\nMetode: ${stepItem.method.toUpperCase()}\\nDosis: ${stepItem.patenSachets} Sachet Paten Gold dilarutkan ke ${stepItem.waterLiters}L air (~${stepItem.sprayTanks} tangki).\\n${stepItem.insekMl > 0 ? `Insektisida: ${stepItem.insekMl} ml\\n` : ''}${stepItem.description}\\nCatatan: ${stepItem.notes}`;

      icsContent += `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${nowIso}
DTSTART:${startDateTime}
DTEND:${endDateTime}
SUMMARY:${summaryText}
DESCRIPTION:${descText}
LOCATION:Lahan Pertanian
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:PENGINGAT H-1: Besok Jadwal Aplikasi Paten Gold (${stepItem.label})! Siapkan ${stepItem.patenSachets} Sachet Paten Gold & ${stepItem.waterLiters}L Air.
END:VALARM
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:1 JAM LAGI: Waktu optimal aplikasi Paten Gold (${stepItem.label}). Semprot/kocor sebelum terik matahari!
END:VALARM
END:VEVENT
`;
    });

    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Jadwal_PatenGold_${crop}_Tanam_${plantingDateStr}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-sm space-y-4">
      {/* Header Pengingat */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-700">
            <Bell className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-900">
                Pengingat Otomatis & Sinkronisasi Kalender
              </h3>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                Notifikasi H-1
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Sinkronkan seluruh jadwal aplikasi ke Google Calendar atau Outlook dengan alarm otomatis H-1 sebelum pemupukan
            </p>
          </div>
        </div>

        {/* Tombol Ekspor Kalender Lengkap */}
        <button
          onClick={handleDownloadFullICS}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          title="Download file .ics untuk Apple Calendar, Google Calendar Android/iPhone, atau Outlook"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Kalender (.ics) Lengkap</span>
        </button>
      </div>

      {/* Kontrol Input Tanggal Tanam & Waktu Notifikasi */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
        <div className="md:col-span-6 space-y-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tanggal Tanam / Awal Siklus:</span>
          </label>
          <input
            type="date"
            value={plantingDateStr}
            onChange={(e) => setPlantingDateStr(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <p className="text-[10px] text-slate-400">
            Jadwal H-5 (olah lahan) dan Hari Setelah Tanam (HST) dihitung presisi dari tanggal ini.
          </p>
        </div>

        <div className="md:col-span-3 space-y-1">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Jam Aplikasi Ideal:</span>
          </label>
          <input
            type="time"
            value={notificationTime}
            onChange={(e) => setNotificationTime(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <p className="text-[10px] text-slate-400">Rekomendasi: 06.30 - 08.30 WIB (Pagi)</p>
        </div>

        <div className="md:col-span-3 flex flex-col justify-end">
          <div className="p-2 bg-indigo-50/70 border border-indigo-200 rounded-lg text-[11px] text-indigo-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <span>
              Alarm otomatis diatur <strong>1 hari sebelum aplikasi (H-1)</strong> agar petani dapat menyiapkan bahan.
            </span>
          </div>
        </div>
      </div>

      {/* Banner Aplikasi Berikutnya / Peringatan H-1 */}
      {nextUpcoming && (
        <div
          className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            nextUpcoming.status === 'h_minus_1'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : nextUpcoming.status === 'today'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                nextUpcoming.status === 'h_minus_1'
                  ? 'bg-amber-100 text-amber-800'
                  : nextUpcoming.status === 'today'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-indigo-100 text-indigo-800'
              }`}
            >
              {nextUpcoming.status === 'h_minus_1' ? (
                <AlertCircle className="w-5 h-5 text-amber-600" />
              ) : nextUpcoming.status === 'today' ? (
                <CalendarCheck2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <Clock className="w-5 h-5 text-indigo-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-wide uppercase">
                  {nextUpcoming.status === 'h_minus_1'
                    ? '⚠️ Peringatan H-1 (Besok Waktunya Aplikasi!)'
                    : nextUpcoming.status === 'today'
                    ? '🟢 Hari Ini Jadwal Aplikasi!'
                    : 'Jadwal Aplikasi Terdekat Berikutnya:'}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    nextUpcoming.status === 'h_minus_1'
                      ? 'bg-amber-200 text-amber-900'
                      : nextUpcoming.status === 'today'
                      ? 'bg-emerald-200 text-emerald-900'
                      : 'bg-indigo-100 text-indigo-900 font-mono'
                  }`}
                >
                  {nextUpcoming.diffDays > 0
                    ? `${nextUpcoming.diffDays} Hari Lagi`
                    : nextUpcoming.diffDays === 0
                    ? 'HARI INI'
                    : 'Sudah Lewat'}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {nextUpcoming.label} — {nextUpcoming.appDateFormatted}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                Kebutuhan: <strong>{nextUpcoming.patenSachets} Sachet Paten Gold</strong> +{' '}
                <strong>{nextUpcoming.waterLiters}L Air</strong> (~{nextUpcoming.sprayTanks} tangki).
                {nextUpcoming.insekMl > 0 && ` Plus ${nextUpcoming.insekMl} ml insektisida.`}
              </p>
            </div>
          </div>

          {/* Quick Actions untuk Jadwal Berikutnya */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={generateGoogleCalendarUrl(nextUpcoming)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-xs transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Google Calendar</span>
            </a>
            <a
              href={generateOutlookCalendarUrl(nextUpcoming)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg text-xs font-medium shadow-xs transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Outlook</span>
            </a>
          </div>
        </div>
      )}

      {/* Tabel Daftar Seluruh Sesi Aplikasi & Tombol Sinkronisasi per Jadwal */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-2.5 px-3">Tahap / HST</th>
              <th className="py-2.5 px-3">Tanggal Aplikasi</th>
              <th className="py-2.5 px-3">Notifikasi H-1</th>
              <th className="py-2.5 px-3">Dosis & Air</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Sinkronisasi Kalender</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {scheduledSteps.map((stepItem) => {
              const isToday = stepItem.status === 'today';
              const isHMinus1 = stepItem.status === 'h_minus_1';
              const isPast = stepItem.status === 'past';

              return (
                <tr
                  key={stepItem.stepIndex}
                  className={`transition-colors ${
                    isHMinus1
                      ? 'bg-amber-50/80 font-medium'
                      : isToday
                      ? 'bg-emerald-50/80 font-medium'
                      : isPast
                      ? 'opacity-70 bg-slate-50/50'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isToday
                            ? 'bg-emerald-500 animate-pulse'
                            : isHMinus1
                            ? 'bg-amber-500 animate-bounce'
                            : isPast
                            ? 'bg-slate-300'
                            : 'bg-indigo-400'
                        }`}
                      ></span>
                      <span>{stepItem.label}</span>
                    </div>
                  </td>

                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="font-semibold text-slate-800">
                      {stepItem.appDateFormatted}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-500">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                      <Bell className="w-2.5 h-2.5 text-indigo-600" />
                      {stepItem.reminderDateFormatted}
                    </span>
                  </td>

                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="text-slate-800 font-medium">
                      <span className="text-amber-700 font-semibold font-mono">
                        {stepItem.patenSachets} Sachet
                      </span>{' '}
                      / {stepItem.waterLiters}L Air
                    </div>
                    {stepItem.insekMl > 0 && (
                      <span className="text-[10px] text-rose-600 block">
                        + {stepItem.insekMl} ml insek
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {isToday ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px] font-bold">
                        Hari Ini
                      </span>
                    ) : isHMinus1 ? (
                      <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded text-[11px] font-bold">
                        Besok (H-1)
                      </span>
                    ) : isPast ? (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[11px]">
                        Selesai
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[11px] font-mono">
                        {stepItem.diffDays} hari lagi
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 whitespace-nowrap text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <a
                        href={generateGoogleCalendarUrl(stepItem)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-[11px] transition-colors inline-flex items-center gap-1"
                        title="Tambah ke Google Calendar"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span>Google</span>
                      </a>

                      <a
                        href={generateOutlookCalendarUrl(stepItem)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 font-medium text-[11px] transition-colors inline-flex items-center gap-1"
                        title="Tambah ke Outlook Calendar"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span>Outlook</span>
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Catatan Panduan Pengingat */}
      <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5 leading-relaxed text-[11px]">
          <strong>Saran Petani Berpengalaman:</strong> Jangan menunda aplikasi lebih dari 2 hari dari jadwal fase pertumbuhan optimal. Partikel nano Paten Gold langsung diserap dalam 15–30 menit, sehingga pemupukan tepat waktu saat pembelahan sel tanaman (vegetatif awal & pembentukan buah/tongkol/daun tembakau) memberikan lonjakan hasil panen paling maksimal.
        </div>
      </div>
    </div>
  );
};
