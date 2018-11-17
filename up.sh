#!/bin/sh
echo "Stop services"
forever stop server.js
forever stop regulator.js
forever stop app.js

echo "Start API services"
NODE_ENV=production forever start -e err_api.log /home/dietpi/APIMQTT/app.js
echo "Wait 10s"
sleep 10
forever start -o server.log -e err_server.log server.js
forever start -o regulator.log -e err_regulator.log regulator.js
