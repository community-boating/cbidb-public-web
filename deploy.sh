#!/bin/bash

/usr/bin/expect <<EOD
spawn scp -r build root@159.65.226.25:/home/alexb/cbidb-public-web
expect "*:*"
send "Maddie14"
expect eof
echo "you're out"
end
