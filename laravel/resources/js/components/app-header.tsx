import { Link, usePage } from '@inertiajs/react';
import { Menu, Search, LayoutGrid, Folder, BookOpen } from 'lucide-react';
import { cn, isSameUrl, resolveUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import { useInitials } from '@/hooks/use-initials';
import { SharedData, BreadcrumbItem, NavItem } from '@/types';
// después
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { UserMenuContent } from '@/components/user-menu-content';
const header = {
    container: 'bg-gradient-to-r from-[#5a4da1] to-[#7c55b5] text-white px-4 py-2 shadow-md border-b border-[#42357a]',
    button: 'text-white hover:bg-white/15',
    navItem: 'text-white hover:bg-white/15',
    activeLine: 'bg-[#f1f5f9]',
    avatarFallback: 'bg-white/15 text-white backdrop-blur-sm',
    breadcrumbs: 'border-b border-[#42357a]/50 bg-gradient-to-r from-[#5a4da1]/40 to-[#7c55b5]/40 text-white/75',
};

const mainNav: NavItem[] = [{ title: 'Dashboard', href: dashboard(), icon: LayoutGrid }];
const rightNav: NavItem[] = [
    { title: 'Repository', href: 'https://github.com/laravel/react-starter-kit', icon: Folder },
    { title: 'Documentation', href: 'https://laravel.com/docs/starter-kits#react', icon: BookOpen },
];

export function AppHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItem[] }) {
    const { auth } = usePage<SharedData>().props;
    const currentUrl = usePage().url;   // ← aquí, en el nivel superior


    const getInitials = useInitials();

    // Fuera del AppHeader
    const NavLink = ({ item, currentUrl }: { item: NavItem; currentUrl: string }) => (
        <Link
            href={item.href}
            className={cn(
                navigationMenuTriggerStyle(),
                isSameUrl(currentUrl, item.href) && 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100',
                'h-9 px-3 cursor-pointer', header.navItem
            )}
        >
            {item.icon && <Icon iconNode={item.icon} className="size-5 opacity-80 hover:opacity-100" />}
            {item.title}
        </Link>
    );

    const ExternalLink = ({ item }: { item: NavItem }) => (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger>
                    <a
                        href={resolveUrl(item.href)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`ml-1 h-9 w-9 flex items-center justify-center rounded-md bg-transparent hover:bg-white/15 ${header.button}`}
                    >
                        <Icon iconNode={item.icon!} className="size-5 opacity-80 hover:opacity-100" />                    </a>
                </TooltipTrigger>
                <TooltipContent>{item.title}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    return (
        <>
            <header className={header.container}>
                <div className="mx-auto flex h-16 items-center justify-between w-full md:max-w-7xl px-4">
                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className={`mr-2 ${header.button}`}>
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 bg-sidebar">
                            <SheetHeader>
                                <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                            </SheetHeader>
                            <div className="flex flex-col justify-between h-full p-4 text-sm">
                                <div className="space-y-4">
                                    {mainNav.map((item) => (
                                        <Link key={item.title} href={item.href} className="flex items-center space-x-2">
                                            <Icon iconNode={item.icon!} className="size-5 opacity-80 hover:opacity-100" />                                             <span>{item.title}</span>
                                        </Link>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    {rightNav.map((item) => (
                                        <a key={item.title} href={resolveUrl(item.href)} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                                            <Icon iconNode={item.icon!} className="size-5 opacity-80 hover:opacity-100" />                                            <span>{item.title}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Logo */}
                    <Link href={dashboard()} prefetch>
                        <AppLogo />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex ml-6">
                        <NavigationMenu>
                            <NavigationMenuList className="space-x-2">
                                {mainNav.map((item) => (
                                    <NavigationMenuItem key={item.title} className="relative">
                                        <NavLink item={item} currentUrl={currentUrl} />
                                        {isSameUrl(currentUrl, item.href) && (
                                            <div className={`absolute bottom-0 left-0 h-0.5 w-full ${header.activeLine}`} />
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </nav>

                    {/* Right Side */}
                    <div className="ml-auto flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className={header.button}>
                            <Search className="size-5" />
                        </Button>
                        <div className="hidden lg:flex">
                            {rightNav.map((item) => <ExternalLink key={item.title} item={item} />)}
                        </div>

                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className={`size-10 rounded-full p-1 ${header.button}`}>
                                        <Avatar className="size-8">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className={header.avatarFallback}>{getInitials(auth.user.name)}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex gap-2">
                                <Link href="/login" className={`px-3 py-2 text-sm ${header.button}`}>Log in</Link>
                                <Link href="/register" className="px-3 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-md">Sign up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </header >

            {
                breadcrumbs.length > 1 && (
                    <div className={header.breadcrumbs}>
                        <div className="mx-auto h-12 flex items-center px-4 md:max-w-7xl">
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                        </div>
                    </div>
                )
            }
        </>
    );
}
