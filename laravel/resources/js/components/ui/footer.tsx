import { Link } from '@inertiajs/react';
import { Building2, PlusCircle, CheckSquare, Wallet, Bell, House } from 'lucide-react';
import { Icon } from '@/components/icon';
import { dashboard } from '@/routes';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-[#5a4da1] to-[#7c55b5] text-white py-14 px-6 border-t border-white/10 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                
                {/* Columna 1: General (Izquierda) */}
                <div className="flex flex-col space-y-3 items-start">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Navegación</span>
                    <Link href={dashboard()} className="flex items-center gap-2 hover:text-white/80 transition-colors">
                        <Icon iconNode={House} className="size-4" />
                        <span>Inicio</span>
                    </Link>
                    <Link href="/pisos/sortu" className="flex items-center gap-2 hover:text-white/80 transition-colors">
                        <Icon iconNode={PlusCircle} className="size-4" />
                        <span>Sortu pisua</span>
                    </Link>
                    <p className="pt-2 text-sm opacity-50">Info adicional</p>
                </div>

                {/* Columna 2: Piso (Centro) */}
                <div className="flex flex-col space-y-3 items-start md:items-center">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Mi Piso</span>
                    <div className="flex flex-col space-y-3 items-start">
                        <Link href="/pisua/dashboard" className="flex items-center gap-2 hover:text-white/80 transition-colors">
                            <Icon iconNode={Building2} className="size-4" />
                            <span>Mi piso</span>
                        </Link>
                        <Link href="/pisua/atazak" className="flex items-center gap-2 hover:text-white/80 transition-colors">
                            <Icon iconNode={CheckSquare} className="size-4" />
                            <span>Atazak</span>
                        </Link>
                        <Link href="/pisua/gastuak" className="flex items-center gap-2 hover:text-white/80 transition-colors">
                            <Icon iconNode={Wallet} className="size-4" />
                            <span>Gastuak</span>
                        </Link>
                    </div>
                </div>

                {/* Columna 3: Otros (Derecha) */}
                <div className="flex flex-col space-y-3 items-start md:items-end text-right">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Sistema</span>
                    <Link href="/pisua/jakinarazpenak" className="flex items-center gap-2 hover:text-white/80 transition-colors">
                        <span>Jakinarazpenak</span>
                        <Icon iconNode={Bell} className="size-4" />
                    </Link>
                    <p className="hover:text-white/80 cursor-pointer">Kontaktua</p>
                    <p className="hover:text-white/80 cursor-pointer">Lizentzia mota</p>
                    <p className="hover:text-white/80 cursor-pointer">Sortzaileak</p>
                </div>

            </div>

            {/* Logo y Copyright */}
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-60">
                <span className="text-xl font-bold text-white opacity-100">Pisua</span>
                <p>© {new Date().getFullYear()} - Gestión de Pisos Compartidos</p>
            </div>
        </footer>
    );
};

export default Footer;