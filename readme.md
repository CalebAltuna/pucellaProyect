# Proiektua pisukide by Pu-cella2425

Objetivo:
Nuestro objetivo es crear una aplicación web que permita a los usuarios registrarse y gestionar sus pisos. Esta aplicación se llamará Pisukidea.

Características generales:
- Registro de usuarios
- Gestión de pisos
- Creación de pisos

Características en pisos:
- Añadir tareas, y gestionar las tareas
- Añadir gastos, y gestionar los gastos

Características en usuarios:
- Crear pisos
- Cambiar características de usuario

Requisitos:
- PHP 8.1
- Laravel 9
- Vue 3
- Tailwind CSS 3
- InertiaJS
- PostgreSQL

### Dudas frecuentes

1.Dónde están los componentes que determinan el texto de la página?

En la carpeta `resources/js/lib/content.ts` se encuentran las constantes que definen el texto de la página.

### Fallos en el código:

1. El dashboard no funciona. Se ve negro.
Motivo:


ENV:
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:A2CdfUFwzLClCOH0GrZtf6DJIfp4H+tG8jdcJS+LPuc=
APP_DEBUG=true
APP_URL=http://localhost:8080

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
# APP_MAINTENANCE_STORE=database

# PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=sqlite
# DB_HOST=mysql-db
# DB_PORT=3307
# DB_DATABASE=laravel_db
# DB_USERNAME=root
# DB_PASSWORD=rootpassword

ODOO_URL=http://odoo:8069
ODOO_DB=odoo
ODOO_USERNAME=admin@gmail.com
ODOO_PASSWORD=myodoo

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database
# CACHE_PREFIX=

MEMCACHED_HOST=127.0.0.1

QUEUE_CONNECTION=database
# REDIS_HOST=
# REDIS_PASSWORD=null
# REDIS_PORT=6379

MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"
