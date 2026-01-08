// import AppSidebar from '@/layouts/app/app-sidebar-layout';
import AppHeader from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppHeader breadcrumbs={breadcrumbs} {...props}>
        {children}
    </AppHeader>
        // <AppSidebar breadcrumbs={breadcrumbs} {...props}>
    //     {children}
    // </AppSidebar>
);


