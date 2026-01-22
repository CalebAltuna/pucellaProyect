import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white/20 backdrop-blur-sm">
                <AppLogoIcon className="size-5 fill-current text-white" />
            </div>

            <div className="flex flex-col text-left">
                <span className="truncate text-sm font-bold leading-tight text-white tracking-wide">
                    Pucella
                </span>
            </div>
        </div>
    );
}
