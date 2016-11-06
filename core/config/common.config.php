<?php

/* * ********************* Debug **************** */
define('DEBUG', 0);
/* * *********************** MySQL & Memcached ******************* */
global $CONFIG;

$CONFIG = array(
	//MySQL parametres
	'db' => array(
		'host' => '127.0.0.1',
		'port' => '3306',
		'dbname' => 'eventPlanner',
		'username' => 'root',
		'password' => '',
	),
);

?>