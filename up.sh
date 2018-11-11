#!/bin/sh
forever stop server.js
forever stop regulator.js
forever stop app.js
forever start -o server.log -e err_server.log server.js
forever start -o regulator.log -e err_regulator.log regulator.js
sleep 10
NODE_ENV=production forever start -e err_api.log app.js