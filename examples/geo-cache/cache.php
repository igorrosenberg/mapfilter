<?php

  require 'passwords.php';

  $db = @mysql_connect($host, $user, $password) or die('database connection error: ' + mysql_error());
    
  mysql_select_db($dbname, $db) or die('No such schema ' + $dbname +': '+ mysql_error());
  
  // sanitation
  $address = $_GET['address'];
  if ($address)
     $address = 'UPPER(' . mysql_real_escape_string($_GET['address']) . ')';
  else
     die('please provide an "address" parameter');
  
  // read from db
  $sql = 'SELECT latitude,longitude FROM geocode ' .
	  " WHERE address LIKE '$address' LIMIT 1;"
  $result = mysql_query($sql) or die ('Problem reading data from database: ' . mysql_error());
  $row = mysql_fetch_assoc($result);

  if ($row) {
    $latitude = $row['latitude'];
    $longitude = $row['latitude'];
    $msg = 'cache hit';
  } else {
    //poll remote geocode service
    $latitude =  48.00 + date('s') / 300; 
    $longitude = -1.70 + date('s') / 300;
    $msg = 'remote service hit';

    // write to db
    $sql = 'INSERT into geocode ( address, latitude, longitude, date_added )' . 
           " VALUES ( $address, $latitude, $longitude, NOW() );"
    $result = mysql_query($sql);
    if (! $result){
         $msg .= ' but DB write failed ' . mysql_error();
    }
  }
  echo "{lat:$latitude,lng:$longitude,msg:'$message'}";
?>

