import { Link, usePage } from '@inertiajs/react';
import { Menu, LayoutGrid, Home, Building2, Heart, Settings, PlusCircle, BarChart } from 'lucide-react';
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

// Eliminados los imports de AppLogo y AppLogoIcon

const header = {
    container: 'bg-[#5a4da1] text-white shadow-lg',
    button: 'text-white hover:bg-white/10 px-4 py-2.5 rounded-lg transition-all duration-200',
    activeLine: 'bg-white/40 h-0.5 w-full rounded-full',
    avatarFallback: 'bg-[#7c55b5] text-white',
    breadcrumbs: 'bg-[#4c418a]/30 backdrop-blur-sm',
};

const mainNav: NavItem[] = [{
    title: 'Dashboard',
    href: dashboard(),
    icon: LayoutGrid
}];

const pisuaNavItems = [
    { title: 'Dashboard Pisua', href: '/pisua/dashboard', icon: Home },
    { title: 'Mis Pisos', href: '/pisua/mis-pisos', icon: Building2 },
    { title: 'Crear Nuevo', href: '/pisua/crear', icon: PlusCircle },
    { title: 'Favoritos', href: '/pisua/favoritos', icon: Heart },
    { title: 'Estadísticas', href: '/pisua/estadisticas', icon: BarChart },
    { title: 'Configuración', href: '/pisua/configuracion', icon: Settings },
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
    const isPisua = currentUrl.includes('pisua');
    const activePisuaItem = pisuaNavItems.find(item =>
        isSameUrl(currentUrl, item.href) || currentUrl.startsWith(item.href + '/')
    );

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
                                        {/* Logo Icon eliminado aquí */}
                                        <span className="text-xl font-bold text-white">Pisua</span>
                                    </div>
                                </SheetHeader>

                                <nav className="flex flex-col space-y-1.5">
                                    {mainNav.map((item) => (
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

                                    {isPisua && (
                                        <div className="pt-6 mt-4">
                                            <h3 className="text-xs uppercase tracking-wider text-white/60 mb-3 px-4">
                                                Nire pisua
                                            </h3>
                                            {pisuaNavItems.map((item) => (
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
                                        </div>
                                    )}
                                </nav>
                            </SheetContent>
                        </Sheet>

                        {/* Logo Desktop (Reemplazado por texto simple) */}
                        <Link href={dashboard()} prefetch className="flex items-center gap-3 group">
                            <span className="text-xl font-bold text-white tracking-tight">
                                Pisua
                            </span>
                        </Link>
                    </div>

                    {/* Navegación Desktop */}
                    <div className="flex-1 flex items-center justify-center">
                        <nav className="hidden lg:flex items-center gap-1">
                            {mainNav.map((item) => (
                                <div key={item.title} className="relative">
                                    <NavLink item={item} currentUrl={currentUrl} />
                                    {isSameUrl(currentUrl, item.href) && (
                                        <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 ${header.activeLine} w-3/4`} />
                                    )}
                                </div>
                            ))}

                            {isPisua && (
                                <>
                                    <div className="h-6 w-px bg-white/20 mx-2" />

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-white hover:bg-white/20"
                                            >
                                                <Building2 className="h-4.5 w-4.5 opacity-90" />
                                                <span className="font-medium">Mi Pisua</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            align="center"
                                            className="w-64 mt-2 bg-gradient-to-b from-[#5a4da1] to-[#7c55b5] border border-white/20"
                                        >
                                            <div className="p-2">
                                                {pisuaNavItems.map((item) => (
                                                    <Link
                                                        key={item.title}
                                                        href={item.href}
                                                        className={cn(
                                                            "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/15 text-white",
                                                            isSameUrl(currentUrl, item.href) && "bg-white/20 font-medium"
                                                        )}
                                                    >
                                                        <Icon iconNode={item.icon} className="size-4" />
                                                        <span className="text-sm">{item.title}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            )}
                        </nav>
                    </div>

                    {/* Lado Derecho - Usuario/Auth */}
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
                            {isPisua && activePisuaItem && (
                                <div className="hidden md:flex items-center gap-2 text-sm text-white/80">
                                    <Icon iconNode={activePisuaItem.icon} className="size-4" />
                                    <span className="font-medium">{activePisuaItem.title}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}