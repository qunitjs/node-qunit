use strict;
use warnings;

binmode(STDIN);
binmode(STDOUT);

while (<STDIN>) {
  s/\r|\n//g;
  print;
  print "\r\n";
}
