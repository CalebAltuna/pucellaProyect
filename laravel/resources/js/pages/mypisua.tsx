import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { MyPisuaHero, Pisua } from '@/components/home/myPisuaHero';
import { myPisuaCopy } from '@/lib/content';
import { useState } from 'react';

interface MyPisuaProps {
    pisuak: Pisua[];
}

export default function MyPisua({ pisuak }: MyPisuaProps) {
    const [selectedPisua, setSelectedPisua] = useState<Pisua | null>(null);

    return (
        <AppLayout breadcrumbs={[]}>
            <Head title={selectedPisua ? selectedPisua.izena : "Mis Casas"} />

            <div className="min-h-screen flex flex-col bg-white">
                <MyPisuaHero
                    copy={myPisuaCopy}
                    pisuak={pisuak}
                    selectedPisua={selectedPisua}
                    onSelect={(p: Pisua | null) => setSelectedPisua(p)}
                />
            </div>
        </AppLayout>
    );
}
