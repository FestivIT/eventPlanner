<?php

try {
	require_once dirname(__FILE__) . '/../../core/php/core.inc.php';
	include_file('core', 'authentification', 'php');

	if (!isConnect()) {
		throw new Exception('401 - Accès non autorisé');
	}

	ajax::init();

	if (init('action') == 'all') {
		if(init('fullData') == 'true'){
			$eqLink = eqLink::all(true);
			ajax::success($eqLink);
		}else{
			ajax::success(utils::o2a(eqLink::all(false)));
		}	
	}

	if (init('action') == 'save') {

		$eqLink_json = json_decode(init('eqLink'), true);
		
		if (isset($eqLink_json['id'])) {
			$eqLink = eqLink::byId($eqLink_json['id']);
		}

		if (!isset($eqLink) || !is_object($eqLink)) {
			$eqLink = new eqLink();
		}

		utils::a2o($eqLink, $eqLink_json);
		$eqLink->save();

		ajax::success(utils::o2a($eqLink));
	}

	if (init('action') == 'byId') {
		if(init('fullData') == 'true'){
			$eqLink = eqLink::byId(init('id'), true);
			ajax::success($eqLink);
		}else{
			$eqLink = eqLink::byId(init('id'), false);
			if (isset($eqLink) && is_object($eqLink)) {
				ajax::success(utils::o2a($eqLink));
			}
		}
		throw new Exception('Matériel introuvable: id=' . init('id'));
	}

	if (init('action') == 'byEqLogicId') {
		if(init('fullData') == 'true'){
			$eqLink = eqLink::byEqLogicId(init('eqLogicId'), true);
			ajax::success($eqLink);
		}else{
			$eqLink = eqLink::byEqLogicId(init('eqLogicId'), false);
			ajax::success(utils::o2a($eqLink));
		}
	}

	if (init('action') == 'byEventId') {
		if(init('fullData') == 'true'){
			$eqLink = eqLink::byEventId(init('eventId'), true);
			ajax::success($eqLink);
		}else{
			$eqLink = eqLink::byEventId(init('eventId'), false);
			ajax::success(utils::o2a($eqLink));
		}
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>