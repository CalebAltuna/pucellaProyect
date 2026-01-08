import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Hero } from '@/components/home/postLogHero';
import { postLogCopy } from '@/lib/content';

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={[]}>   {/* hutsik */}
            <Head title="Welcome" />
            <div className="min-h-screen flex items-center justify-center">
                <Hero
                    copy={postLogCopy}
                />
            </div>
        </AppLayout>
    );
}