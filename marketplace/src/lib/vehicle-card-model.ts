export interface VehicleCardModel {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model?: string | null;
  year: number;
  bodyType?: string | null;
  mileage?: number | null;
  mileageUnit?: string | null;
  fuelType?: string | null;
  transmission?: string | null;
  country: string;
  shortDescription?: string | null;
  basePriceEur: number;
  basePriceRub?: number | null;
  primaryImage?: { url: string } | null;
  sourceLabel?: string;
  externalUrl?: string;
  gallery?: { url: string }[];
  engineVolumeCc?: number | null;
  powerHp?: number | null;
  color?: string | null;
}
