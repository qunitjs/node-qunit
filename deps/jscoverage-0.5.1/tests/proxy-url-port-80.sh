#!/bin/sh
#    proxy-url-port-80.sh - test jscoverage-server --proxy with URL that requires free port 80
#    Copyright (C) 2008, 2009, 2010 siliconforks.com
#
#    This program is free software; you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation; either version 2 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License along
#    with this program; if not, write to the Free Software Foundation, Inc.,
#    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

set -e

# skip if server running on port 80
if wget -q -O- http://127.0.0.1/ > /dev/null 2> /dev/null
then
  exit 77
fi

shutdown() {
  wget -q -O- --post-data= "http://127.0.0.1:${proxy_server_port}/jscoverage-shutdown" > /dev/null
  wait $proxy_server_pid
}

cleanup() {
  shutdown
}

trap 'cleanup' 0 1 2 3 15

. ./common.sh

$VALGRIND jscoverage-server --proxy > OUT 2> ERR &
proxy_server_pid=$!
proxy_server_port=8080

wait_for_server http://127.0.0.1:8080/jscoverage.html

echo 504 > EXPECTED
! curl -f -w '%{http_code}\n' -x 127.0.0.1:8080 http://127.0.0.1:/index.html 2> /dev/null > ACTUAL
diff EXPECTED ACTUAL
