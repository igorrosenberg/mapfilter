<?php
  header("Content-Type: text/json");

  require 'passwords.php';

  function fail(message){
    echo "{status:'KO', message:'$message'}";
    die($message);
  }
  
  // db connexion
  if ( ! $_GET['pass'].strcmp('update_key')) 
      fail('wrong password);
  $db = @mysql_connect($host, $user, $password) or fail('database connection error: ' + mysql_error());
  mysql_select_db($dbname, $db) or fail('No such schema ' + $dbname +': '+ mysql_error());
  
  $address = $_GET['address'];
  if ( ! $address ) {
    // read from db
    $limit = safe($_GET['limit']);
    $sql = 'SELECT id, address FROM geocode_pending ' .
          " ORDER_BY id LIMIT $limit;"
    $result = mysql_query($sql) or fail('Problem reading data from database: ' . mysql_error());
    json_msg = '';
    while ( $row = mysql_fetch_assoc($result) ){
      $id = $row['id'];
      $address = $row['address'];
      $json_msg .= "{id:$id, address:'$address'}";
    }
    echo "{status:'OK', keys: [ $json_msg ] }";
  } else {
    // write to db
    $id = safe($id);
    $address = safe($address);
    $latitude = safe($_GET['latitude']);
    $longitude = safe($_GET['longitude']);

    $sql = 'UPDATE geocode ( address, latitude, longitude )' . 
           " VALUES ( $address, $latitude, $longitude )" . 
           " WHERE id = $id ; "
    $result = mysql_query($sql);
    if (! $result) {
         fail ('DB write failed ' . mysql_error());
    }
  echo "{status:'OK'}";
  }
?>

