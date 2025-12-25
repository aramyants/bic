import type { CalculatorConfig } from '@/db/schema';

export type CalculatorSettings = {
  mode?: string;
  applyToVehicles: boolean;
  logisticsBaseCost: number;
  logisticsCostPerKm: number;
  dutyPercent: number;
  exciseBaseCost: number;
  recyclingBaseCost: number;
  vatPercent: number;
  brokerBaseCost: number;
  commissionPercent: number;
  insurancePercent: number;
  serviceFeeIndividualPercent: number;
  serviceFeeCompanyPercent: number;
  documentPackageCost: number;
};

export const DEFAULT_CALCULATOR_SETTINGS: CalculatorSettings = {
  mode: 'standard',
  applyToVehicles: true,
  logisticsBaseCost: 180_000,
  logisticsCostPerKm: 0,
  dutyPercent: 12,
  exciseBaseCost: 0,
  recyclingBaseCost: 34_000,
  vatPercent: 20,
  brokerBaseCost: 45_000,
  commissionPercent: 5,
  insurancePercent: 1.2,
  serviceFeeIndividualPercent: 0.9,
  serviceFeeCompanyPercent: 1.2,
  documentPackageCost: 45_000,
};

export function toCalculatorSettings(
  config?: CalculatorConfig | null
): CalculatorSettings {
  const defaults = DEFAULT_CALCULATOR_SETTINGS;

  if (!config) {
    return defaults;
  }

  return {
    mode: config.mode ?? defaults.mode,
    applyToVehicles: config.applyToVehicles ?? defaults.applyToVehicles,
    logisticsBaseCost:
      config.logisticsBaseCost ?? defaults.logisticsBaseCost,
    logisticsCostPerKm:
      Number(config.logisticsCostPerKm ?? defaults.logisticsCostPerKm) || 0,
    dutyPercent: Number(config.dutyPercent ?? defaults.dutyPercent),
    exciseBaseCost: config.exciseBaseCost ?? defaults.exciseBaseCost,
    recyclingBaseCost:
      config.recyclingBaseCost ?? defaults.recyclingBaseCost,
    vatPercent: Number(config.vatPercent ?? defaults.vatPercent),
    brokerBaseCost: config.brokerBaseCost ?? defaults.brokerBaseCost,
    commissionPercent: Number(
      config.commissionPercent ?? defaults.commissionPercent
    ),
    insurancePercent: Number(
      config.insurancePercent ?? defaults.insurancePercent
    ),
    serviceFeeIndividualPercent: Number(
      config.serviceFeeIndividualPercent ??
        defaults.serviceFeeIndividualPercent
    ),
    serviceFeeCompanyPercent: Number(
      config.serviceFeeCompanyPercent ?? defaults.serviceFeeCompanyPercent
    ),
    documentPackageCost:
      config.documentPackageCost ?? defaults.documentPackageCost,
  };
}

export function calculateLandedCost({
  baseEur,
  rate,
  logistics,
  dutyPercent,
  excise,
  recycling,
  vatPercent,
  broker,
  commissionPercent,
}: {
  baseEur: number;
  rate: number;
  logistics: number;
  dutyPercent: number;
  excise: number;
  recycling: number;
  vatPercent: number;
  broker: number;
  commissionPercent: number;
}) {
  const baseRub = baseEur * rate;
  const duty = (baseRub * dutyPercent) / 100;
  const vatBase = baseRub + duty + excise + recycling + logistics;
  const vat = (vatBase * vatPercent) / 100;
  const commission = (baseRub * commissionPercent) / 100;

  const total =
    baseRub +
    logistics +
    duty +
    excise +
    recycling +
    vat +
    broker +
    commission;

  return {
    baseRub,
    duty,
    vat,
    commission,
    total,
  };
}

export const CERTIFICATION_COST = 28_000;
