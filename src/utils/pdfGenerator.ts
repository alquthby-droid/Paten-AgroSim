import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  SimulationSummary,
  CostParameters,
  SeasonType,
  FieldObservation,
} from '../types';
import { CROP_METADATA } from '../data/cropProtocols';
import { SEASONAL_GUIDANCE } from '../data/seasonGuidance';

function formatRupiah(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

export function generateApplicationGuidePDF(
  summary: SimulationSummary,
  params: CostParameters,
  season: SeasonType,
  observations: FieldObservation[] = []
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const meta = CROP_METADATA[summary.crop];
  const seasonal = SEASONAL_GUIDANCE[summary.crop][season];
  const companionTotalKg =
    summary.totalUreaKg + summary.totalZaKg + summary.totalNpkKg;

  // Header Banner
  doc.setFillColor(6, 78, 59); // Emerald 900
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('PANDUAN APLIKASI LAPANGAN - PUPUK ORGANIK PATEN', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    'Simulasi Dosis Pemupukan, Kebutuhan Air, Insektisida, dan Jadwal Harian Lapangan',
    14,
    18
  );
  doc.text('Teknologi Nano Organik · PT Reni Inti Internasional', 14, 23);

  // Info Petani / Lahan
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('1. SPESIFIKASI LAHAN & TARGET TANAMAN', 14, 35);

  const infoRows = [
    [
      'Komoditas',
      `${meta.name} (${meta.scientificName})`,
      'Mode Aplikasi',
      summary.mode === 'irit' ? 'Mode Irit (Efisiensi 0.5 Ha)' : 'Full Populasi Kocor (100%)',
    ],
    [
      'Luas Lahan',
      `${summary.areaAre} Are (${summary.areaHa} Ha / ${formatNumber(summary.areaAre * 100)} m²)`,
      'Kondisi Musim',
      season === 'hujan' ? 'Musim Hujan (Rendeng)' : 'Musim Kemarau (Gadu)',
    ],
    [
      'Estimasi Populasi',
      `${formatNumber(summary.population)} ${summary.crop === 'padi' ? 'rumpun' : 'pohon'}`,
      'Target Hasil Panen',
      `${formatNumber(summary.patenYield)} ${meta.unitProduce} (+${summary.yieldIncreasePercent}%)`,
    ],
  ];

  autoTable(doc, {
    startY: 38,
    body: infoRows,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2, textColor: [30, 41, 59] },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [241, 245, 249], cellWidth: 32 },
      1: { cellWidth: 63 },
      2: { fontStyle: 'bold', fillColor: [241, 245, 249], cellWidth: 32 },
      3: { cellWidth: 55 },
    },
    margin: { left: 14, right: 14 },
  });

  // Ringkasan Kebutuhan
  let currentY = (doc as any).lastAutoTable.finalY + 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('2. RINGKASAN TOTAL KEBUTUHAN INPUT & FINANSIAL', 14, currentY);

  const summaryData = [
    ['Pupuk Paten', `${summary.totalPatenSachets} Sachet (${summary.totalPatenBoxesRounded} Box @ 24 sct)`, 'Biaya Sistem Paten', formatRupiah(summary.totalPatenSystemCost)],
    ['Total Kebutuhan Air', `${formatNumber(summary.totalWaterLiters)} Liter (~${summary.totalSprayTanks} Tangki 16L)`, 'Biaya Kimia Konvensional', formatRupiah(summary.totalConventionalCost)],
    ['Insektisida Pendamping', `${summary.totalInsekMl} ml (~${summary.totalInsekBottles} botol @ 100ml)`, 'Penghematan Biaya', `HEMAT ${formatRupiah(summary.costDifference)} (${summary.costSavingPercent}%)`],
    ['Pupuk Starter Kimia', `${companionTotalKg} kg (Urea: ${summary.totalUreaKg}kg | ZA: ${summary.totalZaKg}kg | NPK: ${summary.totalNpkKg}kg)`, 'Keuntungan Bersih (Net Profit)', `${formatRupiah(summary.patenNetProfit)} (ROI: ${summary.patenRoi}%)`],
  ];

  autoTable(doc, {
    startY: currentY + 3,
    body: summaryData,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2, textColor: [30, 41, 59] },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [236, 253, 245], cellWidth: 35 },
      1: { cellWidth: 60 },
      2: { fontStyle: 'bold', fillColor: [236, 253, 245], cellWidth: 42 },
      3: { fontStyle: 'bold', cellWidth: 45, textColor: [5, 150, 105] },
    },
    margin: { left: 14, right: 14 },
  });

  // Tabel Jadwal Aplikasi Lapangan
  currentY = (doc as any).lastAutoTable.finalY + 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('3. JADWAL DETAIL APLIKASI LAPANGAN (HST)', 14, currentY);

  const stepRows = summary.steps.map((s) => [
    s.label,
    s.method.toUpperCase(),
    `${s.patenSachets} Sachet`,
    `${s.waterLiters} L (${s.sprayTanks} tki)`,
    s.insekMl > 0 ? `${s.insekMl} ml` : '-',
    s.chemicalCompanion !== '-' ? `${s.chemicalCompanion} (${s.chemicalAmountKg} kg)` : '-',
    `${s.description}. ${s.notes}`,
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    head: [
      ['Waktu (HST)', 'Metode', 'Paten', 'Air', 'Insek', 'Kimia Starter', 'Instruksi & Cara Aplikasi'],
    ],
    body: stepRows,
    theme: 'striped',
    headStyles: {
      fillColor: [5, 150, 105],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    styles: { fontSize: 7.5, cellPadding: 2, textColor: [30, 41, 59] },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 22 },
      1: { cellWidth: 16 },
      2: { fontStyle: 'bold', cellWidth: 17 },
      3: { cellWidth: 20 },
      4: { cellWidth: 14 },
      5: { cellWidth: 25 },
      6: { cellWidth: 68 },
    },
    margin: { left: 14, right: 14 },
  });

  // Rekomendasi Waktu Musim & Tips Cuaca Ekstrem
  currentY = (doc as any).lastAutoTable.finalY + 6;

  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('4. REKOMENDASI WAKTU APLIKASI & PROTOKOL CUACA EKSTREM', 14, currentY);

  const seasonalRows = [
    ['Waktu Semprot Foliar', seasonal.optimalSprayHours],
    ['Waktu Kocor Perakaran', seasonal.optimalKocorHours],
    ['Kelembapan Tanah', seasonal.soilMoistureCondition],
    ['Hujan < 30 Menit Pasca Semprot', 'Partikel nano terserap sebagian. Tunggu daun kering, lakukan semprot ulang sulaman 50% dosis Paten + perekat.'],
    ['Hujan > 45-60 Menit Pasca Semprot', 'Nutrisi nano telah terserap > 85% ke stomata daun. TIDAK PERLU SEMPROT ULANG!'],
    ['Kemarau Panjang / Cekaman Air', 'Semprot pagi buta (05.30-07.30 WIB) atau sore (16.30-17.45 WIB). Kocor piringan wajib didahului siram/leb air tipis.'],
  ];

  autoTable(doc, {
    startY: currentY + 3,
    body: seasonalRows,
    theme: 'grid',
    styles: { fontSize: 7.5, cellPadding: 2, textColor: [30, 41, 59] },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [248, 250, 252], cellWidth: 50 },
      1: { cellWidth: 132 },
    },
    margin: { left: 14, right: 14 },
  });

  // Catatan Harian Petani (Jika ada)
  const cropObservations = observations.filter((o) => o.crop === summary.crop);
  if (cropObservations.length > 0) {
    currentY = (doc as any).lastAutoTable.finalY + 6;

    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('5. CATATAN HARIAN OBSERVASI LAPANGAN PETANI', 14, currentY);

    const obsRows = cropObservations.map((o) => [
      `Hari ke-${o.day} HST`,
      o.date || '-',
      o.plantHeightCm ? `${o.plantHeightCm} cm` : '-',
      o.plantVigor === 'sangat_sehat' ? 'Sangat Sehat' : o.plantVigor === 'normal' ? 'Normal' : 'Kurang Sehat',
      o.pestObservations || 'Bebas Hama',
      o.applicationStatus === 'sudah_aplikasi' ? 'SUDAH' : 'BELUM',
      o.notes || '-',
    ]);

    autoTable(doc, {
      startY: currentY + 3,
      head: [
        ['Jadwal', 'Tanggal', 'Tinggi', 'Vigor', 'Observasi Hama', 'Status Pupuk', 'Catatan Tambahan'],
      ],
      body: obsRows,
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7.5,
      },
      styles: { fontSize: 7, cellPadding: 2, textColor: [30, 41, 59] },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 20 },
        1: { cellWidth: 18 },
        2: { cellWidth: 14 },
        3: { cellWidth: 20 },
        4: { cellWidth: 32 },
        5: { fontStyle: 'bold', cellWidth: 20 },
        6: { cellWidth: 58 },
      },
      margin: { left: 14, right: 14 },
    });
  }

  // Footer di semua halaman
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Paten AgroSim Pro · Panduan Cetak Lapangan Petani · Halaman ${i} dari ${pageCount}`,
      14,
      290
    );
    doc.text(
      `Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`,
      145,
      290
    );
  }

  // Simpan dan Download PDF
  const cleanName = meta.name.split(' ')[0];
  doc.save(`Panduan_Aplikasi_Paten_${cleanName}_${summary.areaAre}Are.pdf`);
}
