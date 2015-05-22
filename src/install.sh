#!/bin/sh

mkdir -p /usr/lib/upnp-service
cp upnp-service.js /usr/lib/upnp-service/upnp-service.js

cp upnp.service /lib/systemd/system
systemctl daemon-reload
systemctl enable upnp
