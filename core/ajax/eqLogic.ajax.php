<?php

try {
	require_once dirname(__FILE__) . '/../../core/php/core.inc.php';
	include_file('core', 'authentification', 'php');

	if (!isConnect()) {
		throw new Exception('401 - Accès non autorisé');
	}

	ajax::init();

	if (init('action') == 'all') {
		$eqLogic = utils::addPrefixToArray(utils::o2a(eqLogic::byEventId($_SESSION['user']->getOptions('eventId'))), 'eqLogic', true);

		ajax::success($eqLogic);
	}

	if (init('action') == 'save') {

		$eqLogic_json = json_decode(init('eqLogic'), true);
		
		if (isset($eqLogic_json['id'])) {
			$eqLogic = eqLogic::byId($eqLogic_json['id']);
		}

		if (!isset($eqLogic) || !is_object($eqLogic)) {
			$eqLogic = new eqLogic();
		}

		utils::a2o($eqLogic, $eqLogic_json);
		$eqLogic->save();
		$eqLogic->refresh();

		ajax::success(utils::addPrefixToArray(utils::o2a($eqLogic), 'eqLogic'));
	}

	if (init('action') == 'updateState') {
		$listId = json_decode(init('listId'), true);
		$state = init('state');

		$eqLogic = utils::addPrefixToArray(utils::o2a(eqLogic::updateState($listId, $state)), 'eqLogic', true);
		ajax::success($eqLogic);	
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>