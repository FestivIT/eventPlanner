<?php

try {
	require_once dirname(__FILE__) . '/../../core/php/core.inc.php';
	include_file('core', 'authentification', 'php');

	if (!isConnect()) {
		throw new Exception('401 - Accès non autorisé');
	}

	ajax::init();

	if (init('action') == 'all') {
		$msg = utils::addPrefixToArray(utils::o2a(msg::byEventId($_SESSION['user']->getOptions('eventId'))), 'msg', true);

		ajax::success($msg);
	}

	if (init('action') == 'save') {

		$msg_json = json_decode(init('msg'), true);
		
		if (isset($msg_json['id'])) {
			$msg = msg::byId($msg_json['id']);
		}

		if (!isset($msg) || !is_object($msg)) {
			$msg = new msg();
		}

		utils::a2o($msg, $msg_json);
		$msg->save();
		$msg->refresh(); // récupération de la date automatiquement ajoutée dans la BDD
		
		ajax::success(utils::addPrefixToArray(utils::o2a($msg), 'msg'));
	}

	if (init('action') == 'sinceId') {
		$msg = utils::addPrefixToArray(utils::o2a(msg::byEventIdSinceId(init('id'), $_SESSION['user']->getOptions('eventId'))), 'msg', true);

		ajax::success($msg);
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>