import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';

interface AppLayoutProps extends PropsWithChildren {
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppHeaderLayout({ children, breadcrumbs }: AppLayoutProps) {
    return (
        <AppShell>
            {/* Aquí es donde asignas el color púrpura y el estilo que querías */}
            <AppHeader
                breadcrumbs={breadcrumbs}/>
            <AppContent>
                {children}
            </AppContent>
        </AppShell>
    );
}
