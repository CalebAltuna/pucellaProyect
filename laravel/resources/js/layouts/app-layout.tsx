import AppHeader from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import Footer from '../components/ui/footer'; // Importación corregida (estaba como footer minúscula)

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <div className="flex min-h-screen flex-col">
        <AppHeader breadcrumbs={breadcrumbs} {...props}>
            {/* El div con flex-1 hace que el contenido crezca y empuje el footer al fondo */}
            <div className="flex-1">
                {children}
            </div>
        </AppHeader>
        
        <Footer />
    </div>
);