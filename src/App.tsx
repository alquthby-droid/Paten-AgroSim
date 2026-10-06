import React, { useState, useMemo, useEffect, useId } from 'react';
import {
  CropType,
  CalculationMode,
  CostParameters,
  SeasonType,
  UserYieldTarget,
  FieldObservation,
} from './types';
import { DEFAULT_COST_PARAMETERS, CROP_METADATA } from './data/cropProtocols';
import { calculateSimulation, generateAreaMatrix } from './utils/calculator';
import { generateFullMarkdownReport } from './utils/markdownGenerator';
import { generateApplicationGuidePDF } from './utils/pdfGenerator';

import { Header } from './components/Header';
import { CommoditySelector } from './components/CommoditySelector';
import { AreaAndModeControl } from './components/AreaAndModeControl';
import { SummaryCards } from './components/SummaryCards';
import { CropGrowthTimeline } from './components/CropGrowthTimeline';
import { PhaseSachetDistributionChart } from './components/PhaseSachetDistributionChart';
import { SoilPhCalculator } from './components/SoilPhCalculator';
import { LeafDeficiencyNpkCalculator } from './components/LeafDeficiencyNpkCalculator';
import { GoogleMapsLandTracker } from './components/GoogleMapsLandTracker';
import { GpsRainfallSprayAdvisor } from './components/GpsRainfallSprayAdvisor';
import { AutomaticScheduleReminder } from './components/AutomaticScheduleReminder';
import { DailyFieldNotes } from './components/DailyFieldNotes';
import { SeasonalApplicationGuide } from './components/SeasonalApplicationGuide';
import { WeatherHumidityTips } from './components/WeatherHumidityTips';
import { OfficialBrosurReference } from './components/OfficialBrosurReference';
import { ApplicationTimeline } from './components/ApplicationTimeline';
import { HarvestProfitCalculator } from './components/HarvestProfitCalculator';
import { CostComparisonTable } from './components/CostComparisonTable';
import { AreaMatrixTable } from './components/AreaMatrixTable';
import { SustainabilitySection } from './components/SustainabilitySection';
import { MarkdownViewerModal } from './components/MarkdownViewerModal';
import { CostSettingsModal } from './components/CostSettingsModal';

import {
  FileText,
  Table,
  Calendar,
  Layers,
  Leaf,
  Sparkles,
  CheckCircle2,
  BookmarkCheck,
  ChevronRight,
  TrendingUp,
  MapPin,
} from 'lucide-react';

const INITIAL_OBSERVATIONS: FieldObservation[] = [
  {
    id: 'obs_init_1',
    crop: 'jagung',
    day: 5,
    date: '2026-10-01',
    plantHeightCm: 12,
    plantVigor: 'sangat_sehat',
    pestObservations: 'Bebas virus bule, benih tumbuh seragam',
    soilMoistureStatus: 'lembab_optimal',
    applicationStatus: 'sudah_aplikasi',
    notes: 'Semprot halus Paten Gold pencegah bule pukul 07.00 WIB pagi.',
  },
  {
    id: 'obs_init_2',
    crop: 'jagung',
    day: 12,
    date: '2026-10-08',
    plantHeightCm: 35,
    plantVigor: 'sangat_sehat',
    pestObservations: 'Daun hijau pekat, tidak ada ulat grayak',
    soilMoistureStatus: 'lembab_optimal',
    applicationStatus: 'sudah_aplikasi',
    notes: 'Kocor 50ml/pohon Paten Gold + Urea starter. Batang kokoh.',
  },
  {
    id: 'obs_init_3',
    crop: 'padi',
    day: 5,
    date: '2026-10-01',
    plantHeightCm: 18,
    plantVigor: 'sangat_sehat',
    pestObservations: 'Akar cepat aktif pasca pindah tanam',
    soilMoistureStatus: 'lembab_optimal',
    applicationStatus: 'sudah_aplikasi',
    notes: 'Semprot kasar Paten Gold. Anakan mulai terbentuk.',
  },
  {
    id: 'obs_init_4',
    crop: 'tembakau',
    day: 14,
    date: '2026-10-05',
    plantHeightCm: 28,
    plantVigor: 'sangat_sehat',
    pestObservations: 'Bebas kutu kebul & thrips',
    soilMoistureStatus: 'lembab_optimal',
    applicationStatus: 'sudah_aplikasi',
    notes: 'Kocor 100ml/pohon Paten + ZA piringan akar.',
  },
  {
    id: 'obs_init_5',
    crop: 'hortikultura',
    day: 7,
    date: '2026-10-04',
    plantHeightCm: 22,
    plantVigor: 'sangat_sehat',
    pestObservations: 'Percabangan mulai aktif, bebas kutu',
    soilMoistureStatus: 'lembab_optimal',
    applicationStatus: 'sudah_aplikasi',
    notes: 'Kocor Paten Hijau + Paten Imun 50ml/pohon.',
  },
];

