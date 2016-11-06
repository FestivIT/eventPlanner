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
			$msg = msg::all(true);
			ajax::success($msg);
		}else{
			ajax::success(utils::o2a(msg::all(false)));
		}		
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

		ajax::success(utils::o2a($msg));
	}

	if (init('action') == 'byId') {
		if(init('fullData') == 'true'){
			$msg = msg::byId(init('id'), true);
			ajax::success($msg);
		}else{
			$msg = msg::byId(init('id'), false);
			if (isset($msg) && is_object($msg)) {
				ajax::success(utils::o2a($msg));
			}
		}
		throw new Exception('Msg introuvable: id=' . init('id'));
	}

	if (init('action') == 'byEventId') {
		if(init('fullData') == 'true'){
			$msg = msg::byEventId(init('eventId'), true);
			ajax::success($msg);
		}else{
			$msg = msg::byEventId(init('eventId'), false);
			ajax::success(utils::o2a($msg));
		}	
	}

	if (init('action') == 'byZoneId') {
		if(init('fullData') == 'true'){
			$msg = msg::byZoneId(init('zoneId'), true);
			ajax::success($msg);
		}else{
			$msg = msg::byZoneId(init('zoneId'), false);
			ajax::success(utils::o2a($msg));
		}	
	}

	if (init('action') == 'byEqId') {
		if(init('fullData') == 'true'){
			$msg = msg::byEqId(init('eqId'), true);
			ajax::success($msg);
		}else{
			$msg = msg::byEqId(init('eqId'), false);
			ajax::success(utils::o2a($msg));
		}	
	}

	if (init('action') == 'byUserId') {
		if(init('fullData') == 'true'){
			$msg = msg::byUserId(init('userId'), true);
			ajax::success($msg);
		}else{
			$msg = msg::byUserId(init('userId'), false);
			ajax::success(utils::o2a($msg));
		}	
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>