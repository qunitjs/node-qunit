#!/bin/sh
#    store-spaces.sh - test storing coverage reports with URLs containing spaces
#    Copyright (C) 2009, 2010 siliconforks.com
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

. ./common.sh

shutdown() {
  wget -q -O- --post-data= "http://127.0.0.1:${server_port}/jscoverage-shutdown" > /dev/null
  wait $server_pid
}

cleanup() {
  rm -fr DIR 'recursive with spaces'
  # kill $server_pid
  shutdown
}

trap 'cleanup' 0 1 2 3 15

rm -fr DIR 'recursive with spaces'
cp -r recursive 'recursive with spaces'
$VALGRIND jscoverage-server --no-highlight --report-dir=DIR &
server_pid=$!
server_port=8080

wait_for_server http://127.0.0.1:8080/jscoverage.html

cat store.json | sed "s/@PREFIX@/\\/recursive%20with%20spaces\\//g" > TMP
wget --post-file=TMP -q -O- http://127.0.0.1:8080/jscoverage-store > /dev/null
cat store.expected.json | sed "s/@PREFIX@/\\/recursive%20with%20spaces\\//g" > TMP
json_cmp TMP DIR/jscoverage.json
