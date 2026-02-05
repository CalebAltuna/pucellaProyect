<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

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

        <script>
            /*
            Want to customize your button? visit our documentation page:
            https://login.equalweb.com/custom-button
            */
            window.interdeal = {
                get sitekey() {
                    return "128385f675d2215b6d7c4fb6f1f838a5"
                },
                get domains() {
                    return {
                        "js": "https://cdn.equalweb.com/",
                        "acc": "https://access.equalweb.com/"
                    }
                },
                "Position": "left",
                "Menulang": "ES",
                "draggable": true,
                "btnStyle": {
                    "vPosition": [
                        "80%",
                        "80%"
                    ],
                    "margin": [
                        "0",
                        "0"
                    ],
                    "scale": [
                        "0.5",
                        "0.5"
                    ],
                    "color": {
                        "main": "#1c4bb6",
                        "second": "#ffffff"
                    },
                    "icon": {
                        "outline": false,
                        "outlineColor": "#ffffff",
                        "type": 1,
                        "shape": "circle"
                    }
                },

            };

            (function(doc, head, body) {
                var coreCall = doc.createElement('script');
                coreCall.src = interdeal.domains.js + 'core/5.2.5/accessibility.js';
                coreCall.defer = true;
                coreCall.integrity = 'sha512-Zamp30ps601kXvZTcIYv1sytUc090mrEJD9rLuoWzEGqmB6t0XdLRgC/g5TznUleEBIMm6T3c6Baf/ExIYh/Hw==';
                coreCall.crossOrigin = 'anonymous';
                coreCall.setAttribute('data-cfasync', true);
                body ? body.appendChild(coreCall) : head.appendChild(coreCall);
            })(document, document.head, document.body);
        </script>
        </body>
</html>