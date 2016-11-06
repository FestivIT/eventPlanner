<?php

require_once dirname(__FILE__) . '/core.inc.php';

$session_lifetime = config::byKey('session_lifetime');
if (!is_numeric($session_lifetime)) {
	$session_lifetime = 24;
}
ini_set('session.gc_maxlifetime', $session_lifetime * 3600);
ini_set('session.use_cookies', 1);
ini_set('session.cookie_httponly', 1);
if (isset($_COOKIE['sess_id'])) {
	session_id($_COOKIE['sess_id']);
}
@session_start();
if (!headers_sent()) {
	setcookie('sess_id', session_id(), time() + 24 * 3600, "/", '', false, true);
}
@session_write_close();

if (!isConnect() && isset($_COOKIE['registerDevice'])) {
	if (loginByHash($_COOKIE['registerDevice'])) {
		setcookie('registerDevice', $_COOKIE['registerDevice'], time() + 365 * 24 * 3600, "/", '', false, true);
		if (isset($_COOKIE['eventPlanner_token'])) {
			@session_start();
			$_SESSION['eventPlanner_token'] = $_COOKIE['eventPlanner_token'];
			@session_write_close();
		}
	} else {
		setcookie('registerDevice', '', time() - 3600, "/", '', false, true);
	}
}

if (init('logout') == 1) {
	logout();
}


// * **************************Definition des function**************************

function login($_login, $_password) {
	$user = user::connect($_login, $_password);
	if (!is_object($user) || $user->getEnable() == 0) {
		sleep(5);
		return false;
	}
	
	@session_start();
	$_SESSION['user'] = $user;
	if (init('v') == 'd' && init('registerDevice') == 'on') {
		setcookie('registerDevice', $_SESSION['user']->getHash(), time() + 365 * 24 * 3600, "/", '', false, true);
		if (!isset($_COOKIE['eventPlanner_token'])) {
			setcookie('eventPlanner_token', ajax::getToken(), time() + 365 * 24 * 3600, "/", '', false, true);
		}
	}
	@session_write_close();
	//log::add('connection', 'info', __('Connexion de l\'utilisateur : ', __FILE__) . $_login);
	return true;
}

function loginByHash($_key) {
	$user = user::byHash($_key);
	if (!is_object($user) || $user->getEnable() == 0) {
		sleep(5);
		return false;
	}

	@session_start();
	$_SESSION['user'] = $user;
	@session_write_close();
	setcookie('registerDevice', $_key, time() + 365 * 24 * 3600, "/", '', false, true);
	if (!isset($_COOKIE['eventPlanner_token'])) {
		setcookie('eventPlanner_token', ajax::getToken(), time() + 365 * 24 * 3600, "/", '', false, true);
	}
	//log::add('connection', 'info', __('Connexion de l\'utilisateur par clef : ', __FILE__) . $user->getLogin());
	unset($_GET['auth']);
	return true;
}

function logout() {
	@session_start();
	setcookie('sess_id', '', time() - 3600, "/", '', false, true);
	setcookie('registerDevice', '', time() - 3600, "/", '', false, true);
	session_unset();
	session_destroy();
	return;
}

?>