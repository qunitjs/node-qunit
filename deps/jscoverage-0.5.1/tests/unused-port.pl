#!/usr/bin/perl

use strict;
use warnings;

use Socket;

my $proto = getprotobyname('tcp');
socket(SOCKET, PF_INET, SOCK_STREAM, $proto) or die "socket: $!";

# http://www.perlmonks.org/?node_id=579649
# http://code.activestate.com/recipes/531822-pick-unused-port/
bind(SOCKET, sockaddr_in(0, INADDR_LOOPBACK)) or die "bind: $!";

my $ip_address_and_port = getsockname(SOCKET);
my ($port, $ip_address) = sockaddr_in($ip_address_and_port);
print "$port\n";
close(SOCKET) or die "close: $!";
