import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { landingCopy } from '@/lib/content';

const button = cva(
    'inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2',
    {
        variants: {
            intent: {
                primary: 'bg-brand text-white hover:bg-brand/90 focus:ring-brand',
                secondary:
                    'bg-brand/20 text-brand-dark hover:bg-brand/30 focus:ring-brand',
            },
            shadow: { true: 'shadow-lg hover:shadow-xl' },
        },
        defaultVariants: { intent: 'primary', shadow: true },
    }
);

interface DashboardHeroProps extends VariantProps<typeof button> {
    loginUrl: string;
    registerUrl: string;
    copy: typeof landingCopy;
}

export function Dashboardhero({ loginUrl, registerUrl, copy }: DashboardHeroProps) {
    return (
        <section className="grid place-content-center gap-6 text-center">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
                {copy.title}
                <span className="block text-brand">{copy.highlight}</span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="max-w-2xl text-lg text-muted-foreground"
            >
                {copy.subtitle}
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-4 sm:flex-row"
            >
                <Link href={loginUrl} className={cn(button({ intent: 'primary' }))}>
                    {copy.ctaLogin}
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Link>

                <Link
                    href={registerUrl}
                    className={cn(button({ intent: 'secondary' }))}
                >
                    {copy.ctaRegister}
                </Link>
            </motion.div>
        </section>
    );
}