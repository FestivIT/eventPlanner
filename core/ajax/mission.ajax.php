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
			$mission = mission::all(true);
			ajax::success($mission);
		}else{
			ajax::success(utils::o2a(mission::all(false)));
		}		
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

		ajax::success(utils::o2a($mission));
	}

	if (init('action') == 'updateState') {
		$listId = json_decode(init('listId'), true);
		$state = init('state');

		ajax::success(mission::updateState($listId, $state));
	}

	if (init('action') == 'byId') {
		if(init('fullData') == 'true'){
			$mission = mission::byId(init('id'), true);
			ajax::success($mission);
		}else{
			$mission = mission::byId(init('id'), false);
			if (isset($mission) && is_object($mission)) {
				ajax::success(utils::o2a($mission));
			}
		}
		throw new Exception('Mission introuvable: id=' . init('id'));
	}

	if (init('action') == 'byEventId') {
		if(init('fullData') == 'true'){
			$mission = mission::byEventId(init('eventId'), true);
			ajax::success($mission);
		}else{
			$mission = mission::byEventId(init('eventId'), false);
			ajax::success(utils::o2a($mission));
		}	
	}

	if (init('action') == 'byZoneId') {
		if(init('fullData') == 'true'){
			$mission = mission::byZoneId(init('zoneId'), true);
			ajax::success($mission);
		}else{
			$mission = mission::byZoneId(init('zoneId'), false);
			ajax::success(utils::o2a($mission));
		}	
	}

	if (init('action') == 'byUserId') {
		if(init('fullData') == 'true'){
			$mission = mission::byUserId(init('userId'), true);
			ajax::success($mission);
		}else{
			$mission = mission::byUserId(init('userId'), false);
			ajax::success(utils::o2a($mission));
		}	
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>