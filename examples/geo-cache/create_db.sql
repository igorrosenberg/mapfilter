# works for mysql 5.0.x

CREATE TABLE `geocode` (
  `id` int(11) NOT NULL auto_increment,
  `address` text NOT NULL COMMENT 'the place to geolocalize',
  `latitude` float NOT NULL default '0',
  `longitude` float NOT NULL default '0',
  `date_created` timestamp DEFAULT 0,
  `date_modified`  timestamp ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`)
);
