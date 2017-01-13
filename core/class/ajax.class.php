<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class ajax {
	/*     * *************************Attributs****************************** */

	/*     * *********************Methode static ************************* */

	public static function init($_checkToken = true) {
		if (!headers_sent()) {
			header('Content-Type: application/json');
		}
		if ($_checkToken && init('eventplanner_token') != self::getToken()) {
			self::error(__('Token d\'accès invalide', __FILE__));
		}
	}

	public static function getToken() {
		if (session_status() == PHP_SESSION_NONE) {
			@session_start();
			@session_write_close();
		}
		if (!isset($_SESSION['eventplanner_token'])) {
			@session_start();
			$_SESSION['eventplanner_token'] = config::genKey();
			@session_write_close();
		}
		return $_SESSION['eventplanner_token'];
	}

	public static function success($_data = '') {
		echo self::getResponse($_data);
		die();
	}

	public static function error($_data = '', $_errorCode = 0) {
		echo self::getResponse($_data, $_errorCode);
		die();
	}

	public static function getResponse($_data = '', $_errorCode = null) {
		$isError = !(null === $_errorCode);
		$return = array(
			'state' => $isError ? 'error' : 'ok',
			'date' => date('Y-m-d H:i:s'),
			'result' => $_data,
		);
		if ($isError) {
			$return['code'] = $_errorCode;
		}
		return json_encode($return, JSON_UNESCAPED_UNICODE);
	}
	/*     * **********************Getteur Setteur*************************** */
}
