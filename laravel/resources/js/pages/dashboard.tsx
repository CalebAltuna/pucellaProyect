import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Hero } from '@/components/home/postLogHero';
import { postLogCopy } from '@/lib/content';

interface Pisua {
    id: number;
    izena: string;
    kodigoa: string;
    user_id: number;
    synced: boolean;
}
interface DashboardProps {
    pisuak: Pisua[];
}
export default function Dashboard({ pisuak }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={[]}>
            <Head title="Nire pisuak" />
            <div className="min-h-screen flex flex-col">
                <Hero
                    copy={postLogCopy}
                    pisuak={pisuak}
                />
            </div>
        </AppLayout>
    );
}
