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
import { Loader2, Percent } from "lucide-react";
import { updateVehicle } from "@/actions/vehicle-actions";
import { toast } from "sonner";

interface EditMarginDialogProps {
    vehicleId: string;
    currentMargin: number;
}

export function EditMarginDialog({ vehicleId, currentMargin }: EditMarginDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const margin = parseFloat(formData.get("profitMargin") as string);

        const result = await updateVehicle({
            id: vehicleId,
            profitMargin: margin
        });

        if (result.success) {
            toast.success("Profit margin updated");
            setOpen(false);
            router.refresh();
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-6 gap-1 text-xs px-2">
                    <Percent className="h-3 w-3" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Target Profit Margin</DialogTitle>
                        <DialogDescription>
                            Set the target profit margin percentage for this specific vehicle.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="profitMargin">Profit Margin (%)</Label>
                            <div className="relative">
                                <Input
                                    id="profitMargin"
                                    name="profitMargin"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    defaultValue={currentMargin}
                                    required
                                    className="pr-8"
                                />
                                <span className="absolute right-3 top-2.5 text-sm text-muted-foreground">%</span>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
