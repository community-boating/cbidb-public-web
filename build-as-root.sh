if [ "`whoami`" != "root" ]; then
  echo "Run this as root"
  exit
fi
rm /etc/nginx/sites-enabled/cbidb-public-web.conf
ln -s /etc/nginx/sites-available/cbidb-public-web-maintenance.conf /etc/nginx/sites-enabled/cbidb-public-web-maintenance.conf
service nginx restart
sudo -H -u node bash -c 'npm run build'
rm /etc/nginx/sites-enabled/cbidb-public-web-maintenance.conf
ln -s /etc/nginx/sites-available/cbidb-public-web.conf /etc/nginx/sites-enabled/cbidb-public-web.conf
service nginx restart
