import { Link, usePage } from '@inertiajs/react';
import {Menu, Building2,PlusCircle, CheckSquare, Wallet, Bell, House} from 'lucide-react';
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
import { UserMenuContent } from '@/components/user-menu-content';

const header = {
    container: 'bg-[#5a4da1] text-white shadow-lg',
    button: 'text-white hover:bg-white/10 px-4 py-2.5 rounded-lg transition-all duration-200',
    activeLine: 'bg-white/40 h-0.5 w-full rounded-full',
    avatarFallback: 'bg-[#7c55b5] text-white',
    breadcrumbs: 'bg-[#4c418a]/30 backdrop-blur-sm',
};

// Configuración de navegación para Estado 1: Fuera de un piso
const generalNavItems: NavItem[] = [
    { title: 'Inicio', href: dashboard(), icon: House },
    { title: 'Sortu pisua', href: '/pisos/sortu', icon: PlusCircle },
];

// Configuración de navegación para Estado 2: Dentro de un piso
const pisoNavItems: NavItem[] = [
    { title: 'Mi piso', href: '/pisua/dashboard', icon: Building2 },
    { title: 'Atazak', href: '/pisua/atazak', icon: CheckSquare },
    { title: 'Gastuak', href: '/pisua/gastuak', icon: Wallet },
    { title: 'Jakinarazpenak', href: '/pisua/jakinarazpenak', icon: Bell },
];

const NavLink = ({ item, currentUrl }: { item: NavItem; currentUrl: string }) => (
    <Link
        href={item.href}
        className={cn(
            'flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all duration-200',
            'hover:bg-white/10 hover:text-white',
            isSameUrl(currentUrl, item.href)
                ? 'bg-white/20 text-white font-semibold shadow-sm'
                : 'text-white/90'
        )}
    >
        {item.icon && <Icon iconNode={item.icon} className="size-4.5 opacity-90" />}
        <span className="font-medium">{item.title}</span>
    </Link>
);

export function AppHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItem[] }) {
    const { auth } = usePage<SharedData>().props;
    const currentUrl = usePage().url;
    const getInitials = useInitials();

    // Detección de estado
    const isPisua = currentUrl.includes('pisua');

    // Selección de menú según el estado
    const currentNavItems = isPisua ? pisoNavItems : generalNavItems;

    return (
        <>
            <header className={header.container}>
                <div className="mx-auto flex h-16 items-center justify-between w-full md:max-w-7xl px-4">

                    {/* Logo (Texto) y Menú Móvil */}
                    <div className="flex items-center gap-4">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden text-white hover:bg-white/20 rounded-lg"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-72 bg-gradient-to-b from-[#5a4da1] to-[#7c55b5]">
                                <SheetHeader className="mb-6 pt-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl font-bold text-white">
                                            {isPisua ? 'Gestión Piso' : 'Pisua'}
                                        </span>
                                    </div>
                                </SheetHeader>

                                <nav className="flex flex-col space-y-1.5">
                                    {currentNavItems.map((item) => (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 text-white',
                                                isSameUrl(currentUrl, item.href) && 'bg-white/20 font-semibold'
                                            )}
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="size-5" />}
                                            <span>{item.title}</span>
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>

                        {/* Logo Desktop */}
                        <Link href={dashboard()} prefetch className="flex items-center gap-3 group">
                            <span className="text-xl font-bold text-white tracking-tight">
                                Pisua
                            </span>
                        </Link>
                    </div>

                    {/* Navegación Desktop Centralizada */}
                    <div className="flex-1 flex items-center justify-center">
                        <nav className="hidden lg:flex items-center gap-1">
                            {currentNavItems.map((item) => (
                                <div key={item.title} className="relative">
                                    <NavLink item={item} currentUrl={currentUrl} />
                                    {isSameUrl(currentUrl, item.href) && (
                                        <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 ${header.activeLine} w-3/4`} />
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>

                    {/* Lado Derecho - Usuario/Auth (Perfil) */}
                    <div className="flex items-center gap-3">
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="size-10 rounded-full p-1 hover:bg-white/20"
                                    >
                                        <Avatar className="size-8">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className={header.avatarFallback}>
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-xl">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className={cn(header.button, 'text-sm font-medium')}
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/register"
                                    className={cn(header.button, 'text-sm font-medium')}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && (
                <div className={header.breadcrumbs}>
                    <div className="mx-auto px-4 md:max-w-7xl">
                        <div className="flex items-center justify-between h-12">
                            <Breadcrumbs breadcrumbs={breadcrumbs} />

                            {/* Opcional: Mostrar indicador de sección actual a la derecha de breadcrumbs si se desea */}
                            {isPisua && (
                                <div className="hidden md:flex items-center gap-2 text-sm text-white/80">
                                    <span className="bg-white/10 px-2 py-1 rounded text-xs uppercase tracking-wider">Modo Piso</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}