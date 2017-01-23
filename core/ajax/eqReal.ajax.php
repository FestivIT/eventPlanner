<?php

try {
	require_once dirname(__FILE__) . '/../../core/php/core.inc.php';
	include_file('core', 'authentification', 'php');

	if (!isConnect()) {
		throw new Exception('401 - Accès non autorisé');
	}

	ajax::init();

	if (init('action') == 'all') {
		$eqReal = utils::addPrefixToArray(utils::o2a(eqReal::all()), 'eqReal', true);

		ajax::success($eqReal);
	}

	if (init('action') == 'save') {

		$eqReal_json = json_decode(init('eqReal'), true);
		
		if (isset($eqReal_json['id'])) {
			$eqReal = eqReal::byId($eqReal_json['id']);
		}

		if (!isset($eqReal) || !is_object($eqReal)) {
			$eqReal = new eqReal();
		}

		utils::a2o($eqReal, $eqReal_json);
		$eqReal->save();
		$eqReal->refresh();

		ajax::success(utils::addPrefixToArray(utils::o2a($eqReal), 'eqReal'));
	}

	if (init('action') == 'updateState') {
		$listId = json_decode(init('listId'), true);
		$state = init('state');

		ajax::success(utils::addPrefixToArray(eqReal::updateState($listId, $state), 'eqReal'));
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>