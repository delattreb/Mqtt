#!/bin/sh
forever stop server.js
forever stop regulator.js
forever start -o server.log -e err_server.log server.js
forever start -o regulator.log -e err_regulator.log regulator.js
