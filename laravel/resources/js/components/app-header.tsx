import { Link, usePage } from '@inertiajs/react';
import { Menu, LayoutGrid } from 'lucide-react';
import { cn, isSameUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import { useInitials } from '@/hooks/use-initials';
import { SharedData, BreadcrumbItem, NavItem } from '@/types';

import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { UserMenuContent } from '@/components/user-menu-content';

const header = {
    container: 'bg-[#5a4da1] text-white px-4 py-2 shadow-md border-b border-[#42357a]',
    button: 'text-white hover:bg-white/15',
    navItem: 'text-white hover:bg-white/15',
    activeLine: 'bg-[#f1f5f9]',
    avatarFallback: 'bg-white/15 text-white backdrop-blur-sm',
    breadcrumbs: 'border-b border-[#42357a]/50 bg-gradient-to-r from-[#5a4da1]/40 to-[#7c55b5]/40 text-white/75',
};

const mainNav: NavItem[] = [{ title: 'Dashboard', href: dashboard(), icon: LayoutGrid }];
const NavLink = ({ item, currentUrl }: { item: NavItem; currentUrl: string }) => (
    <Link
        href={item.href}
        className={cn(
            navigationMenuTriggerStyle(),
            isSameUrl(currentUrl, item.href) && 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100',
            'h-9 px-3 cursor-pointer',
            header.navItem
        )}
    >
        {item.icon && <Icon iconNode={item.icon} className="size-5 opacity-80" />}
        <span>{item.title}</span>
    </Link>
);

export function AppHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItem[] }) {
    const { auth } = usePage<SharedData>().props;
    const currentUrl = usePage().url;
    const getInitials = useInitials();

    return (
        <>
            <header className={header.container}>
                <div className="mx-auto flex h-16 items-center justify-between w-full md:max-w-7xl px-4">

                    {/* Mobile Menu */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className={cn('mr-2', header.button)}>
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 bg-sidebar">
                            <SheetHeader className="mb-4">
                                <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                            </SheetHeader>
                            <nav className="flex flex-col space-y-4 text-sm">
                                {mainNav.map((item) => (
                                    <Link key={item.title} href={item.href} className="flex items-center space-x-2">
                                        {item.icon && <Icon iconNode={item.icon} className="size-5 opacity-80" />}
                                        <span>{item.title}</span>
                                    </Link>
                                ))}
                            </nav>
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
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className={cn('size-10 rounded-full p-1', header.button)}>
                                        <Avatar className="size-8">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className={header.avatarFallback}>
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex gap-2 text-sm">
                                <Link href="/login" className={cn('px-3 py-2 rounded-md', header.button)}>Log in</Link>
                                <Link href="/register" className="px-3 py-2 hover:bg-white/10 rounded-md">Sign up</Link>
                            </div>
                        )}
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
