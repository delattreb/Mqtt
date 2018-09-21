#!/bin/sh
forever stop server.js
forever stop regulator.js
forever start -o server.log -e server_err.log server.js
forever start -o regulator.log -e regulator_err.log regulator.js
