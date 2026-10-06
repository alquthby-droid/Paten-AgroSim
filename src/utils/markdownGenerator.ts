import { SimulationSummary, CostParameters, AreaMatrixRow, SeasonType } from '../types';
import { CROP_METADATA, MULTI_YEAR_PROJECTIONS } from '../data/cropProtocols';
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

export function generateFullMarkdownReport(
  sim: SimulationSummary,
  matrix: AreaMatrixRow[],
  params: CostParameters,
  season: SeasonType = 'kemarau'
): string {
  const meta = CROP_METADATA[sim.crop];
  const cropTitle = meta.name.toUpperCase();
  const modeTitle =
    sim.mode === 'irit'
      ? 'MODE IRIT (EFISIENSI BROSUR & HEMAT AIR)'
      : 'MODE FULL POPULASI KOCOR (100% POHON)';

  const companionKg = sim.totalUreaKg + sim.totalZaKg + sim.totalNpkKg;
  const seasonal = SEASONAL_GUIDANCE[sim.crop][season];

  let md = `# LAPORAN SIMULASI & ANALISIS KELAYAKAN FINANSIAL PRODUK PATEN GOLD
## KOMODITAS: ${cropTitle} (${meta.scientificName})
**Mode Aplikasi:** ${modeTitle}  
**Kondisi Musim:** ${season === 'hujan' ? 'MUSIM HUJAN (RENDENG)' : 'MUSIM KEMARAU (GADU)'}  
**Luas Lahan Terpilih:** ${sim.areaAre} Are (${sim.areaHa} Hektar / ${formatNumber(sim.areaAre * 100)} m²)  
**Estimasi Populasi Tanaman:** ${formatNumber(sim.population)} ${sim.crop === 'padi' ? 'rumpun' : 'pohon'}  

---

### 1. RINGKASAN KEBUTUHAN UTAMA (LUAS ${sim.areaAre} ARE / ${sim.areaHa} HA)

| Parameter | Kebutuhan / Nilai | Catatan & Dosis |
| :--- | :--- | :--- |
| **Pupuk Paten Gold** | **${sim.totalPatenSachets} Sachet** (${sim.totalPatenBoxesRounded} Box @ 24 sachet) | Teknologi Nano cepat serap stomata & akar |
| **Kebutuhan Air** | **${formatNumber(sim.totalWaterLiters)} Liter** (~${sim.totalSprayTanks} Tangki 16L) | Kocor + Semprot rutin |
| **Insektisida Pendamping** | **${sim.totalInsekMl} ml** (~${sim.totalInsekBottles} botol @ 100ml) | Dicampur saat semprot foliar |
| **Pupuk Kimia Starter** | **${companionKg} kg** | Urea: ${sim.totalUreaKg} kg \| ZA: ${sim.totalZaKg} kg \| NPK: ${sim.totalNpkKg} kg |
| **Total Biaya Sistem Paten** | **${formatRupiah(sim.totalPatenSystemCost)}** | Paten + Kimia starter + Insek + Air + Buruh |
| **Total Biaya Kimia Konvensional** | **${formatRupiah(sim.totalConventionalCost)}** | 100% Pupuk Kimia + Insek Kimia + Ongkos Tabur |
| **Efisiensi Penghematan Biaya** | **${formatRupiah(sim.costDifference)} (${sim.costSavingPercent}%)** | Penghematan langsung biaya operasional |
| **Proyeksi Panen Paten** | **${formatNumber(sim.patenYield)} ${meta.unitProduce}** | Naik ${sim.yieldIncreasePercent}% (+${formatNumber(sim.yieldIncreaseKg)} kg) |
| **Proyeksi Panen Konvensional**| **${formatNumber(sim.conventionalYield)} ${meta.unitProduce}** | Rata-rata petani setempat |
| **Laba Bersih Sistem Paten** | **${formatRupiah(sim.patenNetProfit)}** | Tambahan keuntungan: **+${formatRupiah(sim.netProfitIncrease)}** |
| **Return on Investment (ROI)** | **${sim.patenRoi}%** (B/C: ${sim.patenBcRatio}) | vs Konvensional ${sim.conventionalRoi}% (B/C: ${sim.conventionalBcRatio}) |

---

### 2. REKOMENDASI WAKTU & TEKNIS APLIKASI BERDASARKAN MUSIM (${season.toUpperCase()})

Ketersediaan air dan kelembapan tanah sangat mempengaruhi kecepatan penyerapan hara nano:

- **Waktu Semprot Foliar:** ${seasonal.optimalSprayHours}
- **Waktu Kocor Perakaran:** ${seasonal.optimalKocorHours}
- **Kondisi Kelembapan Tanah Ideal:** ${seasonal.soilMoistureCondition}
- **Penggunaan Adjuvant (Perekat/Pembasah):** ${seasonal.adjuvantAdvice}
- **Penyesuaian Volume Larutan:** ${seasonal.waterAdjustmentAdvice}

**Tantangan & Risiko Musim:**
${seasonal.keyRisks.map((r) => `- ${r}`).join('\n')}

**SOP Praktik Agronomis Terbaik:**
${seasonal.bestPractices.map((bp) => `- ${bp}`).join('\n')}

---

### 3. PROTOKOL PENANGANAN CUACA EKSTREM & KELEMBAPAN
- **Hujan Lebat < 30 Menit Pasca Semprot:** Partikel nano terserap sebagian. Tunggu daun kering dan lakukan semprot sulaman dosis 50% Paten Gold + perekat (5-10 ml/tangki).
- **Hujan > 45-60 Menit Pasca Semprot:** Nutrisi nano telah terserap > 85% ke dinding sel & stomata. **TIDAK PERLU SEMPROT ULANG**, nutrisi tetap bekerja optimal.
- **Kemarau Panjang / Cekaman Air:** Semprot pagi buta (05.30 - 07.30 WIB) saat embun masih ada atau sore (16.30 - 17.45 WIB). Kocor piringan wajib didahului penyiraman ringan. Manfaatkan asam amino Paten Gold sebagai peredam stres kekeringan (*anti-stress drought*).
- **Angin Kencang:** Hindari nozzle kabut ekstra halus untuk mencegah drift (larutan melayang). Gunakan nozzle sedang berjarak 25-30 cm dari tajuk daun.

---

### 4. JADWAL DETAIL APLIKASI SESUAI BROSUR RESMI PATEN GOLD

Berikut adalah rincian tahapan perlakuan dari hari setelah tanam (HST):

| Jadwal (HST) | Metode | Dosis Paten Gold | Kebutuhan Air | Campuran Kimia & Insek | Keterangan & Sasaran |
| :--- | :---: | :---: | :---: | :--- | :--- |
${sim.steps
  .map(
    (s) =>
      `| **${s.label}** | ${s.method.toUpperCase()} | ${s.patenSachets} Sachet | ${s.waterLiters} Liter (${s.sprayTanks} tki) | Insek: ${s.insekMl} ml, ${s.chemicalCompanion} (${s.chemicalAmountKg} kg) | ${s.description}. *${s.notes}* |`
  )
  .join('\n')}

---

### 4. TABEL KOMPARASI LENGKAP RENTANG 10 ARE S/D 100 ARE (1 HA)

Tabel berikut menyajikan simulasi bertingkat kebutuhan produk, air, insek, dan perbandingan finansial untuk rentang luas 10 Are hingga 100 Are (${modeTitle}):

| Luas (Are) | Luas (Ha) | Populasi | Paten (Sachet/Box) | Air (Liter) | Insek (ml) | Kimia Starter (kg) | Biaya Paten (Rp) | Biaya Kimia (Rp) | Hemat (Rp) | Hemat (%) | Laba Bersih Paten (Rp) | ROI (%) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
${matrix
  .map(
    (row) =>
      `| **${row.areaAre}** | ${row.areaHa} | ${formatNumber(row.population)} | ${row.patenSachets} sct (${row.patenBoxes} box) | ${formatNumber(row.waterLiters)} | ${row.insekMl} | ${row.companionFertilizerKg} | ${formatNumber(row.patenTotalCost)} | ${formatNumber(row.conventionalTotalCost)} | ${formatNumber(row.costSavings)} | ${row.savingsPercent}% | ${formatNumber(row.patenNetProfit)} | ${row.roi}% |`
  )
  .join('\n')}

---

### 5. KOMPARASI BIAYA MENDALAM: PUPUK KIMIA KONVENSIONAL VS PATEN GOLD

| Komponen Biaya | Pupuk Kimia Konvensional | Sistem Paten Gold Nano | Selisih Efisiensi |
| :--- | :--- | :--- | :--- |
| **Pupuk Utama** | Biaya pupuk makro kimia (Urea, NPK, ZA ratusan kg): **${formatRupiah(sim.conventionalFertilizerCost)}** | Biaya Paten Gold (${sim.totalPatenBoxesRounded} box) + starter minimalis (${companionKg} kg): **${formatRupiah(sim.patenCost + sim.chemicalCompanionCost)}** | **Hemat ${formatRupiah(sim.conventionalFertilizerCost - (sim.patenCost + sim.chemicalCompanionCost))}** |
| **Insektisida / Pestisida** | Kimia dosis tinggi & interval rapat: **${formatRupiah(sim.conventionalPesticideCost)}** | Insektisida terarah sinergis (${sim.totalInsekMl} ml): **${formatRupiah(sim.insekCost)}** | **Hemat ${formatRupiah(sim.conventionalPesticideCost - sim.insekCost)}** |
| **Tenaga Kerja (HOK)** | Panggul & sebar karung berat ratusan kg: **${formatRupiah(sim.conventionalLaborCost)}** | Aplikasi semprot/kocor ringan botol/tangki: **${formatRupiah(sim.patenLaborCost)}** | **Hemat ${formatRupiah(sim.conventionalLaborCost - sim.patenLaborCost)}** |
| **Biaya Operasional Air** | - (Tergantung cuaca/irigasi) | Pompa air kocor & semprot (${formatNumber(sim.totalWaterLiters)} L): **${formatRupiah(sim.waterCost)}** | Tambahan operasional terkontrol |
| **TOTAL BIAYA INPUT** | **${formatRupiah(sim.totalConventionalCost)}** | **${formatRupiah(sim.totalPatenSystemCost)}** | **PENGHEMATAN: ${formatRupiah(sim.costDifference)} (${sim.costSavingPercent}%)** |

---

### 6. ANALISIS PROYEKSI KEUNTUNGAN & ROI (RETURN ON INVESTMENT)

Dengan mengasumsikan harga jual **${meta.name}** sebesar **${formatRupiah(meta.sellingPricePerUnit)} / ${meta.unitProduce}**:

1. **Hasil Panen:**
   - Metode Konvensional: ${formatNumber(sim.conventionalYield)} ${meta.unitProduce} -> Omzet: **${formatRupiah(sim.conventionalRevenue)}**
   - Sistem Paten Gold: ${formatNumber(sim.patenYield)} ${meta.unitProduce} (+${sim.yieldIncreasePercent}%) -> Omzet: **${formatRupiah(sim.patenRevenue)}**
   - **Kenaikan Omzet Kotor:** **+${formatRupiah(sim.revenueDifference)}**

2. **Laba Bersih Usaha Tani:**
   - Laba Bersih Konvensional: ${formatRupiah(sim.conventionalRevenue)} - ${formatRupiah(sim.totalConventionalCost)} = **${formatRupiah(sim.conventionalNetProfit)}**
   - Laba Bersih Paten Gold: ${formatRupiah(sim.patenRevenue)} - ${formatRupiah(sim.totalPatenSystemCost)} = **${formatRupiah(sim.patenNetProfit)}**
   - **Tambahan Laba Bersih Petani:** **+${formatRupiah(sim.netProfitIncrease)} (+${sim.netProfitIncreasePercent}%)**

3. **Indikator Finansial:**
   - **ROI Paten Gold:** **${sim.patenRoi}%** (Setiap Rp 1.000 modal input menghasilkan laba bersih Rp ${formatNumber(Math.round(sim.patenRoi * 10))})
   - **B/C Ratio Paten Gold:** **${sim.patenBcRatio}** (Sangat layak secara agribisnis, B/C > 1.5)
   - **ROI Konvensional:** ${sim.conventionalRoi}% (B/C: ${sim.conventionalBcRatio})

---

### 7. PROYEKSI KEBERLANJUTAN JANGKA PANJANG (MULTI-MUSIM)

Penggunaan pupuk organik berteknologi nano Paten Gold secara berkelanjutan memberikan efek kumulatif positif pada struktur tanah dan efisiensi serapan nutrisi:

${MULTI_YEAR_PROJECTIONS.map(
  (p) => `#### ${p.year}
- **Kondisi Tanah:** ${p.soilHealth}
- **Penurunan Pupuk Kimia:** ${p.chemicalFertilizerReduction}
- **Kenaikan Hasil Panen:** ${p.yieldImpact}
- **Estimasi Penghematan:** ${p.costSavings}
- **Catatan Agronomi:** ${p.sustainabilityNote}
`
).join('\n')}

---

### 8. KESIMPULAN & REKOMENDASI AGRONOMIS
1. **Efisiensi Nyata:** Penggunaan Paten Gold membuktikan penghematan biaya pupuk hingga **${sim.costSavingPercent}%**, sekaligus menaikkan hasil panen sebesar **${sim.yieldIncreasePercent}%**.
2. **Kesehatan Tanah:** Menghindari pengerasan tanah akibat timbunan residu kimia sintetis, mengembalikan pH optimal, serta memperkuat ketahanan alami tanaman terhadap hama & penyakit.
3. **Praktis & Ringan:** Petani tidak lagi terbebani mengangkut ratusan kilogram pupuk anorganik ke tengah lahan sawah atau tegalan.

*Dihitung otomatis oleh Paten AgroSim Pro berdasarkan Brosur Resmi Paten Gold.*
`;

  return md;
}
