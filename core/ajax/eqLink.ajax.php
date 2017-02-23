<?php

try {
	require_once dirname(__FILE__) . '/../../core/php/core.inc.php';
	include_file('core', 'authentification', 'php');

	if (!isConnect()) {
		throw new Exception('401 - Accès non autorisé');
	}

	ajax::init();

	if (init('action') == 'all') {
		$eqLink = utils::addPrefixToArray(utils::o2a(eqLink::byEventId($_SESSION['user']->getEventId())), 'eqLink', true);

		ajax::success($eqLink);
	}

	if (init('action') == 'save') {

		$eqLogic_json = json_decode(init('eqLink'), true);
		
		if (isset($eqLogic_json['id'])) {
			$eqLink = eqLink::byId($eqLogic_json['id']);
		}

		if (!isset($eqLink) || !is_object($eqLink)) {
			$eqLink = new eqLink();
		}

		utils::a2o($eqLink, $eqLogic_json);
		$eqLink->save();
		$eqLink->refresh();

		ajax::success(utils::addPrefixToArray(utils::o2a($eqLink), 'eqLink'));
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>