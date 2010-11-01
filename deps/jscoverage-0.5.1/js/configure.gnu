#!/bin/sh

export CC=gcc
export CXX=g++
export CPP="gcc -E"
export CXXCPP="g++ -E"

export MOZ_TOOLS=`pwd`/moztools
export PATH=$MOZ_TOOLS/bin:$PATH

rm -f config.cache
./configure --disable-jit --disable-tests --enable-static
