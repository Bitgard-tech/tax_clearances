
import { getDealerProfile } from "@/actions/settings-actions";
import { SettingsForm } from "@/components/settings-form";

export const dynamic = 'force-dynamic';
export default async function SettingsPage() {
    const result = await getDealerProfile();
    const profile = result.success && result.data ? result.data : null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your dealership profile</p>
            </div>
            <SettingsForm profile={profile} />
        </div>
    );
}
