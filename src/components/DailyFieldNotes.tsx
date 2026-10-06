import React, { useState } from 'react';
import { CropType, FieldObservation, StepRequirement } from '../types';
import {
  NotebookPen,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Droplet,
  Ruler,
  Bug,
  Sparkles,
  Calendar,
  X,
  Clock,
} from 'lucide-react';

interface DailyFieldNotesProps {
  crop: CropType;
  steps: StepRequirement[];
  observations: FieldObservation[];
  onAddObservation: (obs: FieldObservation) => void;
  onDeleteObservation: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const DailyFieldNotes: React.FC<DailyFieldNotesProps> = ({
  crop,
  steps,
  observations,
  onAddObservation,
  onDeleteObservation,
  onToggleStatus,
}) => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedFilterDay, setSelectedFilterDay] = useState<number | 'all'>('all');

  // Form State
  const [day, setDay] = useState<number>(steps[0]?.day || 5);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [plantHeightCm, setPlantHeightCm] = useState<string>('');
  const [plantVigor, setPlantVigor] = useState<'sangat_sehat' | 'normal' | 'kurang_sehat'>('sangat_sehat');
  const [pestObservations, setPestObservations] = useState<string>('Tidak ditemukan serangan hama (bersih & sehat)');
  const [soilMoistureStatus, setSoilMoistureStatus] = useState<'lembab_optimal' | 'kering' | 'tergenang'>('lembab_optimal');
  const [applicationStatus, setApplicationStatus] = useState<'sudah_aplikasi' | 'belum_aplikasi'>('sudah_aplikasi');
  const [notes, setNotes] = useState<string>('');

  const currentCropObservations = observations.filter((o) => o.crop === crop);

  const filteredObservations =
    selectedFilterDay === 'all'
      ? currentCropObservations
      : currentCropObservations.filter((o) => o.day === selectedFilterDay);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newObs: FieldObservation = {
      id: `obs_${Date.now()}`,
      crop,
      day: Number(day),
      date,
      plantHeightCm: plantHeightCm ? Number(plantHeightCm) : undefined,
      plantVigor,
      pestObservations,
      soilMoistureStatus,
      applicationStatus,
      notes,
    };
    onAddObservation(newObs);
    setIsFormOpen(false);
    // Reset form fields
    setPlantHeightCm('');
    setNotes('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-700">
            <NotebookPen className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-900">
              Catatan Harian & Observasi Lapangan Petani
            </h3>
            <p className="text-xs text-slate-500">
              Pantau perkembangan tinggi tanaman, vigor daun, serangan hama, dan status aplikasi pupuk sesuai timeline
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Catatan Lapangan</span>
        </button>
      </div>

      {/* Filter by Application Day */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 text-[11px] mr-1">Filter Hari (HST):</span>
        <button
          onClick={() => setSelectedFilterDay('all')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
            selectedFilterDay === 'all'
              ? 'bg-slate-900 text-white font-semibold'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Semua Catatan ({currentCropObservations.length})
        </button>

        {steps.map((st) => {
          const count = currentCropObservations.filter((o) => o.day === st.day).length;
          return (
            <button
              key={st.day}
              onClick={() => setSelectedFilterDay(st.day)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                selectedFilterDay === st.day
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label} {count > 0 ? `(${count})` : ''}
            </button>
          );
        })}
      </div>

      {/* New Observation Form Drawer/Card */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 text-xs space-y-3.5 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-emerald-200/80 pb-2">
            <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Input Observasi Lapangan Baru
            </span>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Hari HST */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Jadwal Hari (HST)
              </label>
              <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-medium text-slate-900"
              >
                {steps.map((s) => (
                  <option key={s.day} value={s.day}>
                    {s.label} ({s.method.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Tanggal Lapangan */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Tanggal Observasi
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-900 font-mono"
              />
            </div>

            {/* Tinggi Tanaman */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Tinggi Tanaman (cm)
              </label>
              <input
                type="number"
                placeholder="Contoh: 45"
                value={plantHeightCm}
                onChange={(e) => setPlantHeightCm(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-900 font-mono"
              />
            </div>

            {/* Vigor Tanaman */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Vigor Tanaman
              </label>
              <select
                value={plantVigor}
                onChange={(e) => setPlantVigor(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-medium text-slate-900"
              >
                <option value="sangat_sehat">Sangat Sehat & Subur</option>
                <option value="normal">Normal / Standar</option>
                <option value="kurang_sehat">Ada Gejala Cekaman</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Observasi Hama */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Observasi Hama / Penyakit
              </label>
              <input
                type="text"
                placeholder="Contoh: Daun bersih / Sedikit ulat grayak"
                value={pestObservations}
                onChange={(e) => setPestObservations(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-900"
              />
            </div>

            {/* Kelembapan Tanah */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Kondisi Kelembapan Tanah
              </label>
              <select
                value={soilMoistureStatus}
                onChange={(e) => setSoilMoistureStatus(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-medium text-slate-900"
              >
                <option value="lembab_optimal">Lembap Optimal (Kapasitas Lapang)</option>
                <option value="kering">Kering / Butuh Air</option>
                <option value="tergenang">Tergenang Air</option>
              </select>
            </div>

            {/* Status Aplikasi Pupuk */}
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Status Aplikasi Pupuk
              </label>
              <select
                value={applicationStatus}
                onChange={(e) => setApplicationStatus(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-semibold text-emerald-800"
              >
                <option value="sudah_aplikasi">SUDAH Diaplikasikan</option>
                <option value="belum_aplikasi">BELUM Diaplikasikan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Catatan Tambahan & Tindakan Khusus Petani
            </label>
            <input
              type="text"
              placeholder="Contoh: Semprot pagi pkl 06.30, ditambah perekat 10ml, cuaca cerah berawan"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-emerald-200">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-semibold shadow-xs"
            >
              Simpan Observasi
            </button>
          </div>
        </form>
      )}

      {/* Observation Cards List */}
      <div className="space-y-2.5">
        {filteredObservations.length === 0 ? (
          <div className="p-6 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-xs space-y-1">
            <NotebookPen className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-medium text-slate-600">Belum ada catatan observasi untuk filter ini</p>
            <p className="text-[11px] text-slate-400">
              Klik tombol &quot;Tambah Catatan Lapangan&quot; untuk mulai mencatat kondisi tinggi tanaman & hama
            </p>
          </div>
        ) : (
          filteredObservations.map((obs) => {
            const stepDetail = steps.find((s) => s.day === obs.day);

            return (
              <div
                key={obs.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-2 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-mono text-sm bg-slate-200/80 px-2 py-0.5 rounded">
                      Hari ke-{obs.day} HST
                    </span>
                    {obs.date && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {obs.date}
                      </span>
                    )}
                    {stepDetail && (
                      <span className="text-[11px] text-slate-500">
                        ({stepDetail.method.toUpperCase()} · {stepDetail.patenSachets} Sct)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(obs.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                        obs.applicationStatus === 'sudah_aplikasi'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                      title="Klik untuk ubah status aplikasi"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {obs.applicationStatus === 'sudah_aplikasi'
                          ? 'SUDAH DIAPLIKASIKAN'
                          : 'BELUM DIAPLIKASIKAN'}
                      </span>
                    </button>

                    <button
                      onClick={() => onDeleteObservation(obs.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus catatan ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700 text-[11px]">
                  {/* Tinggi & Vigor */}
                  <div className="flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>
                      Tinggi: <strong>{obs.plantHeightCm ? `${obs.plantHeightCm} cm` : '-'}</strong>
                    </span>
                    <span className="text-slate-300">·</span>
                    <span
                      className={`font-semibold ${
                        obs.plantVigor === 'sangat_sehat'
                          ? 'text-emerald-700'
                          : obs.plantVigor === 'normal'
                          ? 'text-slate-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {obs.plantVigor === 'sangat_sehat'
                        ? 'Sangat Sehat'
                        : obs.plantVigor === 'normal'
                        ? 'Normal'
                        : 'Kurang Sehat'}
                    </span>
                  </div>

                  {/* Serangan Hama */}
                  <div className="flex items-center gap-1.5">
                    <Bug className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="truncate">
                      Hama: <strong>{obs.pestObservations}</strong>
                    </span>
                  </div>

                  {/* Kelembapan Tanah */}
                  <div className="flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>
                      Tanah:{' '}
                      <strong>
                        {obs.soilMoistureStatus === 'lembab_optimal'
                          ? 'Lembap Optimal'
                          : obs.soilMoistureStatus === 'kering'
                          ? 'Kering'
                          : 'Tergenang'}
                      </strong>
                    </span>
                  </div>
                </div>

                {obs.notes && (
                  <div className="bg-white p-2 rounded border border-slate-100 text-[11px] text-slate-600 italic">
                    &quot;{obs.notes}&quot;
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
