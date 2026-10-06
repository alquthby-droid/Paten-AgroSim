import { CropInfo, CostParameters } from '../types';

export const CROP_METADATA: Record<string, CropInfo> = {
  jagung: {
    id: 'jagung',
    name: 'Jagung Hibrida / Manis',
    scientificName: 'Zea mays',
    standardPopulationPerHa: 70000, // 70.000 pohon/ha
    typicalCycleDays: 100,
    description: 'Populasi 70.000 pohon/Ha. Protokol pencegahan virus bule H-5, 3x kocor nutrisi (H-12, H-26, H-35), dan 3x semprot perlindungan insek (H-14, H-21, H-28).',
    unitProduce: 'kg pipil kering',
    standardYieldPerHaConventional: 7000, // 7 ton
    standardYieldPerHaPaten: 9200, // 9.2 ton (+31.4%)
    sellingPricePerUnit: 5200, // Rp 5.200 / kg jagung pipil kering
    conventionalFertilizerCostPerHa: 4800000, // Urea 350kg + NPK 300kg + SP36
    conventionalPesticideCostPerHa: 1400000, // Insek & herbisida kimia
    conventionalLaborCostPerHa: 3000000, // Ongkos angkut karung & tabur pupuk berat
  },
  padi: {
    id: 'padi',
    name: 'Padi Sawah (Inpari / Ciherang)',
    scientificName: 'Oryza sativa',
    standardPopulationPerHa: 200000, // rumpun per ha (jarak 25x25 atau legowo)
    typicalCycleDays: 110,
    description: 'Protokol semprot kasar H-5, H-12-15, H-28, H-50, dan H-70. Dilengkapi opsi Mode Irit (1 sachet Paten + 1 gelas ZA/Urea per tangki).',
    unitProduce: 'kg GKP (Gabah Kering Panen)',
    standardYieldPerHaConventional: 5800, // 5.8 ton GKP
    standardYieldPerHaPaten: 7800, // 7.8 ton GKP (+34.5%)
    sellingPricePerUnit: 6800, // Rp 6.800 / kg GKP
    conventionalFertilizerCostPerHa: 4200000, // Urea 250kg + NPK Phonska 300kg + ZA 100kg
    conventionalPesticideCostPerHa: 1600000, // Fungisida, insektisida kimia tinggi
    conventionalLaborCostPerHa: 2800000, // Buruh tabur pupuk 3 tahap
  },
  tembakau: {
    id: 'tembakau',
    name: 'Tembakau (Virginia / Kasturi / Rajangan)',
    scientificName: 'Nicotiana tabacum',
    standardPopulationPerHa: 20000, // 20.000 pohon/ha
    typicalCycleDays: 75,
    description: 'Populasi 20.000 pohon/Ha. Pemupukan kocor H-14 (ZA), H-28 (NPK), H-30 (NPK) @ 100ml/pohon, serta penyemprotan rutin 7 hari sekali (Paten + Insek + air 60L).',
    unitProduce: 'kg rajangan kering kualitas super',
    standardYieldPerHaConventional: 1200, // 1.2 ton rajangan kering
    standardYieldPerHaPaten: 1550, // 1.55 ton rajangan kering (+29.2% + grade mutu meningkat)
    sellingPricePerUnit: 65000, // Rp 65.000 / kg kering
    conventionalFertilizerCostPerHa: 6500000, // Pupuk khusus ZA + NPK + KNO3 kimia
    conventionalPesticideCostPerHa: 2200000, // Insek ulat kipat, kutu kebul rutin
    conventionalLaborCostPerHa: 4500000, // Tenaga kerja intensif
  },
  hortikultura: {
    id: 'hortikultura',
    name: 'Hortikultura (Cabe, Tomat, Melon & Sayur Buah)',
    scientificName: 'Capsicum annuum, Solanum lycopersicum, Cucumis melo',
    standardPopulationPerHa: 18000, // 18.000 pohon/ha
    typicalCycleDays: 100,
    description: 'Protokol Brosur Paten Hijau + Imun: Sterilisasi lahan H-2 (Imun 3 sachet/tangki), Kocor H-7 & tiap 15-20 hari (Paten Hijau 1 + Imun 1 @ 50ml/pohon), dan Semprot rutin 7 hari sekali (Paten Hijau 1 + Imun 1 + Insek).',
    unitProduce: 'kg panen segar (Cabe/Tomat/Melon)',
    standardYieldPerHaConventional: 12000, // 12 Ton/ha
    standardYieldPerHaPaten: 16800, // 16.8 Ton/ha (+40%)
    sellingPricePerUnit: 28000, // Rp 28.000/kg
    conventionalFertilizerCostPerHa: 7800000, // Pupuk kimia kocor NPK + KNO3 + kalsium
    conventionalPesticideCostPerHa: 3800000, // Insektisida thrips/tungau & fungisida patek
    conventionalLaborCostPerHa: 4800000, // Buruh intensif
  },
};

