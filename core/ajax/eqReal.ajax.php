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
			$eqReal = eqReal::all(true);
			ajax::success($eqReal);
		}else{
			ajax::success(utils::o2a(eqReal::all(false)));
		}	
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

		ajax::success(utils::o2a($eqReal));
	}

	if (init('action') == 'byId') {
		if(init('fullData') == 'true'){
			$eqReal = eqReal::byId(init('id'), true);
			ajax::success($eqReal);
		}else{
			$eqReal = eqReal::byId(init('id'), false);
			if (isset($eqReal) && is_object($eqReal)) {
				ajax::success(utils::o2a($eqReal));
			}
		}
		throw new Exception('Matériel introuvable: id=' . init('id'));
	}

	if (init('action') == 'updateState') {
		$listId = json_decode(init('listId'), true);
		$state = init('state');

		ajax::success(eqReal::updateState($listId, $state));
	}

	if (init('action') == 'byMatTypeId') {
		if(init('fullData') == 'true'){
			$eqReal = eqReal::byMatTypeId(init('matTypeId'), true);
			ajax::success($eqReal);
		}else{
			$eqReal = eqReal::byMatTypeId(init('matTypeId'), false);
			ajax::success(utils::o2a($eqReal));
		}
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>