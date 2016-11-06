<?php

try {
	require_once dirname(__FILE__) . '/../../core/php/core.inc.php';
	include_file('core', 'authentification', 'php');
	ajax::init(false);

	if (init('action') == 'login') {
		if (!isConnect() && !login(init('username'), init('password'))) {
			throw new Exception('Mot de passe ou nom d\'utilisateur incorrect');
		}
		if (init('storeConnection') == 1) {
			setcookie('registerDevice', $_SESSION['user']->getHash(), time() + 365 * 24 * 3600, "/", '', false, true);
			if (!isset($_COOKIE['eventplanner_token'])) {
				setcookie('eventplanner_token', ajax::getToken(), time() + 365 * 24 * 3600, "/", '', false, true);
			}
		}
		ajax::success();
	}

	if (!isConnect()) {
		throw new Exception(__('401 - Accés non autorisÃ©', __FILE__), -1234);
	}

	ajax::init();

	if (init('action') == 'isConnect') {
		ajax::success();
	}

	if (init('action') == 'refresh') {
		@session_start();
		$_SESSION['user']->refresh();
		@session_write_close();
		ajax::success();
	}

	if (init('action') == 'logout') {
		logout();
		ajax::success();
	}

	if (init('action') == 'all') {
		$users = array();
		foreach (user::all() as $user) {
			$user_info = utils::o2a($user);
			$users[] = $user_info;
		}
		ajax::success($users);
	}

	if (init('action') == 'save') {

		$user_json = json_decode(init('user'), true);
		
		if (isset($user_json['id'])) {
			$user = user::byId($user_json['id']);
		}

		if (!isset($user) || !is_object($user)) {
			$user = new user();
		}

		utils::a2o($user, $user_json);
		$user->save();

		@session_start();
		$_SESSION['user']->refresh();
		@session_write_close();

		ajax::success(utils::o2a($user));
	}

	if (init('action') == 'remove') {
		$user = user::byId(init('id'));
		if (!is_object($user)) {
			throw new Exception('User id inconnu');
		}
		$user->remove();
		ajax::success();
	}

	if (init('action') == 'get') {
		ajax::success(utils::o2a($_SESSION['user']));
	}

	if (init('action') == 'setOptions') {
		$key = init('key');
		$value = init('value');

		$user = user::byId($_SESSION['user']->getId());
		
		if (is_object($user)) {
			$user->setOptions($key, $value);
			$user->save();
			@session_start();
			$_SESSION['user']->refresh();
			@session_write_close();

			ajax::success(utils::o2a($user));
		}

		throw new Exception('User inconnu');
	}

	if (init('action') == 'byId') {
		$user = user::byId(init('id'));
		if (isset($user) && is_object($user)) {
			ajax::success(utils::o2a($user));
		}

		throw new Exception('User introuvable: id=' . init('id'));
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}
?>