import { VehicleForm } from "@/components/admin/vehicle-form";
import { getTaxonomyMap } from "@/server/taxonomy-service";
import { createVehicleAction } from "@/server/vehicles-admin";

export default async function NewVehiclePage() {
  const taxonomies = await getTaxonomyMap();
  const formTaxonomies = {
    brand: taxonomies.brand.map((t) => t.value),
    model: taxonomies.model.map((t) => t.value),
    bodyType: taxonomies.bodyType.map((t) => t.value),
    fuelType: taxonomies.fuelType.map((t) => t.value),
    transmission: taxonomies.transmission.map((t) => t.value),
    driveType: taxonomies.driveType.map((t) => t.value),
    color: taxonomies.color.map((t) => t.value),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Добавить автомобиль</h1>
        <p className="text-sm text-white/60">
          Заполните основные данные, добавьте фото и ссылку на оригинальное объявление. Эти данные попадут в каталог и калькулятор.
        </p>
      </div>
      <VehicleForm action={createVehicleAction} taxonomies={formTaxonomies} submitLabel="Создать автомобиль" />
    </div>
  );
}
