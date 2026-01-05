/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, DollarSign, TrendingUp, Package, ArrowRight, Plus } from "lucide-react";
import { getVehicles } from "@/actions/vehicle-actions";
import { formatCurrency } from "@/utils/format";

// Force dynamic rendering to prevent static generation with database calls
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const result = await getVehicles();
  const vehicles = result.success && result.data ? result.data : [];

  const availableVehicles = vehicles.filter((v: any) => v.status === 'AVAILABLE');
  const soldThisMonth = vehicles.filter((v: any) => {
    if (v.status !== 'SOLD' || !v.soldDate) return false;
    const now = new Date();
    const soldDate = new Date(v.soldDate);
    return soldDate.getMonth() === now.getMonth() && soldDate.getFullYear() === now.getFullYear();
  });

  const totalInventoryValue = availableVehicles.reduce((sum: number, v: any) => sum + Number(v.purchasePrice), 0);

  const thisMonthProfit = soldThisMonth.reduce((sum: number, v: any) => {
    const soldPrice = Number(v.soldPrice || 0);
    const purchasePrice = Number(v.purchasePrice);
    const totalExpenses = v.expenses?.reduce((s: number, e: any) => s + Number(e.amount), 0) || 0;
    return sum + (soldPrice - purchasePrice - totalExpenses);
  }, 0);

  const recentVehicles = vehicles.slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Your dealership at a glance</p>
        </div>
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href="/inventory">
            <Plus className="mr-2 h-4 w-4" /> Add Vehicle
          </Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Cars in Stock</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{availableVehicles.length}</div>
            <p className="text-xs text-muted-foreground">Available for sale</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(totalInventoryValue)}</div>
            <p className="text-xs text-muted-foreground">Total purchase cost</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-xl sm:text-2xl font-bold ${thisMonthProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(thisMonthProfit)}
            </div>
            <p className="text-xs text-muted-foreground">{soldThisMonth.length} sold</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1">
          <Link href="/inventory">
            <Package className="h-5 w-5" />
            <span className="text-xs">Inventory</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1">
          <Link href="/reports">
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs">Reports</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1 col-span-2 sm:col-span-2">
          <Link href="/inventory">
            <Plus className="h-5 w-5" />
            <span className="text-xs">Add New Car</span>
          </Link>
        </Button>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-4">
          <div>
            <CardTitle className="text-base sm:text-lg">Recent Vehicles</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Latest in inventory</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
            <Link href="/inventory">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
          {recentVehicles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Car className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-50" />
              <p className="text-sm sm:text-base">No vehicles yet</p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/inventory">Add Your First Vehicle</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {recentVehicles.map((vehicle: { id: string; make: string; model: string; regNumber: string; year: number; status: string }) => (
                <Link
                  key={vehicle.id}
                  href={`/cars/${vehicle.id}`}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg shrink-0">
                      <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{vehicle.make} {vehicle.model}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{vehicle.regNumber}</p>
                    </div>
                  </div>
                  <Badge variant={vehicle.status === 'AVAILABLE' ? 'default' : 'secondary'} className="text-xs shrink-0 ml-2">
                    {vehicle.status === 'AVAILABLE' ? 'Avail' : 'Sold'}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
          <Button asChild variant="outline" size="sm" className="w-full mt-4 sm:hidden">
            <Link href="/inventory">
              View All Vehicles <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
