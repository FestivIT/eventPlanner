<?php
require_once dirname(__FILE__) . '/utils.inc.php';
echo '<link rel="stylesheet" href="3rdparty/font-awesome/css/font-awesome.min.css">' . "\n";
$root_dir = dirname(__FILE__) . '/../../core/css/icon/';

foreach (ls($root_dir, '*') as $dir) {
	if (is_dir($root_dir . $dir) && file_exists($root_dir . $dir . '/style.css')) {
		echo '<link rel="stylesheet" href="core/css/icon/' . $dir . 'style.css?md5=' . md5($root_dir . $dir . '/style.css') . '">' . "\n";
	}
}
?>