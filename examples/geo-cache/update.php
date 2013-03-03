<?php

  header("Content-Type: application/json");

  require 'passwords.php';

  function fail($message) {
    echo "{\"status\":\"KO\", \"message\":\"$message\"}";
    die();
  }
  
  function safe($sql) {
	 return mysql_real_escape_string($sql);
	}
	
  // db connexion
  if ( 0 != strcmp($update_key, $_GET['pass'])) 
      fail('wrong password');
  $db = @mysql_connect($host, $user, $password) or fail('database connection error: ' + mysql_error());
  mysql_select_db($dbname, $db) or fail('No such schema ' + $dbname +': '+ mysql_error());
  
  $address = $_GET['address'];
  if ( $address ) {
    // write user data to db
    $address = safe($address);
    $longitude = $_GET['longitude'];
    if ( ! $longitude ) 
		fail ('add longitude parameter');
    $latitude = $_GET['latitude'];
    if ( ! $latitude ) 
		fail ('add latitude parameter');
		
    $longitude = safe($longitude);
    $latitude = safe($latitude);

    $sql = 'INSERT INTO geocode ( address, latitude, longitude, date_created )' . 
           " VALUES ( '$address', '$latitude', '$longitude' , NOW() )" ;
    $result = mysql_query($sql);
    if (! $result) {
         fail ('DB write failed ' . mysql_error());
    }
    echo "{\"status\":\"OK\"}";
  } else {
    // read from db
    $limit = intval($_GET['limit']);
    if ($limit == 0)
    	$limit = 20;
    	
    $sql = 'SELECT id, address FROM geocode_pending ' .
          " ORDER BY id LIMIT $limit" ;
    $result = mysql_query($sql) or fail('Problem reading data from database: ' . mysql_error());
    $num_rows = mysql_num_rows($result);
    if ($num_rows == 0) {
    	fail('no addresses to geocode');
    }
    $json_msg = '';
    while ( $row = mysql_fetch_assoc($result) ){
      $id = $row['id'];
      $address = str_replace('\\','',$row['address']);
      $json_msg .= "{\"address\":\"$address\"},";
    }
	 $json_msg = substr($json_msg,0,-1) ;     
	 
    // delete data sent back
    $sql = "DELETE FROM geocode_pending WHERE id <= $id";
    $result = mysql_query($sql) or fail("Problem deleting data ($id) from database: " . mysql_error());

    echo "{\"status\":\"OK\", \"keys\": [ $json_msg ] }";    
  }
?>

