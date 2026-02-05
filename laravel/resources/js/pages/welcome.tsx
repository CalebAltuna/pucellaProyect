import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Hero } from '@/components/home/hero';
import { landingCopy } from '@/lib/content';
import { login, register } from '@/routes';

export default function Welcome() {
    return (
        <AppLayout breadcrumbs={[]}>   {/* hutsik */}
            <Head title="Ongi Etorri" />
            <div className="min-h-screen flex items-center justify-center">
                <Hero
                    loginUrl={login().url}
                    registerUrl={register().url}
                    copy={landingCopy}
                />
            </div>
        </AppLayout>
    );
}
