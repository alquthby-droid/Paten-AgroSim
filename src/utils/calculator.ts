import {
  CropType,
  CalculationMode,
  CostParameters,
  SimulationSummary,
  StepRequirement,
  AreaMatrixRow,
  UserYieldTarget,
} from '../types';
import { CROP_METADATA } from '../data/cropProtocols';

/**
 * Hitung simulasi rinci penggunaan Paten Gold untuk luas lahan tertentu
 */
export function calculateSimulation(
  crop: CropType,
  areaAre: number, // 10 s/d 100 are
  mode: CalculationMode,
  params: CostParameters,
  customTargets?: UserYieldTarget
): SimulationSummary {
  const areaHa = areaAre / 100;
  const cropMeta = CROP_METADATA[crop];
  const population = Math.round(cropMeta.standardPopulationPerHa * areaHa);

  const steps: StepRequirement[] = [];

  let totalPatenSachets = 0;
  let totalWaterLiters = 0;
  let totalSprayTanks = 0;
  let totalInsekMl = 0;
  let totalUreaKg = 0;
  let totalZaKg = 0;
  let totalNpkKg = 0;

  // Tangki semprot 16L basis (per Ha standar semprot ~ 10-12 tangki, min 1)
  const sprayTanksPerApp = Math.max(1, Math.round(10 * areaHa));
  const waterPerSprayApp = sprayTanksPerApp * 16;

  if (crop === 'jagung') {
    if (mode === 'full_populasi') {
      // 1. H-5 Semprot Cegah Bule (1 sachet/tangki 16-20L)
      const s1Sachets = sprayTanksPerApp * 1;
      const s1Water = waterPerSprayApp;
      steps.push({
        day: 5,
        label: 'Hari ke-5 HST',
        method: 'semprot',
        description: 'Semprot seluruh tanaman untuk pencegahan virus bule',
        patenSachets: s1Sachets,
        waterLiters: s1Water,
        sprayTanks: sprayTanksPerApp,
        insekMl: 0,
        chemicalCompanion: '-',
        chemicalAmountKg: 0,
        notes: '1 sachet / tangki 16-20L. Semprot kabut merata di pagi hari.',
      });

      // 2. H-12 Kocor 50ml/pohon (1 sachet + Urea 2 gelas aqua ~0.4kg + 20L air)
      const kocorWater1 = Math.round(population * 0.05); // 50ml = 0.05L
      const batches1 = Math.max(1, Math.round(kocorWater1 / 20));
      const s2Sachets = batches1 * 1;
      const ureaKg1 = Math.round(batches1 * 0.4 * 10) / 10;
      steps.push({
        day: 12,
        label: 'Hari ke-12 HST',
        method: 'kocor',
        description: 'Kocor per pohon 50ml nutrisi vegetatif awal',
        patenSachets: s2Sachets,
        waterLiters: kocorWater1,
        sprayTanks: Math.ceil(kocorWater1 / 16),
        insekMl: 0,
        chemicalCompanion: 'Urea (2 gelas/20L)',
        chemicalAmountKg: ureaKg1,
        notes: 'Kocorkan tepat 50ml ke pangkal per pohon (100% populasi).',
      });

      // 3. H-14 Semprot + Insek (1 sachet + insek per tangki)
      const s3Sachets = sprayTanksPerApp * 1;
      const s3Insek = sprayTanksPerApp * 10; // 10ml insek / tangki
      steps.push({
        day: 14,
        label: 'Hari ke-14 HST',
        method: 'semprot',
        description: 'Semprot nutrisi daun + pencegahan ulat grayak / insek',
        patenSachets: s3Sachets,
        waterLiters: waterPerSprayApp,
        sprayTanks: sprayTanksPerApp,
        insekMl: s3Insek,
        chemicalCompanion: '-',
        chemicalAmountKg: 0,
        notes: 'Campur 1 sachet + 10ml Insektisida per tangki.',
      });

      // 4. H-21 Semprot + Insek (1 sachet + insek per tangki)
      const s4Sachets = sprayTanksPerApp * 1;
      const s4Insek = sprayTanksPerApp * 10;
      steps.push({
        day: 21,
        label: 'Hari ke-21 HST',
        method: 'semprot',
        description: 'Semprot perlindungan daun & pembesaran batang',
        patenSachets: s4Sachets,
        waterLiters: waterPerSprayApp,
        sprayTanks: sprayTanksPerApp,
        insekMl: s4Insek,
        chemicalCompanion: '-',
        chemicalAmountKg: 0,
        notes: '1 sachet Paten Gold + Insek per tangki 16-20L.',
      });

      // 5. H-26 Kocor 50ml/pohon (1 sachet + Urea 2 gelas + 20L air)
      const kocorWater2 = Math.round(population * 0.05);
      const batches2 = Math.max(1, Math.round(kocorWater2 / 20));
      const s5Sachets = batches2 * 1;
      const ureaKg2 = Math.round(batches2 * 0.4 * 10) / 10;
      steps.push({
        day: 26,
        label: 'Hari ke-26 HST',
        method: 'kocor',
        description: 'Kocor nutrisi pembesaran vegetatif aktif 50ml/pohon',
        patenSachets: s5Sachets,
        waterLiters: kocorWater2,
        sprayTanks: Math.ceil(kocorWater2 / 16),
        insekMl: 0,
        chemicalCompanion: 'Urea (2 gelas/20L)',
        chemicalAmountKg: ureaKg2,
        notes: '1 sachet Paten Gold + 2 gelas aqua Urea per 20 liter air.',
      });

      // 6. H-28 Semprot + Insek (1 sachet + insek per tangki)
      const s6Sachets = sprayTanksPerApp * 1;
      const s6Insek = sprayTanksPerApp * 10;
      steps.push({
        day: 28,
        label: 'Hari ke-28 HST',
        method: 'semprot',
        description: 'Semprot perlindungan daun & persiapan fase generatif',
        patenSachets: s6Sachets,
        waterLiters: waterPerSprayApp,
        sprayTanks: sprayTanksPerApp,
        insekMl: s6Insek,
        chemicalCompanion: '-',
        chemicalAmountKg: 0,
        notes: '1 sachet Paten Gold + Insek per tangki 16-20L.',
      });

      // 7. H-35 Kocor 50ml/pohon (2 sachet Paten Gold + 20L air, tanpa urea)
      const kocorWater3 = Math.round(population * 0.05);
      const batches3 = Math.max(1, Math.round(kocorWater3 / 20));
      const s7Sachets = batches3 * 2; // 2 sachet per 20 liter!
      steps.push({
        day: 35,
        label: 'Hari ke-35 HST',
        method: 'kocor',
        description: 'Kocor nutrisi generatif pembentukan tongkol super',
        patenSachets: s7Sachets,
        waterLiters: kocorWater3,
        sprayTanks: Math.ceil(kocorWater3 / 16),
        insekMl: 0,
        chemicalCompanion: 'Tanpa pupuk kimia (Full Paten)',
        chemicalAmountKg: 0,
        notes: '2 sachet Paten Gold per 20 liter air kocor (50ml/pohon).',
      });
    } else {
      // MODE IRIT JAGUNG (0.5 Ha & Skala Are)
      // Fokus semprot foliar basah + kocor terarah piringan hemat air (efisiensi 65%)
      const iritKocorWater = Math.max(80, Math.round(1200 * areaHa)); // misal 600L untuk 0.5 ha
      const iritBatches = Math.max(1, Math.round(iritKocorWater / 20));

      // H-5 Semprot
      const s1 = sprayTanksPerApp * 1;
      steps.push({
        day: 5,
        label: 'Hari ke-5 HST',
        method: 'semprot',
        description: 'Semprot pencegah bule (Mode Irit)',
        patenSachets: s1,
        waterLiters: waterPerSprayApp,
        sprayTanks: sprayTanksPerApp,
        insekMl: 0,
        chemicalCompanion: '-',
        chemicalAmountKg: 0,
        notes: '1 sachet / tangki 16L. Semprot merata pagi hari.',
      });

      // H-12 Kocor Piringan Hemat
      const s2 = Math.round(iritBatches * 1);
      const u1 = Math.round(iritBatches * 0.3 * 10) / 10;
      steps.push({
        day: 12,
        label: 'Hari ke-12 HST',
        method: 'kocor',
        description: 'Kocor terarah piringan hemat air (15-20ml/pohon)',
        patenSachets: s2,
        waterLiters: iritKocorWater,
        sprayTanks: Math.ceil(iritKocorWater / 16),
        insekMl: 0,
        chemicalCompanion: 'Urea hemat (1.5 gelas/20L)',
        chemicalAmountKg: u1,
        notes: 'Aplikasi terarah di zona perakaran, hemat air 65%.',
      });

      // H-14 Semprot + Insek
      const s3 = sprayTanksPerApp * 1;
      steps.push({
        day: 14,
        label: 'Hari ke-14 HST',
        method: 'semprot',
        description: 'Semprot nutrisi foliar + insek ulat',
        patenSachets: s3,
        waterLiters: waterPerSprayApp,
        sprayTanks: sprayTanksPerApp,
        insekMl: sprayTanksPerApp * 10,
        chemicalCompanion: '-',
        chemicalAmountKg: 0,
        notes: '1 sachet + 10ml insek per tangki 16L.',
      });

      // H-21 Semprot + Insek
      const s4 = sprayTanksPerApp * 1;
      steps.push({
        day: 21,
        label: 'Hari ke-21 HST',
        method: 'semprot',
        description: 'Semprot nutrisi pembesaran + insek',
        patenSachets: s4,
        waterLiters: waterPerSprayApp,
        sprayTanks: sprayTanksPerApp,
        insekMl: sprayTanksPerApp * 10,
        chemicalCompanion: '-',
        chemicalAmountKg: 0,
        notes: '1 sachet + 10ml insek per tangki 16L.',
      });

      // H-26 Kocor Piringan Hemat
      const s5 = Math.round(iritBatches * 1);
      const u2 = Math.round(iritBatches * 0.3 * 10) / 10;
      steps.push({
        day: 26,
        label: 'Hari ke-26 HST',
        method: 'kocor',
        description: 'Kocor nutrisi piringan vegetatif akhir',
        patenSachets: s5,
        waterLiters: iritKocorWater,
        sprayTanks: Math.ceil(iritKocorWater / 16),
        insekMl: 0,
        chemicalCompanion: 'Urea hemat (1.5 gelas/20L)',
        chemicalAmountKg: u2,
        notes: 'Kocor terarah dekat batang piringan tanam.',
      });

      // H-28 Semprot + Insek
      const s6 = sprayTanksPerApp * 1;
      steps.push({
        day: 28,
        label: 'Hari ke-28 HST',
        method: 'semprot',
        description: 'Semprot perlindungan fase bunting',
        patenSachets: s6,
        waterLiters: waterPerSprayApp,
        sprayTanks: sprayTanksPerApp,
        insekMl: sprayTanksPerApp * 10,
        chemicalCompanion: '-',
        chemicalAmountKg: 0,
        notes: '1 sachet + 10ml insek per tangki 16L.',
      });

      // H-35 Kocor / Semprot Batang Generatif Hemat
      const s7 = Math.round(iritBatches * 1.2);
      steps.push({
        day: 35,
        label: 'Hari ke-35 HST',
        method: 'kocor',
        description: 'Kocor / spuyer pangkal batang pengisian tongkol',
        patenSachets: s7,
        waterLiters: iritKocorWater,
        sprayTanks: Math.ceil(iritKocorWater / 16),
        insekMl: 0,
        chemicalCompanion: 'Tanpa kimia',
        chemicalAmountKg: 0,
        notes: 'Nutrisi nano cepat serap untuk bobot rendemen tongkol.',
      });
    }
  } else if (crop === 'tembakau') {
    if (mode === 'full_populasi') {
      // TEMBAKAU FULL POPULASI (100ml / pohon kocor ke seluruh 20.000 pohon/ha)
      const kocorWaterTobacco = Math.round(population * 0.1); // 100ml = 0.1 L
      const batchesTobacco = Math.max(1, Math.round(kocorWaterTobacco / 20));

      // 1. H-14 Kocor (1 sachet Paten Gold + ZA 1 gelas ~0.2kg + 20L air)
      const s1 = batchesTobacco * 1;
      const zaKg1 = Math.round(batchesTobacco * 0.2 * 10) / 10;
      steps.push({
        day: 14,
        label: 'Hari ke-14 HST',
        method: 'kocor',
        description: 'Pemupukan kocor 100ml/pohon (Paten + ZA 1 gelas + air 20L)',
        patenSachets: s1,
        waterLiters: kocorWaterTobacco,
        sprayTanks: Math.ceil(kocorWaterTobacco / 16),
        insekMl: 0,
        chemicalCompanion: 'ZA (1 gelas/20L)',
        chemicalAmountKg: zaKg1,
        notes: '100ml per pohon langsung ke zona perakaran tembakau muda.',
      });

      // 2. H-28 Kocor (1 sachet Paten Gold + NPK 1 gelas ~0.2kg + 20L air)
      const s2 = batchesTobacco * 1;
      const npkKg1 = Math.round(batchesTobacco * 0.2 * 10) / 10;
      steps.push({
        day: 28,
        label: 'Hari ke-28 HST',
        method: 'kocor',
        description: 'Pemupukan kocor 100ml/pohon (Paten + NPK 1 gelas + air 20L)',
        patenSachets: s2,
        waterLiters: kocorWaterTobacco,
        sprayTanks: Math.ceil(kocorWaterTobacco / 16),
        insekMl: 0,
        chemicalCompanion: 'NPK (1 gelas/20L)',
        chemicalAmountKg: npkKg1,
        notes: 'Merangsang pembesaran helaian daun tembakau.',
      });

      // 3. H-30 Kocor Ulang (1 sachet Paten Gold + NPK 1 gelas + 20L air)
      const s3 = batchesTobacco * 1;
      const npkKg2 = Math.round(batchesTobacco * 0.2 * 10) / 10;
      steps.push({
        day: 30,
        label: 'Hari ke-30 HST',
        method: 'kocor',
        description: 'Pemupukan kocor lanjutan 100ml/pohon (Paten + NPK 1 gelas)',
        patenSachets: s3,
        waterLiters: kocorWaterTobacco,
        sprayTanks: Math.ceil(kocorWaterTobacco / 16),
        insekMl: 0,
        chemicalCompanion: 'NPK (1 gelas/20L)',
        chemicalAmountKg: npkKg2,
        notes: 'Kocorkan 100ml/pohon untuk penebalan lamina daun.',
      });

      // 4. Penyemprotan Rutin 7 Hari Sekali (H-7 s/d H-49, 7 kali siklus)
      // Brosur: 1 sachet Paten Gold + Insek + air 60 liter
      const sprayWaterPerCycle = Math.max(30, Math.round(60 * areaHa)); // ~60L per Ha atau ~30L per 0.5 ha
      const spraySachetsPerCycle = Math.max(1, Math.round(sprayWaterPerCycle / 60));
      const insekPerCycle = Math.max(10, Math.round(sprayWaterPerCycle * 0.3)); // 15-20ml / 60L

      const sprayDays = [7, 14, 21, 28, 35, 42, 49];
      sprayDays.forEach((d) => {
        steps.push({
          day: d,
          label: `Hari ke-${d} HST`,
          method: 'semprot',
          description: `Penyemprotan rutin 7 harian (Paten + Insek + air 60L)`,
          patenSachets: spraySachetsPerCycle,
          waterLiters: sprayWaterPerCycle,
          sprayTanks: Math.ceil(sprayWaterPerCycle / 16),
          insekMl: insekPerCycle,
          chemicalCompanion: '-',
          chemicalAmountKg: 0,
          notes: 'Melindungi daun tembakau dari ulat grayak, kutu kebul & thrips.',
        });
      });
    } else {
      // MODE IRIT TEMBAKAU (0.5 Ha & Skala Are)
      // Kocor hemat piringan terarah (~40ml/pohon) + semprot 7 hari sekali
      const iritKocorWater = Math.max(100, Math.round(800 * areaHa)); // ~400L untuk 0.5 ha
      const iritBatches = Math.max(1, Math.round(iritKocorWater / 20));

      // H-14 Kocor Irit (ZA)
      const s1 = iritBatches * 1;
      const zaKg = Math.round(iritBatches * 0.2 * 10) / 10;
      steps.push({
        day: 14,
        label: 'Hari ke-14 HST',
        method: 'kocor',
        description: 'Kocor irit terarah piringan tembakau (Paten + ZA)',
        patenSachets: s1,
        waterLiters: iritKocorWater,
        sprayTanks: Math.ceil(iritKocorWater / 16),
        insekMl: 0,
        chemicalCompanion: 'ZA (1 gelas/20L)',
        chemicalAmountKg: zaKg,
        notes: 'Kocor terarah ke lubang tanam piringan pohon.',
      });

      // H-28 Kocor Irit (NPK)
      const s2 = iritBatches * 1;
      const npkKg1 = Math.round(iritBatches * 0.2 * 10) / 10;
      steps.push({
        day: 28,
        label: 'Hari ke-28 HST',
        method: 'kocor',
        description: 'Kocor irit terarah piringan (Paten + NPK)',
        patenSachets: s2,
        waterLiters: iritKocorWater,
        sprayTanks: Math.ceil(iritKocorWater / 16),
        insekMl: 0,
        chemicalCompanion: 'NPK (1 gelas/20L)',
        chemicalAmountKg: npkKg1,
        notes: 'Aplikasi hemat presisi nutrisi NPK mikro.',
      });

      // H-30 Kocor Irit Lanjutan (NPK)
      const s3 = iritBatches * 1;
      const npkKg2 = Math.round(iritBatches * 0.2 * 10) / 10;
      steps.push({
        day: 30,
        label: 'Hari ke-30 HST',
        method: 'kocor',
        description: 'Kocor irit lanjutan (Paten + NPK)',
        patenSachets: s3,
        waterLiters: iritKocorWater,
        sprayTanks: Math.ceil(iritKocorWater / 16),
        insekMl: 0,
        chemicalCompanion: 'NPK (1 gelas/20L)',
        chemicalAmountKg: npkKg2,
        notes: 'Pemberian nutrisi penguat helaian daun.',
      });

      // Semprot rutin 7 hari sekali (7 siklus)
      const sprayWaterPerCycle = Math.max(25, Math.round(50 * areaHa));
      const spraySachetsPerCycle = 1;
      const insekPerCycle = Math.max(10, Math.round(sprayWaterPerCycle * 0.3));

      const sprayDays = [7, 14, 21, 28, 35, 42, 49];
      sprayDays.forEach((d) => {
        steps.push({
          day: d,
          label: `Hari ke-${d} HST`,
          method: 'semprot',
          description: `Semprot rutin 7 harian (Paten + Insek + air 60L)`,
          patenSachets: spraySachetsPerCycle,
          waterLiters: sprayWaterPerCycle,
          sprayTanks: Math.ceil(sprayWaterPerCycle / 16),
          insekMl: insekPerCycle,
          chemicalCompanion: '-',
          chemicalAmountKg: 0,
          notes: 'Semprot halus merata untuk proteksi daun tembakau.',
        });
      });
    }
  } else if (crop === 'padi') {
    // PADI
    // Brosur Padi:
    // H-5: 2 sachet Paten Gold / tangki 16-20L. Semprot kasar.
    // H-12-15: 3 sachet Paten Gold + Insek / tangki. Semprot kasar.
    // H-28: 3 sachet Paten Gold + Insek / tangki. Semprot kasar.
    // H-50: 3 sachet Paten Gold + Insek / tangki. Semprot kasar.
    // H-70: 3 sachet Paten Gold + Insek / tangki. Semprot kasar.
    // Catatan Brosur: Jika menambahkan ZA/Urea 1 gelas per tangki, maka Paten Gold cukup 1 sachet per tangki!
    const sprayTanksPadi = Math.max(1, Math.round(10 * areaHa));
    const waterPadiApp = sprayTanksPadi * 16;
    const insekPadiMl = sprayTanksPadi * 10;

    if (mode === 'irit') {
      // MODE IRIT PADI: Menggunakan formula brosur (1 sachet + 1 gelas ZA/Urea per tangki)
      const ureaKgPerApp = Math.round(sprayTanksPadi * 0.2 * 10) / 10; // 1 gelas ~0.2 kg

      // H-5
      steps.push({
        day: 5,
        label: 'Hari ke-5 HST',
        method: 'semprot',
        description: 'Semprot kasar awal anakan (Paten 1 sachet + Urea/ZA 1 gelas)',
        patenSachets: sprayTanksPadi * 1,
        waterLiters: waterPadiApp,
        sprayTanks: sprayTanksPadi,
        insekMl: 0,
        chemicalCompanion: 'Urea/ZA (1 gelas/tangki)',
        chemicalAmountKg: ureaKgPerApp,
        notes: 'Mode Irit resmi brosur: 1 sachet Paten + 1 gelas pupuk starter per tangki.',
      });

      // H-14
      steps.push({
        day: 14,
        label: 'Hari ke-12-15 HST',
        method: 'semprot',
        description: 'Semprot kasar anakan aktif + insek sundep/wereng',
        patenSachets: sprayTanksPadi * 1,
        waterLiters: waterPadiApp,
        sprayTanks: sprayTanksPadi,
        insekMl: insekPadiMl,
        chemicalCompanion: 'Urea/ZA (1 gelas/tangki)',
        chemicalAmountKg: ureaKgPerApp,
        notes: 'Semprot kasar 1 sachet Paten + 1 gelas Urea/ZA + Insek per tangki.',
      });

      // H-28
      steps.push({
        day: 28,
        label: 'Hari ke-28 HST',
        method: 'semprot',
        description: 'Semprot kasar maksimalisasi jumlah anakan produktif',
        patenSachets: sprayTanksPadi * 1,
        waterLiters: waterPadiApp,
        sprayTanks: sprayTanksPadi,
        insekMl: insekPadiMl,
        chemicalCompanion: 'Urea/ZA (1 gelas/tangki)',
        chemicalAmountKg: ureaKgPerApp,
        notes: 'Memperbanyak anakan padi aktif.',
      });

      // H-50
      steps.push({
        day: 50,
        label: 'Hari ke-50 HST',
        method: 'semprot',
        description: 'Semprot kasar fase bunting / persiapan malai padi',
        patenSachets: sprayTanksPadi * 1,
        waterLiters: waterPadiApp,
        sprayTanks: sprayTanksPadi,
        insekMl: insekPadiMl,
        chemicalCompanion: 'Urea/ZA (1 gelas/tangki)',
        chemicalAmountKg: ureaKgPerApp,
        notes: 'Mencegah bulir hampa dan memanjangkan malai.',
      });

      // H-70
      steps.push({
        day: 70,
        label: 'Hari ke-70 HST',
        method: 'semprot',
        description: 'Semprot kasar pengisian bulir padi bernas kuning merata',
        patenSachets: sprayTanksPadi * 1,
        waterLiters: waterPadiApp,
        sprayTanks: sprayTanksPadi,
        insekMl: insekPadiMl,
        chemicalCompanion: 'Urea/ZA (1 gelas/tangki)',
        chemicalAmountKg: ureaKgPerApp,
        notes: 'Pengisian bulir padi hingga pangkal malai.',
      });
    } else {
      // MODE STANDAR / MURNI PATEN PADI (Tanpa Campuran ZA/Urea)
      // H-5: 2 sachet / tangki
      steps.push({
        day: 5,
        label: 'Hari ke-5 HST',
        method: 'semprot',
        description: 'Semprot kasar awal anakan (2 sachet Paten / tangki)',
        patenSachets: sprayTanksPadi * 2,
        waterLiters: waterPadiApp,
        sprayTanks: sprayTanksPadi,
        insekMl: 0,
        chemicalCompanion: 'Tanpa pupuk kimia',
        chemicalAmountKg: 0,
        notes: '2 sachet Paten Gold per tangki 16-20L tanpa pupuk kimia.',
      });

      // H-14: 3 sachet + insek
      steps.push({
        day: 14,
        label: 'Hari ke-12-15 HST',
        method: 'semprot',
        description: 'Semprot kasar anakan aktif (3 sachet + Insek per tangki)',
        patenSachets: sprayTanksPadi * 3,
        waterLiters: waterPadiApp,
        sprayTanks: sprayTanksPadi,
        insekMl: insekPadiMl,
        chemicalCompanion: 'Tanpa pupuk kimia',
        chemicalAmountKg: 0,
        notes: '3 sachet Paten Gold + Insek per tangki 16-20L.',
      });

      // H-28: 3 sachet + insek
      steps.push({
        day: 28,
        label: 'Hari ke-28 HST',
        method: 'semprot',
        description: 'Semprot kasar pembentukan anakan produktif (3 sachet + Insek)',
        patenSachets: sprayTanksPadi * 3,
        waterLiters: waterPadiApp,
        sprayTanks: sprayTanksPadi,
        insekMl: insekPadiMl,
        chemicalCompanion: 'Tanpa pupuk kimia',
        chemicalAmountKg: 0,
        notes: '3 sachet Paten Gold + Insek per tangki 16-20L.',
      });

      // H-50: 3 sachet + insek
      steps.push({
        day: 50,
        label: 'Hari ke-50 HST',
        method: 'semprot',
        description: 'Semprot kasar bunting/malai (3 sachet + Insek)',
        patenSachets: sprayTanksPadi * 3,
        waterLiters: waterPadiApp,
        sprayTanks: sprayTanksPadi,
        insekMl: insekPadiMl,
        chemicalCompanion: 'Tanpa pupuk kimia',
        chemicalAmountKg: 0,
        notes: '3 sachet Paten Gold + Insek per tangki 16-20L.',
      });

      // H-70: 3 sachet + insek
      steps.push({
        day: 70,
        label: 'Hari ke-70 HST',
        method: 'semprot',
        description: 'Semprot kasar pengisian bulir (3 sachet + Insek)',
        patenSachets: sprayTanksPadi * 3,
        waterLiters: waterPadiApp,
        sprayTanks: sprayTanksPadi,
        insekMl: insekPadiMl,
        chemicalCompanion: 'Tanpa pupuk kimia',
        chemicalAmountKg: 0,
        notes: '3 sachet Paten Gold + Insek per tangki 16-20L.',
      });
    }
  } else if (crop === 'hortikultura') {
    // HORTIKULTURA (Cabe, Tomat, Terong, Melon, Semangka, Timun, Labu, Oyong)
    // Sesuai Brosur Baru: Paten Hijau + Paten Imun
    const sprayTanksHorti = Math.max(1, Math.round(10 * areaHa));
    const waterHortiApp = sprayTanksHorti * 16;
    const insekHortiMl = sprayTanksHorti * 10;

    // 1. Sebelum Penanaman (H-2 Sebelum Tanam): Semprot tanah/lahan dengan Imun 3 saset/tangki
    steps.push({
      day: 0,
      label: 'H-2 Pra-Tanam',
      method: 'semprot',
      description: 'Sterilisasi lahan & tanah dengan Paten Imun (3 sachet/tangki 16L)',
      patenSachets: sprayTanksHorti * 3, // Imun 3 sachet per tangki
      waterLiters: waterHortiApp,
      sprayTanks: sprayTanksHorti,
      insekMl: 0,
      chemicalCompanion: '-',
      chemicalAmountKg: 0,
      notes: 'Brosur: Semprot tanah & sekitarnya 2 hari sebelum bibit ditanam untuk imunisasi lahan.',
    });

    if (mode === 'full_populasi') {
      // FULL POPULASI: Kocor 50ml/pohon ke semua 18.000 pohon/ha
      const kocorWaterHorti = Math.round(population * 0.05); // 50ml = 0.05 L
      const batchesHorti = Math.max(1, Math.round(kocorWaterHorti / 16));
      // Formula kocor: 1 sachet Paten Hijau + 1 sachet Imun per 16L air = 2 sachet per batch!
      const kocorSachets = batchesHorti * 2;

      // Kocor H-7
      steps.push({
        day: 7,
        label: 'Hari ke-7 HST',
        method: 'kocor',
        description: 'Kocor awal perakaran (1 sachet Paten Hijau + 1 sachet Imun / 16L)',
        patenSachets: kocorSachets,
        waterLiters: kocorWaterHorti,
        sprayTanks: Math.ceil(kocorWaterHorti / 16),
        insekMl: 0,
        chemicalCompanion: '-',
        chemicalAmountKg: 0,
        notes: 'Kocorkan 50 ml per tanaman ke lubang tanam piringan.',
      });

      // Kocor tiap 15-20 hari: H-25, H-45, H-65
      [25, 45, 65].forEach((d) => {
        steps.push({
          day: d,
          label: `Hari ke-${d} HST`,
          method: 'kocor',
          description: `Kocor berkala nutrisi & imunisasi (Paten Hijau 1 + Imun 1 / 16L)`,
          patenSachets: kocorSachets,
          waterLiters: kocorWaterHorti,
          sprayTanks: Math.ceil(kocorWaterHorti / 16),
          insekMl: 0,
          chemicalCompanion: '-',
          chemicalAmountKg: 0,
          notes: 'Kocor 50 ml per tanaman menjaga pembungaan dan pembuahan lebat tanpa rontok.',
        });
      });
    } else {
      // MODE IRIT HORTIKULTURA: Kocor piringan terarah hemat air (20-25 ml/pohon atau larutan pekat)
      const iritKocorWater = Math.max(60, Math.round(450 * areaHa)); // ~225L untuk 0.5 ha
      const iritBatches = Math.max(1, Math.round(iritKocorWater / 16));
      const iritKocorSachets = iritBatches * 2; // Paten Hijau 1 + Imun 1

      // Kocor H-7
      steps.push({
        day: 7,
        label: 'Hari ke-7 HST',
        method: 'kocor',
        description: 'Kocor terarah piringan hemat (Paten Hijau 1 + Imun 1 / 16L)',
        patenSachets: iritKocorSachets,
        waterLiters: iritKocorWater,
        sprayTanks: Math.ceil(iritKocorWater / 16),
        insekMl: 0,
        chemicalCompanion: '-',
        chemicalAmountKg: 0,
        notes: 'Kocor terarah dekat pangkal akar tanaman muda.',
      });

      [25, 45, 65].forEach((d) => {
        steps.push({
          day: d,
          label: `Hari ke-${d} HST`,
          method: 'kocor',
          description: `Kocor irit berkala piringan (Paten Hijau 1 + Imun 1 / 16L)`,
          patenSachets: iritKocorSachets,
          waterLiters: iritKocorWater,
          sprayTanks: Math.ceil(iritKocorWater / 16),
          insekMl: 0,
          chemicalCompanion: '-',
          chemicalAmountKg: 0,
          notes: 'Aplikasi terarah piringan hemat air dan efisien sachet.',
        });
      });
    }

    // Semprot Rutin Setiap 7 Hari Sekali hingga Panen (10 siklus: H-7 s/d H-70)
    // Formula brosur: 1 sachet Paten Hijau + 1 sachet Imun + Insek per tangki = 2 sachet per tangki
    const hortiSprayDays = [7, 14, 21, 28, 35, 42, 49, 56, 63, 70];
    hortiSprayDays.forEach((d) => {
      steps.push({
        day: d,
        label: `Hari ke-${d} HST`,
        method: 'semprot',
        description: 'Semprot rutin 7 harian (Paten Hijau 1 sct + Imun 1 sct + Insek per tangki)',
        patenSachets: sprayTanksHorti * 2,
        waterLiters: waterHortiApp,
        sprayTanks: sprayTanksHorti,
        insekMl: insekHortiMl,
        chemicalCompanion: '-',
        chemicalAmountKg: 0,
        notes: 'Melindungi bunga & buah dari lalat buah, thrips, antraknosa (patek), dan virus kuning.',
      });
    });
  }

  // Agregasi seluruh steps
  steps.forEach((step) => {
    totalPatenSachets += step.patenSachets;
    totalWaterLiters += step.waterLiters;
    totalSprayTanks += step.sprayTanks;
    totalInsekMl += step.insekMl;

    if (step.chemicalCompanion.includes('Urea')) {
      totalUreaKg += step.chemicalAmountKg;
    } else if (step.chemicalCompanion.includes('ZA')) {
      totalZaKg += step.chemicalAmountKg;
    } else if (step.chemicalCompanion.includes('NPK')) {
      totalNpkKg += step.chemicalAmountKg;
    }
  });

  const totalPatenBoxes = totalPatenSachets / 24;
  const totalPatenBoxesRounded = Math.ceil(totalPatenBoxes);
  const totalInsekBottles = Math.ceil(totalInsekMl / 100);

  // Perhitungan Biaya Paten Gold System
  const sachetPrice = params.patenBoxPrice / 24;
  const patenCost = totalPatenBoxesRounded * params.patenBoxPrice;
  const companionCost =
    totalUreaKg * params.ureaPricePerKg +
    totalZaKg * params.zaPricePerKg +
    totalNpkKg * params.npkPricePerKg;
  const insekCost = totalInsekBottles * params.insekPricePer100ml;
  const waterCost = Math.round((totalWaterLiters / 1000) * params.waterCostPer1000L);
  // Tenaga kerja sistem Paten: jauh lebih ringan dibanding panggul ratusan kg karung pupuk
  // Estimasi HOK aplikasi semprot/kocor
  const patenLaborHok = Math.max(1, Math.round(totalSprayTanks / 8));
  const patenLaborCost = patenLaborHok * params.laborRatePerHok;

  const totalPatenSystemCost =
    patenCost + companionCost + insekCost + waterCost + patenLaborCost;

  // Pembanding Konvensional (Kimia Murni 100%)
  const convFertCost = Math.round(cropMeta.conventionalFertilizerCostPerHa * areaHa);
  const convPestCost = Math.round(cropMeta.conventionalPesticideCostPerHa * areaHa);
  const convLaborCost = Math.round(cropMeta.conventionalLaborCostPerHa * areaHa);
  const totalConventionalCost = convFertCost + convPestCost + convLaborCost;

  const costDifference = totalConventionalCost - totalPatenSystemCost;
  const costSavingPercent =
    totalConventionalCost > 0
      ? Math.round((costDifference / totalConventionalCost) * 1000) / 10
      : 0;

  // Hasil Panen (Yield) & Pendapatan (Revenue)
  let conventionalYield = Math.round(cropMeta.standardYieldPerHaConventional * areaHa);
  let patenYield = Math.round(cropMeta.standardYieldPerHaPaten * areaHa);

  if (customTargets?.customConventionalYieldTonPerHa && customTargets.customConventionalYieldTonPerHa > 0) {
    conventionalYield = Math.round(customTargets.customConventionalYieldTonPerHa * 1000 * areaHa);
  }
  if (customTargets?.customPatenYieldTonPerHa && customTargets.customPatenYieldTonPerHa > 0) {
    patenYield = Math.round(customTargets.customPatenYieldTonPerHa * 1000 * areaHa);
  }

  const yieldIncreaseKg = patenYield - conventionalYield;
  const yieldIncreasePercent =
    conventionalYield > 0
      ? Math.round((yieldIncreaseKg / conventionalYield) * 1000) / 10
      : 0;

  let sellingPrice =
    crop === 'jagung'
      ? params.sellingPriceCornPerKg
      : crop === 'padi'
      ? params.sellingPriceRicePerKg
      : crop === 'tembakau'
      ? params.sellingPriceTobaccoPerKg
      : params.sellingPriceHortiPerKg;

  if (customTargets?.customSellingPricePerKg && customTargets.customSellingPricePerKg > 0) {
    sellingPrice = customTargets.customSellingPricePerKg;
  }

  const conventionalRevenue = conventionalYield * sellingPrice;
  const patenRevenue = patenYield * sellingPrice;
  const revenueDifference = patenRevenue - conventionalRevenue;

  // Laba Bersih & ROI
  const conventionalNetProfit = conventionalRevenue - totalConventionalCost;
  const patenNetProfit = patenRevenue - totalPatenSystemCost;
  const netProfitIncrease = patenNetProfit - conventionalNetProfit;
  const netProfitIncreasePercent =
    conventionalNetProfit > 0
      ? Math.round((netProfitIncrease / conventionalNetProfit) * 1000) / 10
      : 0;

  const conventionalRoi =
    totalConventionalCost > 0
      ? Math.round((conventionalNetProfit / totalConventionalCost) * 1000) / 10
      : 0;
  const patenRoi =
    totalPatenSystemCost > 0
      ? Math.round((patenNetProfit / totalPatenSystemCost) * 1000) / 10
      : 0;

  const conventionalBcRatio =
    totalConventionalCost > 0
      ? Math.round((conventionalRevenue / totalConventionalCost) * 100) / 100
      : 0;
  const patenBcRatio =
    totalPatenSystemCost > 0
      ? Math.round((patenRevenue / totalPatenSystemCost) * 100) / 100
      : 0;

  return {
    crop,
    mode,
    areaAre,
    areaHa,
    population,
    totalPatenSachets,
    totalPatenBoxes: Math.round(totalPatenBoxes * 10) / 10,
    totalPatenBoxesRounded,
    totalWaterLiters,
    totalSprayTanks,
    totalInsekMl,
    totalInsekBottles,
    totalUreaKg: Math.round(totalUreaKg * 10) / 10,
    totalZaKg: Math.round(totalZaKg * 10) / 10,
    totalNpkKg: Math.round(totalNpkKg * 10) / 10,
    steps,
    patenCost,
    chemicalCompanionCost: companionCost,
    insekCost,
    waterCost,
    patenLaborCost,
    totalPatenSystemCost,
    conventionalFertilizerCost: convFertCost,
    conventionalPesticideCost: convPestCost,
    conventionalLaborCost: convLaborCost,
    totalConventionalCost,
    costDifference,
    costSavingPercent,
    conventionalYield,
    patenYield,
    yieldIncreaseKg,
    yieldIncreasePercent,
    conventionalRevenue,
    patenRevenue,
    revenueDifference,
    conventionalNetProfit,
    patenNetProfit,
    netProfitIncrease,
    netProfitIncreasePercent,
    conventionalRoi,
    patenRoi,
    conventionalBcRatio,
    patenBcRatio,
  };
}

/**
 * Buat matriks komparasi rentang 10 Are sampai 100 Are
 */
export function generateAreaMatrix(
  crop: CropType,
  mode: CalculationMode,
  params: CostParameters,
  customTargets?: UserYieldTarget
): AreaMatrixRow[] {
  const areas = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  return areas.map((are) => {
    const sim = calculateSimulation(crop, are, mode, params, customTargets);
    const companionKg = sim.totalUreaKg + sim.totalZaKg + sim.totalNpkKg;
    return {
      areaAre: are,
      areaHa: sim.areaHa,
      population: sim.population,
      patenSachets: sim.totalPatenSachets,
      patenBoxes: sim.totalPatenBoxesRounded,
      waterLiters: sim.totalWaterLiters,
      insekMl: sim.totalInsekMl,
      companionFertilizerKg: Math.round(companionKg * 10) / 10,
      patenTotalCost: sim.totalPatenSystemCost,
      conventionalTotalCost: sim.totalConventionalCost,
      costSavings: sim.costDifference,
      savingsPercent: sim.costSavingPercent,
      patenNetProfit: sim.patenNetProfit,
      roi: sim.patenRoi,
    };
  });
}
