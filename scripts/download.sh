#!/bin/sh

set -e

wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64 -O ./bin/cloud_sql_proxy_linux_amd64 --quiet
wget https://dl.google.com/cloudsql/cloud_sql_proxy.linux.386 -O ./bin/cloud_sql_proxy_linux_amd32 --quiet
wget https://dl.google.com/cloudsql/cloud_sql_proxy.darwin.amd64 -O ./bin/cloud_sql_proxy_macos_amd64 --quiet
wget https://dl.google.com/cloudsql/cloud_sql_proxy.darwin.386 -O ./bin/cloud_sql_proxy_macos_amd32 --quiet

chmod +x ./bin/cloud_sql_proxy_linux_amd64
chmod +x  ./bin/cloud_sql_proxy_linux_amd32
chmod +x ./bin/cloud_sql_proxy_macos_amd64
chmod +x ./bin/cloud_sql_proxy_macos_amd32