<?php

try {
	require_once dirname(__FILE__) . '/../../core/php/core.inc.php';
	include_file('core', 'authentification', 'php');

	if (!isConnect()) {
		throw new Exception(__('401 - Accès non autorisé', __FILE__));
	}

	ajax::init();

	if (init('action') == 'all') {
		if(init('fullData') == 'true'){
			$eqLogic = eqLogic::all(true);
			ajax::success($eqLogic);
		}else{
			ajax::success(utils::o2a(eqLogic::all(false)));
		}		
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

		ajax::success(utils::o2a($eqLogic));
	}

	if (init('action') == 'updateState') {
		$listId = json_decode(init('listId'), true);
		$state = init('state');

		ajax::success(eqLogic::updateState($listId, $state));
	}

	if (init('action') == 'byId') {
		if(init('fullData') == 'true'){
			$eqLogic = eqLogic::byId(init('id'), true);
			ajax::success($eqLogic);
		}else{
			$eqLogic = eqLogic::byId(init('id'), false);
			if (isset($eqLogic) && is_object($eqLogic)) {
				ajax::success(utils::o2a($eqLogic));
			}
		}
		throw new Exception('Msg introuvable: id=' . init('id'));
	}

	if (init('action') == 'byEventId') {
		if(init('fullData') == 'true'){
			$eqLogic = eqLogic::byEventId(init('eventId'), true);
			ajax::success($eqLogic);
		}else{
			$eqLogic = eqLogic::byEventId(init('eventId'), false);
			ajax::success(utils::o2a($eqLogic));
		}	
	}

	if (init('action') == 'byZoneId') {
		if(init('fullData') == 'true'){
			$eqLogic = eqLogic::byZoneId(init('zoneId'), true);
			ajax::success($eqLogic);
		}else{
			$eqLogic = eqLogic::byZoneId(init('zoneId'), false);
			ajax::success(utils::o2a($eqLogic));
		}	
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>