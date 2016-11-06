<?php

require_once dirname(__FILE__) . '/core.inc.php';
$file = dirname(__FILE__) . '/../../' . init('file');
$pathinfo = pathinfo($file);
if ($pathinfo['extension'] != 'js' && $pathinfo['extension'] != 'css') {
	die();
}
if (file_exists($file)) {
	switch ($pathinfo['extension']) {
		case 'js':
			$contentType = 'application/javascript';
			$md5 = init('md5');
			$etagFile = ($md5 == '') ? md5_file($file) : $md5;
			break;
		case 'css':
			$contentType = 'text/css';
			$etagFile = md5_file($file);
			break;
		default:
			die();
	}
	header('Content-Type: ' . $contentType);
	$lastModified = filemtime($file);
	$ifModifiedSince = (isset($_SERVER['HTTP_IF_MODIFIED_SINCE']) ? $_SERVER['HTTP_IF_MODIFIED_SINCE'] : false);
	$etagHeader = (isset($_SERVER['HTTP_IF_NONE_MATCH']) ? trim($_SERVER['HTTP_IF_NONE_MATCH']) : false);
	header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $lastModified) . ' GMT');
	header('Etag: ' . $etagFile);
	header('Cache-Control: public');
	if (@strtotime($_SERVER['HTTP_IF_MODIFIED_SINCE']) == $lastModified || $etagHeader == $etagFile) {
		header('HTTP/1.1 304 Not Modified');
		exit;
	}
	echo file_get_contents($file);
	exit;
}