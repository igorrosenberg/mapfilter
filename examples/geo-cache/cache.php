<?php

require 'passwords.php';

  $db = @mysql_connect($host, $user, $password) or die('database connection error: ' + mysql_error());
    
  mysql_select_db($dbname, $db) or die('No such schema ' + $dbname +': '+ mysql_error());
  
   // write to db

  address = 'UPPER(' . mysql_real_escape_string($_GET['address']) . ')';

  $latitude =  48.00 + date('H:i:s') / 300; 
  $longitude = -1.70 + date('H:i:s') / 300;
  $sql = 'INSERT into geocode ( address, latitude, longitude, date_added )' . 
         " VALUES ( $address, $latitude, $longitude, NOW() );"
  
  $result = mysql_query($sql) or die ('Problem inserting data in database: ' + mysql_error());

   // read from db

  $sql = 'SELECT latitude,longitude FROM geocode ' +
	  " WHERE address LIKE '$address' LIMIT 1;"
  $result = mysql_query($sql) or die ('Problem reading data from database: ' + mysql_error());
  $row = mysql_fetch_assoc($result);
  echo $row['latitude'] . ',' . $row['longitude']);
?>
