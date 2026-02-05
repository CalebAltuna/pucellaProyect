import { Link, usePage } from '@inertiajs/react';
import { Building2, PlusCircle, CheckSquare, Wallet, Bell, House } from 'lucide-react';
import { Icon } from '@/components/icon';
import { dashboard } from '@/routes';
import { PageProps } from '@/types';

export function Footer() {
    const { props } = usePage<PageProps>();
    const { pisua } = props;

    const generalNavItems = [
        { title: 'Hasiera', href: dashboard(), icon: House },
        { title: 'Sortu pisua', href: '/pisua/sortu', icon: PlusCircle },
    ];

    const houseNavItems = pisua ? [
        { title: 'Nire pisua', href: `/pisua/${pisua.id}/kudeatu`, icon: Building2 },
        { title: 'Atazak', href: `/pisua/${pisua.id}/kudeatu/atazak`, icon: CheckSquare },
        { title: 'Gastuak', href: `/pisua/${pisua.id}/kudeatu/gastuak`, icon: Wallet },
        { title: 'Jakinarazpenak', href: `/pisua/${pisua.id}/kudeatu/jakinarazpenak`, icon: Bell },
    ] : [];

    return (
        <footer className="bg-[#5a4da1] text-white py-14 px-6 border-t border-white/10 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">

                <div className="flex flex-col space-y-3 items-start">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
                        Nabigazioa
                    </span>
                    {generalNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-2 hover:text-white/80 transition-colors"
                        >
                            {item.icon && <Icon iconNode={item.icon} className="size-4" />}
                            <span>{item.title}</span>
                        </Link>
                    ))}
                </div>

                {pisua && (
                    <div className="flex flex-col space-y-3 items-start md:items-center">
                        <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
                            {pisua.izena}
                        </span>
                        <div className="flex flex-col space-y-3 items-start">
                            {houseNavItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-2 hover:text-white/80 transition-colors"
                                >
                                    {item.icon && <Icon iconNode={item.icon} className="size-4" />}
                                    <span>{item.title}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60">
                <span className="text-xl font-bold text-white opacity-100">Pisua</span>
                <img src="/favicon.svg" alt="Pisua Logo" className="size-8" />
                <div className="flex items-center gap-1">
                    <p>CC BY-NC {new Date().getFullYear()} - PuCellA</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;