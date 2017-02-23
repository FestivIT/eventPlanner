<?php

try {
	require_once dirname(__FILE__) . '/../../core/php/core.inc.php';
	include_file('core', 'authentification', 'php');

	if (!isConnect()) {
		throw new Exception('401 - Accès non autorisé');
	}

	ajax::init();

	if (init('action') == 'all') {
		$zone = utils::addPrefixToArray(utils::o2a(zone::byEventId($_SESSION['user']->getEventId())), 'zone', true);

		ajax::success($zone);
	}

	if (init('action') == 'save') {

		$zone_json = json_decode(init('zone'), true);
		
		if (isset($zone_json['id'])) {
			$zone = zone::byId($zone_json['id']);
		}

		if (!isset($zone) || !is_object($zone)) {
			$zone = new zone();
		}

		utils::a2o($zone, $zone_json);
		$zone->save();
		$zone->refresh();

		ajax::success(utils::addPrefixToArray(utils::o2a($zone), 'zone'));
	}

	if (init('action') == 'updateState') {
		$listId = json_decode(init('listId'), true);
		$state = init('state');

		$zone = utils::addPrefixToArray(utils::o2a(zone::updateState($listId, $state)), 'zone', true);
		ajax::success($zone);
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>