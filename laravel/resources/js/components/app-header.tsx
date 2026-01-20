import { Link, usePage } from '@inertiajs/react';
import { Menu, Home, ListTodo, DollarSign, Bell, ChevronDown } from 'lucide-react';
import { cn, isSameUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import { useInitials } from '@/hooks/use-initials';
import { SharedData, BreadcrumbItem, NavItem } from '@/types';

import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { UserMenuContent } from '@/components/user-menu-content';

/* ----------  CONFIG  ---------- */
const header = {
    container: 'bg-[#5a4da1] text-white px-4 py-2 shadow-lg',
    button: 'text-white hover:bg-white/10 active:bg-white/20 rounded-lg',
    navItem: 'text-white/90 hover:text-white hover:bg-white/10',
    activePill: 'bg-white/20 text-white',
    avatarFallback: 'bg-white/15 text-white backdrop-blur-sm',
    breadcrumbs: 'bg-[#5a4da1]/60 text-white/80 backdrop-blur-sm',
};

/* ----------  NAV  ---------- */
const mainNav: NavItem[] = [
    { title: 'Inicio', href: dashboard(), icon: Home },
    { title: 'Mis Pisos', href: '/pisos', icon: Home },
];

const pisoNav: NavItem[] = [
    { title: 'Inicio', href: '#', icon: Home },
    { title: 'Tareas', href: '#', icon: ListTodo },
    { title: 'Gastos', href: '#', icon: DollarSign },
    { title: 'Notificaciones', href: '#', icon: Bell },
];


/* ----------  HOOK  ---------- */
const useIsInPisoPage = () => {
    const { url } = usePage();
    return url.includes('/pisos/') && !url.endsWith('/pisos');
};

/* ----------  UI  ---------- */
const NavPill = ({ item, currentUrl }: { item: NavItem; currentUrl: string }) => {
    const active = isSameUrl(currentUrl, item.href);
    return (
        <Link
            href={item.href}
            className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                header.navItem,
                active && header.activePill
            )}
        >
            {item.icon && <Icon iconNode={item.icon} className="inline size-4 mr-2" />}
            {item.title}
        </Link>
    );
};

export function AppHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItem[] }) {
    const { auth, piso } = usePage<SharedData & { piso?: { name: string } }>().props;
    const currentUrl = usePage().url;
    const getInitials = useInitials();
    const isInPisoPage = useIsInPisoPage();
    const nav = isInPisoPage ? pisoNav : mainNav;

    return (
        <>
            <header className={header.container}>
                <div className="mx-auto flex h-16 items-center justify-between w-full md:max-w-7xl px-4">
                    {/* Mobile */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className={header.button}>
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 bg-white">
                            <SheetHeader className="mb-4">
                                <AppLogoIcon className="h-6 w-6 fill-[#5a4da1]" />
                            </SheetHeader>
                            <nav className="flex flex-col space-y-3 text-sm">
                                {nav.map((i) => (
                                    <Link
                                        key={i.title}
                                        href={i.href}
                                        className={cn(
                                            'flex items-center space-x-3 px-3 py-2 rounded-lg',
                                            isSameUrl(currentUrl, i.href) ? 'bg-[#5a4da1]/10 text-[#5a4da1]' : 'hover:bg-gray-100'
                                        )}
                                    >
                                        {i.icon && <Icon iconNode={i.icon} className="size-5" />}
                                        <span>{i.title}</span>
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>

                    {/* Logo + piso pill */}
                    <div className="flex items-center space-x-3">
                        <Link href={dashboard()} prefetch>
                            <AppLogo />
                        </Link>
                        {isInPisoPage && piso && (
                            <span className="hidden lg:inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-sm">
                                <Home className="h-4 w-4" />
                                <span>{piso.name}</span>
                            </span>
                        )}
                    </div>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center space-x-2">
                        {nav.map((i) => (
                            <NavPill key={i.title} item={i} currentUrl={currentUrl} />
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="ml-auto flex items-center space-x-3">
                        {isInPisoPage && (
                            <Button variant="ghost" size="icon" className={header.button}>
                                <Bell className="h-5 w-5" />
                                <span className="absolute -top-1 -right-1 h-4 w-4 grid place-content-center rounded-full bg-red-500 text-[10px] font-bold">3</span>
                            </Button>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className={cn('pl-2 pr-3 py-1', header.button)}>
                                    <Avatar className="size-7">
                                        <AvatarImage src={auth.user?.avatar} alt={auth.user?.name} />
                                        <AvatarFallback className={header.avatarFallback}>{getInitials(auth.user?.name)}</AvatarFallback>
                                    </Avatar>
                                    <span className="hidden md:inline ml-2 text-sm">Perfil</span>
                                    <ChevronDown className="hidden md:inline ml-1 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <UserMenuContent user={auth.user} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && (
                <div className={header.breadcrumbs}>
                    <div className="mx-auto h-12 flex items-center px-4 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
