"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2, Car } from "lucide-react";
import { createVehicle } from "@/actions/vehicle-actions";

export function AddCarDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            make: formData.get("make") as string,
            model: formData.get("model") as string,
            year: parseInt(formData.get("year") as string),
            regNumber: formData.get("regNumber") as string,
            vin: formData.get("vin") as string || null,
            purchasePrice: parseFloat(formData.get("purchasePrice") as string),
            purchaseDate: new Date(formData.get("purchaseDate") as string),
            images: [],
        };

        const result = await createVehicle(data);

        if (result.success) {
            setOpen(false);
            router.refresh();
        } else {
            setError(result.message);
        }

        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 w-full sm:w-auto">
                    <Plus className="h-4 w-4" />
                    <span>Add Car</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Car className="h-5 w-5" />
                            Add New Vehicle
                        </DialogTitle>
                        <DialogDescription>
                            Enter the details of the vehicle you&apos;re purchasing.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="make">Make</Label>
                                <Input id="make" name="make" placeholder="Toyota" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="model">Model</Label>
                                <Input id="model" name="model" placeholder="Corolla" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="year">Year</Label>
                                <Input
                                    id="year"
                                    name="year"
                                    type="number"
                                    placeholder="2020"
                                    min="1900"
                                    max={new Date().getFullYear() + 1}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="regNumber">Reg. Number</Label>
                                <Input id="regNumber" name="regNumber" placeholder="WP CAM-1234" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vin">VIN <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                            <Input id="vin" name="vin" placeholder="Vehicle Identification Number" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="purchasePrice">Price (LKR)</Label>
                                <Input
                                    id="purchasePrice"
                                    name="purchasePrice"
                                    type="number"
                                    step="0.01"
                                    placeholder="2,500,000"
                                    className="font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="purchaseDate">Date</Label>
                                <Input
                                    id="purchaseDate"
                                    name="purchaseDate"
                                    type="date"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                        </div>
                        {error && (
                            <p className="text-sm text-red-500 bg-red-500/10 p-2 rounded">{error}</p>
                        )}
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading} className="flex-1 sm:flex-none">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Vehicle
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