export default function App() {
  const [selectedCrop, setSelectedCrop] = useState<CropType>('jagung');
  const [mode, setMode] = useState<CalculationMode>('irit');
  const [season, setSeason] = useState<SeasonType>('kemarau');
  const [areaAre, setAreaAre] = useState<number>(50); // Default 50 Are = 0.5 Hektar (Sesuai Prompt User)
  const [costParams, setCostParams] = useState<CostParameters>(DEFAULT_COST_PARAMETERS);
  const [userTargets, setUserTargets] = useState<UserYieldTarget>({});

  // Observasi Lapangan Petani (Tersimpan di localStorage)
  const [observations, setObservations] = useState<FieldObservation[]>(() => {
    try {
      const saved = localStorage.getItem('paten_agro_field_observations');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_OBSERVATIONS;
  });

  // Koordinat Lokasi Lahan untuk Analisis Cuaca & Peta GPS
  const [farmCoordinates, setFarmCoordinates] = useState<{
    lat: number;
    lng: number;
    label?: string;
  }>({
    lat: -7.0862,
    lng: 110.9234,
    label: 'Grobogan, Jateng',
  });

  useEffect(() => {
    try {
      localStorage.setItem('paten_agro_field_observations', JSON.stringify(observations));
    } catch (e) {
      console.error(e);
    }
  }, [observations]);

  const [activeTab, setActiveTab] = useState<
    'simulasi' | 'peta' | 'komparasi' | 'matrix' | 'keberlanjutan' | 'markdown'
  >('simulasi');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMarkdownModalOpen, setIsMarkdownModalOpen] = useState<boolean>(false);

  // Perhitungan simulasi aktif
  const summary = useMemo(() => {
    return calculateSimulation(selectedCrop, areaAre, mode, costParams, userTargets);
  }, [selectedCrop, areaAre, mode, costParams, userTargets]);

  // Perhitungan matriks 10 Are s/d 100 Are
  const areaMatrix = useMemo(() => {
    return generateAreaMatrix(selectedCrop, mode, costParams, userTargets);
  }, [selectedCrop, mode, costParams, userTargets]);

  // Generate teks markdown lengkap
  const markdownReport = useMemo(() => {
    return generateFullMarkdownReport(summary, areaMatrix, costParams, season);
  }, [summary, areaMatrix, costParams, season]);

  // Handlers untuk Catatan Lapangan
  const handleAddObservation = (obs: FieldObservation) => {
    setObservations((prev) => [obs, ...prev]);
  };

  const handleDeleteObservation = (id: string) => {
    setObservations((prev) => prev.filter((o) => o.id !== id));
  };

  const handleToggleObservationStatus = (id: string) => {
    setObservations((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              applicationStatus:
                o.applicationStatus === 'sudah_aplikasi'
                  ? 'belum_aplikasi'
                  : 'sudah_aplikasi',
            }
          : o
      )
    );
  };

  // Handler Download PDF menggunakan jsPDF
  const handleDownloadPDF = () => {
    generateApplicationGuidePDF(summary, costParams, season, observations);
  };

  // Handler Copy Markdown
  const handleCopyMarkdown = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(markdownReport);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = markdownReport;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Handler Download Markdown
  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdownReport], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Simulasi_PatenGold_${selectedCrop}_${areaAre}Are_${mode}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Quick Preset Handlers (Sesuai Permintaan Spesifik User)
  const applyQuickScenario = (
    crop: CropType,
    scenMode: CalculationMode,
    are: number
  ) => {
    setSelectedCrop(crop);
    setMode(scenMode);
    setAreaAre(are);
  };

  const meta = CROP_METADATA[selectedCrop];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased">
      {/* Header Utama */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenMarkdownModal={() => setIsMarkdownModalOpen(true)}
        onCopyMarkdown={handleCopyMarkdown}
        onDownloadMarkdown={handleDownloadMarkdown}
        onDownloadPDF={handleDownloadPDF}
        isCopied={isCopied}
      />

      {/* Skenario Cepat (Permintaan Prompt User) */}
      <div className="bg-emerald-900 border-b border-emerald-800 text-emerald-100 text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium text-emerald-200">
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Skenario Cepat:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <button
              onClick={() => applyQuickScenario('jagung', 'irit', 50)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedCrop === 'jagung' && mode === 'irit' && areaAre === 50
                  ? 'bg-emerald-500 text-white font-semibold'
                  : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100'
              }`}
            >
              Jagung 0,5 Ha (Mode Irit)
            </button>

            <button
              onClick={() => applyQuickScenario('padi', 'irit', 50)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedCrop === 'padi' && mode === 'irit' && areaAre === 50
                  ? 'bg-emerald-500 text-white font-semibold'
                  : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100'
              }`}
            >
              Padi 0,5 Ha (Mode Irit)
            </button>

            <button
              onClick={() => applyQuickScenario('tembakau', 'irit', 50)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedCrop === 'tembakau' && mode === 'irit' && areaAre === 50
                  ? 'bg-emerald-500 text-white font-semibold'
                  : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100'
              }`}
            >
              Tembakau 0,5 Ha (Mode Irit)
            </button>

            <button
              onClick={() => applyQuickScenario('hortikultura', 'irit', 50)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedCrop === 'hortikultura' && mode === 'irit' && areaAre === 50
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100'
              }`}
            >
              Cabe / Hortikultura 0,5 Ha
            </button>

            <span className="text-emerald-500 px-1">|</span>

            <button
              onClick={() => applyQuickScenario('jagung', 'full_populasi', 100)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedCrop === 'jagung' && mode === 'full_populasi' && areaAre === 100
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100'
              }`}
            >
              Jagung 1 Ha Full Populasi (70.000 Pohon)
            </button>

            <button
              onClick={() => applyQuickScenario('tembakau', 'full_populasi', 100)}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedCrop === 'tembakau' && mode === 'full_populasi' && areaAre === 100
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100'
              }`}
            >
              Tembakau 1 Ha Full Populasi (20.000 Pohon)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">
        {/* Kontrol Utama: Komoditas & Luas */}
        <div className="space-y-4">
          <CommoditySelector
            selectedCrop={selectedCrop}
            onSelectCrop={setSelectedCrop}
          />

          <AreaAndModeControl
            crop={selectedCrop}
            mode={mode}
            onSelectMode={setMode}
            areaAre={areaAre}
            onChangeArea={setAreaAre}
            population={summary.population}
            onOpenMap={() => setActiveTab('peta')}
          />
        </div>

        {/* 4 Kartu Metrik Utama */}
        <SummaryCards summary={summary} />

        {/* Kalkulator Target Panen & Laba Bersih Petani */}
        <HarvestProfitCalculator
          crop={selectedCrop}
          summary={summary}
          userTargets={userTargets}
          onChangeTargets={setUserTargets}
          areaAre={areaAre}
        />

        {/* Tab Navigasi Visual */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg max-w-fit text-xs font-medium">
          <button
            onClick={() => setActiveTab('simulasi')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-colors ${
              activeTab === 'simulasi'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>Jadwal & Kebutuhan Nutrisi</span>
          </button>

          <button
            onClick={() => setActiveTab('peta')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-colors ${
              activeTab === 'peta'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Peta & Ukur Lahan (Google Maps)</span>
          </button>

          <button
            onClick={() => setActiveTab('komparasi')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-colors ${
              activeTab === 'komparasi'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-emerald-600" />
            <span>Komparasi Kimia vs Paten</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-colors ${
              activeTab === 'matrix'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Matriks Luas (10 s/d 100 Are)</span>
          </button>

          <button
            onClick={() => setActiveTab('keberlanjutan')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-colors ${
              activeTab === 'keberlanjutan'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Proyeksi Jangka Panjang & ROI</span>
          </button>

          <button
            onClick={() => setActiveTab('markdown')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md transition-colors ${
              activeTab === 'markdown'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>Teks Markdown Terformat</span>
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'simulasi' && (
          <div className="space-y-4">
            <CropGrowthTimeline
              crop={selectedCrop}
              steps={summary.steps}
            />
            <PhaseSachetDistributionChart
              steps={summary.steps}
              crop={selectedCrop}
            />
            <SoilPhCalculator
              areaAre={areaAre}
              crop={selectedCrop}
            />
            <LeafDeficiencyNpkCalculator
              crop={selectedCrop}
              areaAre={areaAre}
            />
            <AutomaticScheduleReminder
              crop={selectedCrop}
              steps={summary.steps}
              areaAre={areaAre}
            />
            <DailyFieldNotes
              crop={selectedCrop}
              steps={summary.steps}
              observations={observations}
              onAddObservation={handleAddObservation}
              onDeleteObservation={handleDeleteObservation}
              onToggleStatus={handleToggleObservationStatus}
            />
            <SeasonalApplicationGuide
              crop={selectedCrop}
              season={season}
              onSelectSeason={setSeason}
            />
            <GpsRainfallSprayAdvisor
              crop={selectedCrop}
              coordinates={farmCoordinates}
              onUpdateCoordinates={setFarmCoordinates}
            />
            <WeatherHumidityTips
              crop={selectedCrop}
            />
            <OfficialBrosurReference crop={selectedCrop} />
            <ApplicationTimeline steps={summary.steps} />
          </div>
        )}

        {activeTab === 'peta' && (
          <div className="space-y-4">
            <GoogleMapsLandTracker
              currentAreaAre={areaAre}
              onApplyArea={(are) => {
                setAreaAre(are);
              }}
              cropName={meta.name}
              initialCoords={farmCoordinates}
              onCoordinatesChange={setFarmCoordinates}
            />
            <GpsRainfallSprayAdvisor
              crop={selectedCrop}
              coordinates={farmCoordinates}
              onUpdateCoordinates={setFarmCoordinates}
            />
          </div>
        )}

        {activeTab === 'komparasi' && (
          <div className="space-y-4">
            <CostComparisonTable summary={summary} />
          </div>
        )}

        {activeTab === 'matrix' && (
          <div className="space-y-4">
            <AreaMatrixTable
              matrix={areaMatrix}
              currentAreaAre={areaAre}
              onSelectArea={setAreaAre}
              cropName={meta.name}
              modeLabel={
                mode === 'irit'
                  ? 'Mode Irit (Efisiensi 0.5 Ha)'
                  : 'Mode Full Populasi Kocor'
              }
            />
          </div>
        )}

        {activeTab === 'keberlanjutan' && (
          <div className="space-y-4">
            <SustainabilitySection
              summary={summary}
              matrix={areaMatrix}
              crop={selectedCrop}
            />
          </div>
        )}

        {activeTab === 'markdown' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-slate-900">
                  Laporan Markdown Siap Salin (Sesuai Permintaan)
                </h3>
                <p className="text-xs text-slate-500">
                  Lengkap dengan tabel komparasi 10-100 Are, perincian air, insek, dan proyeksi ROI
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold"
                >
                  {isCopied ? 'Tersalin ke Clipboard!' : 'Salin Markdown'}
                </button>
                <button
                  onClick={handleDownloadMarkdown}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold"
                >
                  Download .md
                </button>
              </div>
            </div>
            <div className="p-4 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-[600px] overflow-y-auto leading-relaxed">
              <pre className="whitespace-pre-wrap">{markdownReport}</pre>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-700">Paten AgroSim Pro</span>
            <span className="mx-2">·</span>
            <span>Berdasarkan Brosur Panduan Aplikasi Pupuk Organik Paten Gold</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Diformulasikan untuk Jagung (70.000 ph/ha), Padi, dan Tembakau (20.000 ph/ha)
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MarkdownViewerModal
        isOpen={isMarkdownModalOpen}
        onClose={() => setIsMarkdownModalOpen(false)}
        markdownContent={markdownReport}
        onCopy={handleCopyMarkdown}
        onDownload={handleDownloadMarkdown}
        isCopied={isCopied}
      />

      <CostSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        params={costParams}
        onSave={setCostParams}
      />
    </div>
  );
}
