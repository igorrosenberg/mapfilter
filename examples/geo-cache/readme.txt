http://igor.rosenberg.free.fr/geo-cache/cache.php?address=rennes,france
http://igor.rosenberg.free.fr/geo-cache/update.php?pass=update_key
http://igor.rosenberg.free.fr/geo-cache/update.php?pass=update_key&address=cesson,france&latitude=-1.5&longitude=47.6

wget http://www.blog.manit4c.com/wp-content/uploads/2011/09/liste_villes.csv
cat liste_villes.csv | sed 's/"//g' | cut -f 2,7,8 -d ';' | sed 's/;/\&latitude=/'| sed 's/;/\&longitude=/' | sed 's|^|sleep 0.02 ; wget -O - -o out "http://igor.rosenberg.free.fr/geo-cache/update.php?pass=update_key\&address=|' | sed 's/$/"/' | sh  
