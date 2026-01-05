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
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Car } from "lucide-react";
import { updateVehicle } from "@/actions/vehicle-actions";
import { toast } from "sonner";

type EditCarDialogProps = {
    vehicle: {
        id: string;
        make: string;
        model: string;
        regNumber: string;
        year: number;
        vin?: string | null;
        purchasePrice: number | string;
        purchaseDate?: string | Date;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

type VehicleData = {
    id: string;
    make: string;
    model: string;
    year: number;
    regNumber: string;
    vin?: string;
    purchasePrice: number;
    purchaseDate: Date;
};

export function EditCarDialog({ vehicle, open, onOpenChange }: EditCarDialogProps) {
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingData, setPendingData] = useState<VehicleData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            id: vehicle.id,
            make: formData.get("make") as string,
            model: formData.get("model") as string,
            year: parseInt(formData.get("year") as string),
            regNumber: formData.get("regNumber") as string,
            vin: formData.get("vin") as string || undefined,
            purchasePrice: parseFloat(formData.get("purchasePrice") as string),
            purchaseDate: new Date(formData.get("purchaseDate") as string),
        };

        setPendingData(data);
        setConfirmOpen(true);
    }

    async function handleConfirm() {
        if (!pendingData) return;

        setLoading(true);
        setConfirmOpen(false); // Close confirmation immediately or wait? Usually wait but dialog stacking can be tricky.

        const result = await updateVehicle(pendingData);

        if (result.success) {
            toast.success("Vehicle updated successfully");
            onOpenChange(false);
            router.refresh();
        } else {
            toast.error(result.message || "Failed to update vehicle");
            setError(result.message);
            // Re-open dialog if we closed it? It's already open (EditCarDialog).
        }

        setLoading(false);
        setPendingData(null);
    }

    // Safely format date for input value (YYYY-MM-DD)
    const formattedDate = vehicle.purchaseDate
        ? new Date(vehicle.purchaseDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto">
                    <form onSubmit={onSubmit}>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Car className="h-5 w-5" />
                                Edit Vehicle
                            </DialogTitle>
                            <DialogDescription>
                                Update the details of the vehicle.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="make">Make</Label>
                                    <Input id="make" name="make" defaultValue={vehicle.make} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="model">Model</Label>
                                    <Input id="model" name="model" defaultValue={vehicle.model} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="year">Year</Label>
                                    <Input
                                        id="year"
                                        name="year"
                                        type="number"
                                        defaultValue={vehicle.year}
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="regNumber">Reg. Number</Label>
                                    <Input id="regNumber" name="regNumber" defaultValue={vehicle.regNumber} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="vin">VIN <span className="text-muted-foreground text-xs">(Optional)</span></Label>
                                <Input id="vin" name="vin" defaultValue={vehicle.vin || ''} placeholder="Vehicle Identification Number" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="purchasePrice">Price (LKR)</Label>
                                    <Input
                                        id="purchasePrice"
                                        name="purchasePrice"
                                        type="number"
                                        step="0.01"
                                        defaultValue={parseFloat(vehicle.purchasePrice.toString())}
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
                                        defaultValue={formattedDate}
                                        required
                                    />
                                </div>
                            </div>
                            {error && (
                                <p className="text-sm text-red-500 bg-red-500/10 p-2 rounded">{error}</p>
                            )}
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="flex-1 sm:flex-none">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to update this vehicle record? This action will modify the inventory details.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>Confirm Update</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
