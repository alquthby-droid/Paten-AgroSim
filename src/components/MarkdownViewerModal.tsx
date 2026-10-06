import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode } from 'lucide-react';

interface MarkdownViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdownContent: string;
  onCopy: () => void;
  onDownload: () => void;
  isCopied: boolean;
}

export const MarkdownViewerModal: React.FC<MarkdownViewerModalProps> = ({
  isOpen,
  onClose,
  markdownContent,
  onCopy,
  onDownload,
  isCopied,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <FileCode className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="font-semibold text-slate-900 text-base">
                Laporan Komparasi Format Markdown (.md)
              </h3>
              <p className="text-xs text-slate-500">
                Format Markdown standar, siap dicopy atau diunduh untuk dokumentasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Semua</span>
                </>
              )}
            </button>

            <button
              onClick={onDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs bg-slate-900 text-slate-100 leading-relaxed selection:bg-emerald-500 selection:text-white">
          <pre className="whitespace-pre-wrap font-mono">{markdownContent}</pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>
            {markdownContent.split('\n').length} baris Markdown · Termasuk tabel komparasi 10-100 Are & analisis ROI
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
