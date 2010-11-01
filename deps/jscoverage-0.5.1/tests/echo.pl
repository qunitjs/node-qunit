use strict;
use warnings;

foreach (@ARGV) {
  print eval '"' . $_ . '"';
}
