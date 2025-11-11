import { VehicleForm } from "@/components/admin/vehicle-form";
import { createVehicleAction } from "@/server/vehicles-admin";

export default function NewVehiclePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Добавление автомобиля</h1>
        <p className="text-sm text-white/60">
          Заполните карточку: фотографии, описание и параметры помогут быстрее опубликовать автомобиль в каталоге.
        </p>
      </div>
      <VehicleForm action={createVehicleAction} submitLabel="Создать автомобиль" />
    </div>
  );
}
