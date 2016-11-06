<?php

try {
	require_once dirname(__FILE__) . '/../../core/php/core.inc.php';
	include_file('core', 'authentification', 'php');

	if (!isConnect()) {
		throw new Exception(__('401 - Accès non autorisé', __FILE__));
	}

	ajax::init();

	if (init('action') == 'all') {
		ajax::success(utils::o2a(event::all()));
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

		ajax::success(utils::o2a($event));
	}

	if (init('action') == 'byId') {
		
		$event = event::byId(init('id'));

		if (isset($event) && is_object($event)) {
			ajax::success(utils::o2a($event));
		}

		throw new Exception('Evenement introuvable: id=' . init('id'));
	}

	if (init('action') == 'byDayInterval') {
		ajax::success(utils::o2a(event::byDayInterval(init('dayBefore'),init('dayAfter'))));
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>