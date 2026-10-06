import React from 'react';
import { Sprout, FileText, Download, Settings, Copy, Check, Printer } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenMarkdownModal: () => void;
  onCopyMarkdown: () => void;
  onDownloadMarkdown: () => void;
  onDownloadPDF: () => void;
  isCopied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenMarkdownModal,
  onCopyMarkdown,
  onDownloadMarkdown,
  onDownloadPDF,
  isCopied,
}) => {
  return (
    <header className="border-b border-emerald-900/10 bg-emerald-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg tracking-tight text-white">
                  PATEN AGROSIM PRO
                </span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-mono">
                  Nano Organic Tech
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Simulasi Kebutuhan & Analisis Efisiensi Pupuk Paten (Jagung, Padi, Tembakau & Hortikultura)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={onDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors font-semibold shadow-sm ring-1 ring-emerald-400/40"
              title="Unduh laporan ringkasan dalam format PDF untuk dicetak ke lapangan"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Download PDF</span>
            </button>

            <button
              onClick={onCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-md border border-emerald-600/40 transition-colors font-medium shadow-sm"
              title="Salin laporan lengkap dalam format Markdown"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin MD</span>
                </>
              )}
            </button>

            <button
              onClick={onDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-md border border-emerald-600/40 transition-colors font-medium shadow-sm"
              title="Download file .md laporan komparasi"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>

            <button
              onClick={onOpenMarkdownModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-md border border-slate-700 transition-colors font-medium shadow-sm"
              title="Lihat teks Markdown terformat"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Format MD</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition-colors font-medium"
              title="Ubah parameter harga pupuk & panen"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Atur Harga</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
