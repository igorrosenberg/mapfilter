<?php

  $db = @ mysql_connect('localhost', 'DBUSER', 'DBPASSWORD');
  
  if (!$db) {
    die("Sorry, database error!");
  }
  
  mysql_select_db('DBNAME',$db);
  
  $sql = "INSERT into `postcodes` (  `postcode` ,  `latitude` ,  `longitude` ,  `date_added` ) VALUES (UPPER('" . mysql_real_escape_string($_GET['postcode']) . "'),  '" . mysql_real_escape_string($_GET['latitude']) . "',  '" . mysql_real_escape_string($_GET['longitude']) . "', NOW( ))";
  
  if ($result = mysql_query($sql))
  {
    echo "Success";
  }else{
    echo "Problem";
  }
  
?>
