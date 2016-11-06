<?php

try {
	require_once dirname(__FILE__) . '/../../core/php/core.inc.php';
	include_file('core', 'authentification', 'php');

	if (!isConnect()) {
		throw new Exception(__('401 - Accès non autorisé', __FILE__));
	}

	ajax::init();

	if (init('action') == 'all') {
		ajax::success(utils::o2a(matType::all()));		
	}

	if (init('action') == 'save') {

		$matType_json = json_decode(init('matType'), true);
		
		if (isset($matType_json['id'])) {
			$matType = matType::byId($matType_json['id']);
		}

		if (!isset($matType) || !is_object($matType)) {
			$matType = new matType();
		}

		utils::a2o($matType, $matType_json);
		$matType->save();

		ajax::success(utils::o2a($matType));
	}

	if (init('action') == 'byId') {
		$matType = matType::byId(init('id'));
		if (isset($matType) && is_object($matType)) {
			ajax::success(utils::o2a($matType));
		}

		throw new Exception('MatType introuvable: id=' . init('id'));
	}


	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>