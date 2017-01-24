<?php

try {
	require_once dirname(__FILE__) . '/../../core/php/core.inc.php';
	include_file('core', 'authentification', 'php');

	if (!isConnect()) {
		throw new Exception('401 - Accès non autorisé');
	}

	ajax::init();

	if (init('action') == 'all') {
		$mission = utils::addPrefixToArray(utils::o2a(mission::byEventId($_SESSION['user']->getOptions('eventId'))), 'mission', true);

		ajax::success($mission);
	}

	if (init('action') == 'save') {

		$mission_json = json_decode(init('mission'), true);
		
		if (isset($mission_json['id'])) {
			$mission = mission::byId($mission_json['id']);
		}

		if (!isset($mission) || !is_object($mission)) {
			$mission = new mission();
		}

		utils::a2o($mission, $mission_json);
		$mission->save();
		$mission->refresh();

		ajax::success(utils::addPrefixToArray(utils::o2a($mission), 'mission'));
	}

	if (init('action') == 'updateState') {
		$listId = json_decode(init('listId'), true);
		$state = init('state');

		$mission = utils::addPrefixToArray(utils::o2a(mission::updateState($listId, $state)), 'mission', true);
		ajax::success($mission);
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>