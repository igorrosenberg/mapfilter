<?php

  header("Content-Type: application/json");

  require 'passwords.php';

  $db = @mysql_connect($host, $user, $password) or die('database connection error: ' . mysql_error());

  mysql_select_db($dbname, $db) or die('No such schema ' . $dbname . ': ' . mysql_error());
  
  // sanitation
  if ($_GET['address']);
     $address = mysql_real_escape_string( strtoupper($_GET['address']));
  else
     die('please provide an "address" parameter');
  
  // read from db
  $sql = 'SELECT latitude,longitude FROM geocode ' .
	  " WHERE address LIKE '$address' LIMIT 1;";
  $result = mysql_query($sql) or die ('Problem reading data from database: ' . mysql_error());
  $row = mysql_fetch_assoc($result);

  if ($row) {
    echo '{"lat":'.$row['latitude'].',"lng":'.$row['longitude'].'}' ;
  } else {
		 // write to pending db
		 $sql = 'INSERT into geocode_pending(address)' .
		        " VALUES ( '$address' );";
		 $result = mysql_query($sql);
		 if (! $result) {
		      // $msg = 'DB write failed: ' . mysql_error(); // failed to write to cache pending list
     		 die('key not found in cache');	 
		 } else {
     		 die('key was not found in cache');	 
		 }
		 
  }
?>

