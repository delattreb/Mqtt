#!/bin/sh
nohup node mosca.js &
nohup node regulator.js &
cd /home/dietpi/docker/
sudo ./up.sh




