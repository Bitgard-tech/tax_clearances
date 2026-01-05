import { getVehicles } from "@/actions/vehicle-actions";
import { InventoryClient } from "@/components/inventory-client";

export const dynamic = 'force-dynamic';
export default async function InventoryPage() {
    const result = await getVehicles();
    const vehicles = result.success && result.data ? result.data : [];

    return <InventoryClient vehicles={vehicles} />;
}