export const DEFAULT_COST_PARAMETERS: CostParameters = {
  patenBoxPrice: 200000, // Rp 200.000 per box (isi 24 sachet = Rp 8.333/sachet)
  ureaPricePerKg: 4000, // Rp 4.000/kg (subsidi rata-rata) atau 7.000 non-subsidi
  zaPricePerKg: 3500, // Rp 3.500/kg
  npkPricePerKg: 5000, // Rp 5.000/kg (Phonska subsidi) s/d 14.000 non-subsidi
  insekPricePer100ml: 65000, // Rp 65.000 / botol 100ml
  waterCostPer1000L: 15000, // Rp 15.000 / 1.000 liter (biaya solar/mesin pompa air)
  laborRatePerHok: 90000, // Rp 90.000 per HOK (Hari Orang Kerja)
  sellingPriceCornPerKg: 5200,
  sellingPriceRicePerKg: 6800,
  sellingPriceTobaccoPerKg: 65000,
  sellingPriceHortiPerKg: 28000,
};

export const MULTI_YEAR_PROJECTIONS = [
  {
    year: 'Musim / Tahun ke-1',
    soilHealth: 'Transisi Remidiasi: pH tanah mulai netral (naik 0.5 - 0.8), residu kimia lama mulai diurai.',
    chemicalFertilizerReduction: '30% - 50%',
    yieldImpact: '+20% hingga +25% di atas rata-rata konvensional',
    costSavings: 'Penghematan Rp 2.5 jt - Rp 4.5 jt / Ha',
    sustainabilityNote: 'Tanaman lebih kokoh, perakaran lebih dalam 30%, ketahanan terhadap penyakit bule & blas meningkat.',
  },
  {
    year: 'Musim / Tahun ke-2',
    soilHealth: 'Tanah Gembur Alami: Koloni mikroba bermanfaat aktif, struktur tanah remah, aerasi optimal.',
    chemicalFertilizerReduction: '50% - 70%',
    yieldImpact: '+25% hingga +35% konsisten panen maksimal',
    costSavings: 'Penghematan Rp 4.0 jt - Rp 6.0 jt / Ha',
    sustainabilityNote: 'Kebutuhan pestisida kimia turun hingga 40% karena imun tanaman meningkat berkat asam amino & hara nano.',
  },
  {
    year: 'Musim / Tahun ke-3+',
    soilHealth: 'Ekosistem Organik Berkelanjutan: Bahan organik tanah mantap, ketergantungan pupuk kimia tinggal starter 15-20%.',
    chemicalFertilizerReduction: '70% - 80%',
    yieldImpact: '+30% hingga +45% bobot biji / daun padat & grade A',
    costSavings: 'Penghematan Rp 5.5 jt - Rp 7.5 jt / Ha',
    sustainabilityNote: 'Lahan menjadi aset subur bernilai tinggi tanpa degradasi lahan asam, hasil panen bebas residu kimia berlebih.',
  },
];
