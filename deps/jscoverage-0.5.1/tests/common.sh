export PATH=.:..:../js:$PATH

json_cmp() {
  echo 'EXPECTED = ' | cat - $1 > EXPECTED
  echo 'ACTUAL = ' | cat - $2 > ACTUAL
  js -f EXPECTED -f ACTUAL -f json-cmp.js
}

add_header_to_file() {
  source=$1
  destination=$2
  cat ../header.txt  ../header.js $source > $destination
}

add_header_to_files() {
  directory=$1
  cp -R $directory EXPECTED
  find EXPECTED -name .svn | xargs rm -fr
  for i in `find EXPECTED -name '*.js'`
  do
    add_header_to_file $i TMP-common.js
    mv TMP-common.js $i
  done
}

wait_for_server() {
  url=$1
  i=0
  while [ $i -lt 20 ] && ! wget -q -O- $url > /dev/null 2> /dev/null
  do
    i=`expr $i + 1`
    sleep 0.5
  done
  if [ $i = 20 ]
  then
    echo 'server failed to start, giving up'
    exit 1
  fi
}

wait_for_server_shutdown() {
  url=$1
  i=0
  while [ $i -lt 20 ] && wget -q -O- $url > /dev/null 2> /dev/null
  do
    counter=`expr $i + 1`
    sleep 0.5
  done
  if [ $i = 20 ]
  then
    echo 'server failed to stop, giving up'
    exit 1
  fi
}
