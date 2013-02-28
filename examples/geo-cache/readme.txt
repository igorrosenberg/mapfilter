# check latitude & longitude for place:
http://igor.rosenberg.free.fr/geo-cache/cache.php?address=paris,france

# retrieve a list of places to geocode
http://igor.rosenberg.free.fr/geo-cache/update.php?pass=update_key&limit=20

# insert a geolocation
http://igor.rosenberg.free.fr/geo-cache/update.php?pass=update_key&address=paris,france&latitude=2.38&longitude=48.86

# batch insert geolocations
wget http://www.blog.manit4c.com/wp-content/uploads/2011/09/liste_villes.csv
cat liste_villes.csv | sed 's/"//g' | cut -f 2,7,8 -d ';' | sed 's/;/\&latitude=/'| sed 's/;/\&longitude=/' | sed 's|^|sleep 0.02 ; wget -O - -o out "http://igor.rosenberg.free.fr/geo-cache/update.php?pass=update_key\&address=|' | sed 's/$/"/' | sh  

# batch check latitude & longitude
tac liste_villes.csv | sed 's/"//g' | cut -f 2,7,8 -d ';' | sed 's/;/\&extra1=/'| sed 's/;/\&extra2=/' | sed 's|^|sleep 0.02 ; wget -O - -o out "http://igor.rosenberg.free.fr/geo-cache/cache.php?pass=update_key\&address=|' | sed 's/$/"/' | sh


