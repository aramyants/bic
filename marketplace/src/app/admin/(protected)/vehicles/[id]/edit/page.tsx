import { notFound } from "next/navigation";

import { VehicleForm } from "@/components/admin/vehicle-form";
import { getVehicleById } from "@/server/vehicle-service";
import { updateVehicleAction, deleteVehicleAction } from "@/server/vehicles-admin";

type RouteParams = Promise<{ id: string }> | { id: string };

export default async function EditVehiclePage({ params }: { params: RouteParams }) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) {
    notFound();
  }

  const defaults = {
    id: vehicle.id,
    title: vehicle.title,
    brand: vehicle.brand,
    model: vehicle.model,
    bodyType: vehicle.bodyType ?? "",
    year: vehicle.year,
    mileage: vehicle.mileage ?? "",
    priceEur: vehicle.basePriceEur,
    country: vehicle.country,
    city: vehicle.city ?? "",
    fuelType: vehicle.fuelType ?? "",
    transmission: vehicle.transmission ?? "",
    driveType: vehicle.driveType ?? "",
    engineVolumeCc: vehicle.engineVolumeCc ?? "",
    powerHp: vehicle.powerHp ?? "",
    shortDescription: vehicle.shortDescription ?? "",
    originalListingUrl: vehicle.originalListingUrl ?? "",
    thumbnailUrl: vehicle.thumbnailUrl ?? "",
    gallery: vehicle.gallery.map((img) => img.url).join("\n"),
    features: vehicle.features.map((feature) => feature.label).join("\n"),
    specs: vehicle.specifications.map((spec) => `${spec.label}: ${spec.value}`).join("\n"),
    markets: vehicle.markets.map((market) => market.countryCode).join(", "),
    logistics: vehicle.logistics.map((step) => `${step.label}|${step.description ?? ""}|${step.etaDays ?? ""}`).join("\n"),
    documents: vehicle.documents.map((doc) => `${doc.title}|${doc.url}`).join("\n"),
  } as Record<string, string | number>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Редактировать автомобиль</h1>
          <p className="text-sm text-white/60">
            Обновите описание, галерею и стоимость, чтобы карточки и расчёты были актуальны.
          </p>
        </div>
        <form action={deleteVehicleAction}>
          <input type="hidden" name="id" value={vehicle.id} />
          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-full border border-red-500/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-200 transition hover:border-red-400 hover:text-red-100"
          >
            Delete
          </button>
        </form>
      </div>
      <VehicleForm action={updateVehicleAction} defaultValues={defaults} submitLabel="Сохранить изменения" />
    </div>
  );
}
