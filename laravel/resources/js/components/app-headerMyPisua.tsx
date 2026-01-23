import { Link, usePage } from '@inertiajs/react';
import { cn, isSameUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import { NavItem } from '@/types';

const subStyles = {
    container: 'bg-[#6351a8] px-4 pb-4 shadow-md',
    navLink: 'bg-[#ede4ff] text-[#6351a8] hover:bg-[#e2d5ff] transition-all rounded-xl font-medium px-6 py-2 shadow-sm text-sm whitespace-nowrap flex items-center justify-center min-w-[100px]',
    activeRing: 'ring-2 ring-white shadow-lg scale-105',
};

const subNav: NavItem[] = [
    { title: 'Inicio', href: dashboard() },
    { title: 'Tareas', href: '/tasks' },
    { title: 'Facturas', href: '/invoices' },
    { title: 'Miembros', href: '/members' },
];

export function MyPisua() {
    const currentUrl = usePage().url;

    return (
        <div className={subStyles.container}>
            <div className="mx-auto flex items-center justify-center w-full md:max-w-7xl overflow-x-auto no-scrollbar gap-4 py-2">
                {subNav.map((item) => (
                    <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                            subStyles.navLink,
                            isSameUrl(currentUrl, item.href) && subStyles.activeRing
                        )}
                    >
                        {item.title}
                    </Link>
                ))}
            </div>
        </div>
    );
}
