<?php
require_once dirname(__FILE__) . "/core/php/core.inc.php";

function include_authenticated_file($_folder, $_fn, $_type, $alert_folder) {
	include_file('core', 'authentification', 'php');
	try {
		if (!isConnect()) {
			throw new Exception('{{401 - Accès non autorisé}}');
		}
		include_file($_folder, $_fn, $_type);
	} catch (Exception $e) {
		$_folder = 'desktop/modal';
		ob_end_clean(); //Clean pile after expetion (to prevent no-traduction)
		echo '<div class="alert alert-danger div_alert">';
		echo displayExeption($e);
		echo '</div>';
	}
}

if (isset($_GET['modal'])) {
	$alert_folder = 'desktop/modal/' . init('modal') . '.php';
	include_authenticated_file('desktop', init('modal'), 'modal',  $alert_folder);
} elseif (isset($_GET['ajax']) && $_GET['ajax'] == 1) {
	$alert_folder = 'desktop/php/' . init('modal') . '.php';
	include_authenticated_file('desktop', init('p'), 'php', $alert_folder);
} else {
	include_file('desktop', 'index', 'php');
}