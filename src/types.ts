export type CropType = 'jagung' | 'padi' | 'tembakau' | 'hortikultura';

export type CalculationMode = 'irit' | 'full_populasi';

export type SeasonType = 'kemarau' | 'hujan';

export interface UserYieldTarget {
  customSellingPricePerKg?: number; // Rp / kg
  customPatenYieldTonPerHa?: number; // Ton / Ha
  customConventionalYieldTonPerHa?: number; // Ton / Ha
}

export interface SeasonalGuidance {
  season: SeasonType;
  optimalSprayHours: string;
  optimalKocorHours: string;
  soilMoistureCondition: string;
  adjuvantAdvice: string;
  waterAdjustmentAdvice: string;
  keyRisks: string[];
  bestPractices: string[];
}

export interface CropInfo {
  id: CropType;
  name: string;
  scientificName: string;
  standardPopulationPerHa: number; // trees or hills per hectare
  typicalCycleDays: number;
  description: string;
  unitProduce: string; // kg, ton, kg krosok
  standardYieldPerHaConventional: number; // in produce unit
  standardYieldPerHaPaten: number; // in produce unit
  sellingPricePerUnit: number; // Rp per kg
  conventionalFertilizerCostPerHa: number; // Rp
  conventionalPesticideCostPerHa: number; // Rp
  conventionalLaborCostPerHa: number; // Rp
}

export interface FieldObservation {
  id: string;
  crop: CropType;
  day: number; // HST
  date?: string;
  plantHeightCm?: number;
  plantVigor?: 'sangat_sehat' | 'normal' | 'kurang_sehat';
  pestObservations: string;
  soilMoistureStatus?: 'lembab_optimal' | 'kering' | 'tergenang';
  applicationStatus: 'sudah_aplikasi' | 'belum_aplikasi';
  notes: string;
}

export interface ApplicationStep {
  day: number;
  label: string; // e.g. "Hari ke-5 HST"
  method: 'semprot' | 'kocor';
  patenSachetsPerBatch: number;
  waterLitersPerBatch: number;
  description: string;
  chemicalCompanion?: string;
  chemicalCompanionAmountPerBatch?: string;
  targetPerTreeMl?: number; // e.g. 50ml or 100ml
  hasInsecticide: boolean;
  notes?: string;
}

export interface CostParameters {
  patenBoxPrice: number; // Rp per box (24 sachets)
  ureaPricePerKg: number; // Rp
  zaPricePerKg: number; // Rp
  npkPricePerKg: number; // Rp
  insekPricePer100ml: number; // Rp
  waterCostPer1000L: number; // Rp (pompa/solar/irigasi)
  laborRatePerHok: number; // Rp per hari orang kerja
  sellingPriceCornPerKg: number; // Rp pipil kering
  sellingPriceRicePerKg: number; // Rp GKP (Gabah Kering Panen)
  sellingPriceTobaccoPerKg: number; // Rp rajangan / krosok kering
  sellingPriceHortiPerKg: number; // Rp sayur buah / cabe / melon / tomat
}

export interface StepRequirement {
  day: number;
  label: string;
  method: 'semprot' | 'kocor';
  description: string;
  patenSachets: number;
  waterLiters: number;
  sprayTanks: number; // 16L equivalents
  insekMl: number;
  chemicalCompanion: string;
  chemicalAmountKg: number;
  notes: string;
}

export interface SimulationSummary {
  crop: CropType;
  mode: CalculationMode;
  areaAre: number;
  areaHa: number;
  population: number;

  // Inputs
  totalPatenSachets: number;
  totalPatenBoxes: number;
  totalPatenBoxesRounded: number;
  totalWaterLiters: number;
  totalSprayTanks: number;
  totalInsekMl: number;
  totalInsekBottles: number; // 100ml bottles rounded
  totalUreaKg: number;
  totalZaKg: number;
  totalNpkKg: number;

  // Step by step details
  steps: StepRequirement[];

  // Cost breakdown Paten System
  patenCost: number;
  chemicalCompanionCost: number;
  insekCost: number;
  waterCost: number;
  patenLaborCost: number;
  totalPatenSystemCost: number;

  // Conventional Comparison
  conventionalFertilizerCost: number;
  conventionalPesticideCost: number;
  conventionalLaborCost: number;
  totalConventionalCost: number;

  // Savings & Efficiency
  costDifference: number; // Conventional - Paten
  costSavingPercent: number; // %

  // Yield & Revenue
  conventionalYield: number; // kg
  patenYield: number; // kg
  yieldIncreaseKg: number;
  yieldIncreasePercent: number;

  conventionalRevenue: number;
  patenRevenue: number;
  revenueDifference: number;

  // Net Profit & ROI
  conventionalNetProfit: number;
  patenNetProfit: number;
  netProfitIncrease: number;
  netProfitIncreasePercent: number;

  conventionalRoi: number; // %
  patenRoi: number; // %
  conventionalBcRatio: number;
  patenBcRatio: number;
}

export interface AreaMatrixRow {
  areaAre: number;
  areaHa: number;
  population: number;
  patenSachets: number;
  patenBoxes: number;
  waterLiters: number;
  insekMl: number;
  companionFertilizerKg: number;
  patenTotalCost: number;
  conventionalTotalCost: number;
  costSavings: number;
  savingsPercent: number;
  patenNetProfit: number;
  roi: number;
}

export type DeficiencySeverity = 'normal' | 'ringan' | 'sedang' | 'berat';

export interface LeafDeficiencyInput {
  nitrogen: DeficiencySeverity; // N
  phosphorus: DeficiencySeverity; // P
  potassium: DeficiencySeverity; // K
  magnesium: DeficiencySeverity; // Mg
}

export interface MapCoordinate {
  lat: number;
  lng: number;
  label?: string;
}

export interface MeasuredLandResult {
  coordinates: MapCoordinate[];
  areaSquareMeters: number;
  areaAre: number;
  areaHa: number;
  perimeterMeters: number;
}

export interface HourlyRainfallForecast {
  timeStr: string;
  hourOffset: number;
  precipitationMm: number;
  precipitationProb: number;
  tempC: number;
  humidity: number;
  windKmH: number;
  weatherCondition: string;
  spraySafetyStatus: 'aman' | 'waspada' | 'bahaya';
}

export interface SprayWindowAdvice {
  decision: 'tunda' | 'waspada' | 'aman_optimal';
  headline: string;
  threeHourRainTotalMm: number;
  maxThreeHourProb: number;
  delayHoursRecommendation: number;
  bestSprayWindowToday: string;
  actionGuidance: string;
  adjuvantAdvice: string;
}


