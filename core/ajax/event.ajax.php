<?php

try {
	require_once dirname(__FILE__) . '/../../core/php/core.inc.php';
	include_file('core', 'authentification', 'php');

	if (!isConnect()) {
		throw new Exception('401 - Accès non autorisé');
	}

	ajax::init();

	if (init('action') == 'all') {
		$event = utils::addPrefixToArray(utils::o2a(event::all()), 'event', true);

		ajax::success($event);
	}

	if (init('action') == 'save') {

		$event_json = json_decode(init('event'), true);
		
		if (isset($event_json['id'])) {
			$event = event::byId($event_json['id']);
		}

		if (!isset($event) || !is_object($event)) {
			$event = new event();
		}

		utils::a2o($event, $event_json);
		$event->save();
		$event->refresh();

		ajax::success(utils::addPrefixToArray(utils::o2a($event), 'event'));
	}

	// A SUPPRIMER
	if (init('action') == 'byDayInterval') {
		ajax::success(utils::o2a(event::byDayInterval(init('dayBefore'),init('dayAfter'))));
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>