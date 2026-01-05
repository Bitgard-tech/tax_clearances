"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Car, Search, Download } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { AddCarDialog } from "@/components/add-car-dialog";
import { InventoryActions } from "@/components/inventory-actions";
import { Button } from "@/components/ui/button";

interface SerializedExpense {
    id: string;
    vehicleId: string;
    description: string;
    amount: number;
    date: Date;
    category: string;
    isPublic: boolean;
}

interface SerializedVehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    regNumber: string;
    vin: string | null;
    status: 'AVAILABLE' | 'SOLD';
    purchasePrice: number;
    purchaseDate: Date;
    soldPrice: number | null;
    soldDate: Date | null;
    profitMargin: number;
    images: string[];
    createdAt: Date;
    expenses: SerializedExpense[];
}

interface InventoryClientProps {
    vehicles: SerializedVehicle[];
}

export function InventoryClient({ vehicles }: InventoryClientProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const filteredVehicles = vehicles.filter((vehicle) => {
        const matchesSearch =
            vehicle.make.toLowerCase().includes(search.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
            vehicle.regNumber.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || vehicle.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleExport = () => {
        window.location.href = "/api/export";
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                    <p className="text-muted-foreground">Manage your vehicle inventory</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                    <AddCarDialog />
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by make, model, or reg number..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="AVAILABLE">Available</SelectItem>
                        <SelectItem value="SOLD">Sold</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Vehicle Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Vehicles</CardTitle>
                    <CardDescription>
                        {filteredVehicles.length} of {vehicles.length} vehicles
                        {search && ` matching "${search}"`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredVehicles.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Car className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">
                                {vehicles.length === 0 ? "No vehicles yet" : "No matches found"}
                            </h3>
                            <p className="mb-4">
                                {vehicles.length === 0
                                    ? "Get started by adding your first vehicle to the inventory."
                                    : "Try adjusting your search or filter."}
                            </p>
                            {vehicles.length === 0 && <AddCarDialog />}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead>Reg. Number</TableHead>
                                        <TableHead className="hidden sm:table-cell">Year</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden lg:table-cell">Buy Date</TableHead>
                                        <TableHead className="text-right hidden md:table-cell">Purchase</TableHead>
                                        <TableHead className="text-right hidden lg:table-cell">Expenses</TableHead>
                                        <TableHead className="text-right hidden md:table-cell">Total Cost</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredVehicles.map((vehicle: SerializedVehicle) => {
                                        const totalExpenses = vehicle.expenses?.reduce((sum: number, e: SerializedExpense) => sum + Number(e.amount), 0) || 0;
                                        const totalCost = Number(vehicle.purchasePrice) + totalExpenses;

                                        return (
                                            <TableRow
                                                key={vehicle.id}
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() => router.push(`/cars/${vehicle.id}`)}
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-primary/10 rounded-lg hidden sm:block">
                                                            <Car className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <span>{vehicle.make} {vehicle.model}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs sm:text-sm">{vehicle.regNumber}</TableCell>
                                                <TableCell className="hidden sm:table-cell">{vehicle.year}</TableCell>
                                                <TableCell>
                                                    <Badge variant={vehicle.status === 'AVAILABLE' ? 'default' : 'secondary'} className="text-xs">
                                                        {vehicle.status === 'AVAILABLE' ? 'Avail' : 'Sold'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                                    {vehicle.purchaseDate ? new Date(vehicle.purchaseDate).toLocaleDateString() : '-'}
                                                </TableCell>
                                                <TableCell className="text-right hidden md:table-cell">{formatCurrency(vehicle.purchasePrice)}</TableCell>
                                                <TableCell className="text-right hidden lg:table-cell">{formatCurrency(totalExpenses)}</TableCell>
                                                <TableCell className="text-right font-medium hidden md:table-cell">{formatCurrency(totalCost)}</TableCell>
                                                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                    <InventoryActions vehicle={vehicle} />
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
