#!/bin/bash

# Funtzio hau exekutatuko da scripta gelditzen denean (Ctrl+C egitean)
# 'kill 0' komandoak script honen seme-prozesu guztiak hilko ditu
trap "kill 0" EXIT

echo "🚀 Laravel zerbitzuak abiarazten..."
echo "-----------------------------------"

# 'schedule:work' atzealdean abiarazi (& ikurrarekin)
php artisan schedule:work &
PID_SCHED=$!
echo "[v] Schedule worker martxan (PID: $PID_SCHED)"

# 'queue:work' atzealdean abiarazi (& ikurrarekin)
php artisan queue:work &
PID_QUEUE=$!
echo "[v] Queue worker martxan (PID: $PID_QUEUE)"

echo "-----------------------------------"
echo "Gelditzeko, sakatu Ctrl+C"

# 'wait' komandoak scripta irekita mantentzen du prozesuak martxan dauden bitartean
wait