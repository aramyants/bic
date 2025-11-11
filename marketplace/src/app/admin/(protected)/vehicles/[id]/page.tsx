import { redirect } from "next/navigation";

type RouteParams = Promise<{ id: string }> | { id: string };

export default async function VehicleDetailsRedirect({ params }: { params: RouteParams }) {
  const { id } = await params;
  redirect(`/admin/vehicles/${id}/edit`);
  return null;
}
