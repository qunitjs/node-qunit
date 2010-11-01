#!/bin/sh
#    mozilla.sh - test --mozilla option
#    Copyright (C) 2007, 2008, 2009, 2010 siliconforks.com
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

trap 'rm -fr EXPECTED ACTUAL' 1 2 3 15

export PATH=.:..:$PATH

rm -fr EXPECTED ACTUAL

cp -r mozilla.expected EXPECTED
mkdir EXPECTED/modules
cp ../jscoverage.jsm EXPECTED/modules/
mkdir EXPECTED/chrome
cp ../jscoverage.manifest EXPECTED/chrome
mkdir EXPECTED/chrome/jscoverage
cp ../jscoverage.css ../jscoverage-highlight.css \
   ../jscoverage-throbber.gif \
   ../jscoverage.html \
   ../jscoverage.js ../jscoverage-overlay.js \
   ../jscoverage.xul \
   EXPECTED/chrome/jscoverage/
find EXPECTED -name .svn | xargs rm -fr

$VALGRIND jscoverage --mozilla --exclude=.svn mozilla ACTUAL
test -d ACTUAL
diff --strip-trailing-cr -r EXPECTED ACTUAL

rm -fr EXPECTED ACTUAL
