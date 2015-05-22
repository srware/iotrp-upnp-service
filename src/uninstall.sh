#!/bin/sh

rm -rf /usr/lib/upnp-service

systemctl stop upnp
systemctl disable upnp
rm /lib/systemd/system/upnp.service

systemctl daemon-reload
