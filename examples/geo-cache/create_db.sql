CREATE TABLE `postcodes` (
  `id` int(11) NOT NULL auto_increment,
  `postcode` text NOT NULL,
  `latitude` float NOT NULL default '0',
  `longitude` float NOT NULL default '0',
  `date_created` datetime DEFAULT CURRENT_TIMESTAMP
  `date_modified`  datetime DEFAULT ON UPDATE CURRENT_TIMESTAMP
  PRIMARY KEY  (`id`)
)
