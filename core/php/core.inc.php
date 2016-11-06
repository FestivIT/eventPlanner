<?php

date_default_timezone_set('Europe/Brussels');

require_once dirname(__FILE__) . '/../../vendor/autoload.php';
require_once dirname(__FILE__) . '/../config/common.config.php';
require_once dirname(__FILE__) . '/../class/DB.class.php';
require_once dirname(__FILE__) . '/../class/config.class.php';
require_once dirname(__FILE__) . '/utils.inc.php';

//include_file('core', 'eventPlanner', 'config');
include_file('core', 'utils', 'class');
//include_file('core', 'log', 'class');


function eventPlannerCoreAutoload($classname) {
	try {
		include_file('core', $classname, 'class');
	} catch (Exception $e) {

	}
}

/*
try {
	if (isset($configs['log::level'])) {
		log::define_error_reporting($configs['log::level']);
	}
} catch (Exception $e) {

}
*/


spl_autoload_register('eventPlannerCoreAutoload', true, true);

?>