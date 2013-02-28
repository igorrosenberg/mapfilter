CREATE TABLE `postcodes` (
  `id` int(11) NOT NULL auto_increment,
  `postcode` text NOT NULL,
  `latitude` float NOT NULL default '0',
  `longitude` float NOT NULL default '0',
  `date_added` datetime default NULL,
  PRIMARY KEY  (`id`)
)

CREATE TABLE `geocode_pending` (
  `id` int(11) NOT NULL auto_increment,
  `address` text NOT NULL UNIQUE,
  `date_added` datetime default NULL,
  PRIMARY KEY  (`id`)
);

ADD INDEX ON ADDRESS

