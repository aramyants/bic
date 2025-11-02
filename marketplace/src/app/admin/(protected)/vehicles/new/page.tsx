import { VehicleForm } from "@/components/admin/vehicle-form";
import { createVehicleAction } from "@/server/vehicles-admin";

export default function NewVehiclePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-white">Новый автомобиль</h1>
        <p className="text-sm text-white/60">
          Заполните ключевые характеристики, добавьте ссылки на галерею и укажите рынки. После сохранения карточка появится в каталоге.
        </p>
      </div>
      <VehicleForm action={createVehicleAction} submitLabel="Создать карточку" />
    </div>
  );
}
