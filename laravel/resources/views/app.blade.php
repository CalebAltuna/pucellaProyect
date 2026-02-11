<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="description" content= "Pisuak antolatzeko webgunea. Antolatu garbiketa txandak, banatu gastuak eta saihestu gatazkak pisukideen artean modu digitalean.">
    <meta name="keywords" content="pisu partekatua, ikasleak, gastuak, atazak, elkarbizitza, euskadi, odoo, laravel">
    <meta name="author" content="PuCELLa">
    <meta name="robots" content="index, follow">

    <meta property="og:type" content="website">
    <meta property="og:title" content="Pisukide">
    <meta property="og:description" content="Zure pisukideak ez du platerik garbitzen? Probatu gure app berria zereginak eta gastuak kudeatzeko.">
    <meta property="og:url" content="{{ url()->current() }}">
    
    <meta property="og:image" content="{{ asset('favicon.svg') }}">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Pisu Partekatuak | Kudeaketa Integrala">
    <meta name="twitter:description" content="Antolatu zure pisua erraztasunez.">
    <script>
        (function () {
            const appearance = '{{ $appearance ?? "system" }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <title inertia>Pisu Partekatuak | Kudeatu zure elkarbizitza erraz</title>

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>