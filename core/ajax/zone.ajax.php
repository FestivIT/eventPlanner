<?php

try {
	require_once dirname(__FILE__) . '/../../core/php/core.inc.php';
	include_file('core', 'authentification', 'php');

	if (!isConnect()) {
		throw new Exception(__('401 - Accès non autorisé', __FILE__));
	}

	ajax::init();

	if (init('action') == 'all') {
		ajax::success(utils::o2a(zone::all()));
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

		ajax::success(utils::o2a($zone));
	}

	if (init('action') == 'byId') {
		
		$zone = zone::byId(init('id'));

		if (isset($zone) && is_object($zone)) {
			ajax::success(utils::o2a($zone));
		}

		throw new Exception('Zone introuvable: id=' . init('id'));
	}

	if (init('action') == 'byEventId') {
		
		$zones = zone::byEventId(init('eventId'));

		ajax::success(utils::o2a($zones));
	}

	if (init('action') == 'updateState') {
		$listId = json_decode(init('listId'), true);
		$state = init('state');

		ajax::success(zone::updateState($listId, $state));
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>