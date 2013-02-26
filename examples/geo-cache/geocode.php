<?php
  header("Content-Type: text/xml");
?>
<locations>
<?php

  $db = @ mysql_connect('localhost', 'DBUSER', 'DBPASSWORD');

  if (!$db) {
    die("Sorry, database error!");
  }

  mysql_select_db('DBNAME',$db);

  $sql = "SELECT * FROM  `postcodes` WHERE `postcode` = UPPER('" . $_GET['postcode'] . "') AND `date_added` >  DATE_SUB(NOW(), INTERVAL 1 DAY)";

  if ($result = mysql_query($sql))
  {
    if (mysql_num_rows($result) > 0)
    {
      $location = mysql_fetch_array($result);
      echo "\t<location postcode='" . $location['postcode'] . "' latitude='" . $location['latitude'] . "' longitude='" . $location['longitude'] . "' date_added='" . $location['date_added'] ."' />\n";
    }
  }

?>
</locations>
