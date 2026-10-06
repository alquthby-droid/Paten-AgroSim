import React from 'react';
import { StepRequirement } from '../types';
import { Calendar, Droplets, Bug, Sprout, Wind } from 'lucide-react';

interface ApplicationTimelineProps {
  steps: StepRequirement[];
}

export const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({ steps }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <h3 className="font-semibold text-sm text-slate-900">
            Jadwal Rinci Aplikasi & Kebutuhan Nutrisi per Tahap
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          Total {steps.length} Sesi Aplikasi
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-semibold text-[11px]">
            <tr>
              <th className="py-3 px-3.5">Waktu (HST)</th>
              <th className="py-3 px-3">Metode</th>
              <th className="py-3 px-3">Paten Gold</th>
              <th className="py-3 px-3">Kebutuhan Air</th>
              <th className="py-3 px-3">Insek (ml)</th>
              <th className="py-3 px-3">Kimia Starter</th>
              <th className="py-3 px-4">Instruksi & Detail Dosis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {steps.map((s, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-3.5 whitespace-nowrap font-medium text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {s.label}
                  </div>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                      s.method === 'kocor'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                    }`}
                  >
                    {s.method === 'kocor' ? (
                      <Droplets className="w-3 h-3 text-blue-600" />
                    ) : (
                      <Wind className="w-3 h-3 text-emerald-600" />
                    )}
                    {s.method.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-3 whitespace-nowrap font-semibold text-amber-700">
                  {s.patenSachets} Sachet
                </td>
                <td className="py-3 px-3 whitespace-nowrap text-slate-700">
                  <span className="font-medium">{s.waterLiters.toLocaleString('id-ID')} L</span>
                  <span className="text-[11px] text-slate-400 block">
                    ~{s.sprayTanks} tangki
                  </span>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  {s.insekMl > 0 ? (
                    <span className="text-rose-600 font-medium flex items-center gap-1">
                      <Bug className="w-3 h-3 text-rose-500" />
                      {s.insekMl} ml
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="py-3 px-3 whitespace-nowrap text-slate-700">
                  {s.chemicalCompanion !== '-' ? (
                    <div>
                      <span className="font-medium text-slate-800">
                        {s.chemicalAmountKg > 0 ? `${s.chemicalAmountKg} kg` : ''}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        {s.chemicalCompanion}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-slate-600 min-w-[240px]">
                  <p className="font-medium text-slate-800">{s.description}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 italic">{s.notes}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
