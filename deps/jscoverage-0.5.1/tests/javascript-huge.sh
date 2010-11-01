#!/bin/sh
#    javascript-huge.sh - test .js file with more than 65535 lines
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

trap 'rm -fr DIR DIR2 OUT ERR' 1 2 3 15

export PATH=.:..:$PATH

rm -fr DIR DIR2

# huge JavaScript file
mkdir -p DIR
perl -e 'for (1 .. 65536) {print "x = $_\n";}' > DIR/big.js
$VALGRIND jscoverage DIR DIR2 > OUT 2> ERR
test ! -s OUT
test ! -s ERR
grep -q -F "_\$jscoverage['big.js'][65536] = 0;" DIR2/big.js
grep -q -F "_\$jscoverage['big.js'][65536]++;" DIR2/big.js

# rm -fr DIR DIR2 OUT ERR
