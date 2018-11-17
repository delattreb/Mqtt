#!/bin/sh
echo "Stop services"
forever stop server.js
forever stop regulator.js
forever stop /home/dietpi/APIMQTT/app.js
