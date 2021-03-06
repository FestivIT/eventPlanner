<?php

use Symfony\Component\ExpressionLanguage\ExpressionLanguage;

function include_file($_folder, $_fn, $_type) {
	$type = 'php';
	if ($_folder == '3rdparty') {
		$_fn .= '.' . $_type;
		$path = dirname(__FILE__) . '/../../' . $_folder . '/' . $_fn;
		$type = ($_type == 'css' || $_type == 'js') ? $_type : $type;
	} else {
		$config = array(
			'class' => array('/class', '.class.php', 'php'),
			'config' => array('/config', '.config.php', 'php'),
			'modal' => array('/modal', '.php', 'php'),
			'php' => array('/php', '.php', 'php'),
			'css' => array('/css', '.css', 'css'),
			'js' => array('/js', '.js', 'js'),
			'class.js' => array('/js', '.class.js', 'js'),
			'api' => array('/api', '.api.php', 'php'),
			'html' => array('/html', '.html', 'php'),
			'configuration' => array('', '.php', 'php'),
		);
		$_folder .= $config[$_type][0];
		$_fn .= $config[$_type][1];
		$type = $config[$_type][2];
	}
	
	$path = dirname(__FILE__) . '/../../' . $_folder . '/' . $_fn;
	
	if (file_exists($path)) {
		if ($type == 'php') {
			//ob_start();
			require_once $path;
			//echo translate::exec(ob_get_clean(), $_folder . '/' . $_fn);
		} else if ($type == 'css') {
			echo '<link href="' . $_folder . '/' . $_fn . '?md5=' . md5_file($path) . '" rel="stylesheet" />';
		} else if ($type == 'js') {
			echo '<script type="text/javascript" src="core/php/getResource.php?file=' . $_folder . '/' . $_fn . '&md5=' . md5_file($path) . '"></script>';
		}
	} else {
		throw new Exception('File not found : ' . $_fn, 35486);
	}
}

function init($_name, $_default = '') {
	if (isset($_GET[$_name])) {
		$cache[$_name] = $_GET[$_name];
		return $_GET[$_name];
	}
	if (isset($_POST[$_name])) {
		$cache[$_name] = $_POST[$_name];
		return $_POST[$_name];
	}
	if (isset($_REQUEST[$_name])) {
		$cache[$_name] = $_REQUEST[$_name];
		return $_REQUEST[$_name];
	}
	return $_default;
}

function sendVarToJS($_varName, $_value) {
	$_value = (is_array($_value))
	? 'jQuery.parseJSON("' . addslashes(json_encode($_value, JSON_UNESCAPED_UNICODE)) . '")'
	: '"' . $_value . '"'
	;
	echo '<script>'
		. 'var ' . $_varName . ' = ' . $_value . ';'
		. '</script>';
}

function resizeImage($contents, $width, $height) {
// Cacul des nouvelles dimensions
	$width_orig = imagesx($contents);
	$height_orig = imagesy($contents);
	$ratio_orig = $width_orig / $height_orig;
	$test = $width / $height > $ratio_orig;
	$dest_width = $test ? ceil($height * $ratio_orig) : $width;
	$dest_height = $test ? $height : ceil($width / $ratio_orig);
	$dest_image = imagecreatetruecolor($width, $height);
	$wh = imagecolorallocate($dest_image, 0xFF, 0xFF, 0xFF);
	imagefill($dest_image, 0, 0, $wh);
	$offcet_x = ($width - $dest_width) / 2;
	$offcet_y = ($height - $dest_height) / 2;
	if ($dest_image && $contents) {
		if (!imagecopyresampled($dest_image, $contents, $offcet_x, $offcet_y, 0, 0, $dest_width, $dest_height, $width_orig, $height_orig)) {
			error_log("Error image copy resampled");
			return false;
		}
	}
// start buffering
	ob_start();
	imagejpeg($dest_image);
	$contents = ob_get_contents();
	ob_end_clean();
	return $contents;
}

function getmicrotime() {
	list($usec, $sec) = explode(" ", microtime());
	return ((float) $usec + (float) $sec);
}

function redirect($_url, $_forceType = null) {
	if ($_forceType == 'JS' || headers_sent() || isset($_GET['ajax'])) {
		echo '<script type="text/javascript">';
		echo "window.location.href='$_url';";
		echo '</script>';
	} else {
		exit(header("Location: $_url"));
	}
	return;
}

function convertDuration($time) {
	$result = '';
	$unities = array('j' => 86400, 'h' => 3600, 'min' => 60);
	foreach ($unities as $unity => $value) {
		if ($time >= $value || $result != '') {
			$result .= floor($time / $value) . $unity . ' ';
			$time %= $value;
		}
	}
	$result .= $time . 's';
	return $result;
}

function getClientIp() {
	$sources = array(
		'HTTP_X_REAL_IP',
		'HTTP_X_FORWARDED_FOR',
		'HTTP_CLIENT_IP',
		'REMOTE_ADDR',
	);
	foreach ($sources as $source) {
		if (isset($_SERVER[$source])) {
			return $_SERVER[$source];
		}
	}
	return '';
}

function mySqlIsHere() {
	require_once dirname(__FILE__) . '/../class/DB.class.php';
	return is_object(DB::getConnection());
}

function displayExeption($e) {
	$message = '<span id="span_errorMessage">' . $e->getMessage() . '</span>';
	if (DEBUG) {
		$message .= '<a class="pull-right bt_errorShowTrace cursor">Show traces</a>';
		$message .= '<br/><pre class="pre_errorTrace" style="display : none;">' . print_r($e->getTrace(), true) . '</pre>';
	}
	return $message;
}

function is_json($_string) {
	return ((is_string($_string) && (is_object(json_decode($_string)) || is_array(json_decode($_string))))) ? true : false;
}

function is_sha1($_string = '') {
	if ($_string == '') {
		return false;
	}
	return preg_match('/^[0-9a-f]{40}$/i', $_string);
}

function cleanPath($path) {
	$out = array();
	foreach (explode('/', $path) as $i => $fold) {
		if ($fold == '' || $fold == '.') {
			continue;
		}
		if ($fold == '..' && $i > 0 && end($out) != '..') {
			array_pop($out);
		} else {
			$out[] = $fold;
		}
	}
	return ($path{0} == '/' ? '/' : '') . join('/', $out);
}

function getRootPath() {
	return cleanPath(dirname(__FILE__) . '/../../');
}

function hadFileRight($_allowPath, $_path) {
	$path = cleanPath($_path);
	foreach ($_allowPath as $right) {
		if (strpos($right, '/') !== false || strpos($right, '\\') !== false) {
			if (strpos($right, '/') !== 0 || strpos($right, '\\') !== 0) {
				$right = getRootPath() . '/' . $right;
			}
			if (dirname($path) == $right || $path == $right) {
				return true;
			}
		} else {
			if (basename(dirname($path)) == $right || basename($path) == $right) {
				return true;
			}
		}
	}
	return false;
}

function getVersion($_name) {
	return eventPlanner::version();
}

function ls($folder = "", $pattern = "*", $recursivly = false, $options = array('files', 'folders')) {
	if ($folder) {
		$current_folder = realpath('.');
		if (in_array('quiet', $options)) {
			// If quiet is on, we will suppress the 'no such folder' error
			if (!file_exists($folder)) {
				return array();
			}
		}
		if (!is_dir($folder) || !chdir($folder)) {
			return array();
		}
	}
	$get_files = in_array('files', $options);
	$get_folders = in_array('folders', $options);
	$both = array();
	$folders = array();
	// Get the all files and folders in the given directory.
	if ($get_files) {
		$both = array();
		foreach (glob($pattern, GLOB_BRACE + GLOB_MARK) as $file) {
			if (!is_dir($folder . '/' . $file)) {
				$both[] = $file;
			}
		}
	}
	if ($recursivly or $get_folders) {
		$folders = glob("*", GLOB_ONLYDIR + GLOB_MARK);
	}
	//If a pattern is specified, make sure even the folders match that pattern.
	$matching_folders = array();
	if ($pattern !== '*') {
		$matching_folders = glob($pattern, GLOB_ONLYDIR + GLOB_MARK);
	}
	//Get just the files by removing the folders from the list of all files.
	$all = array_values(array_diff($both, $folders));
	if ($recursivly or $get_folders) {
		foreach ($folders as $this_folder) {
			if ($get_folders) {
				//If a pattern is specified, make sure even the folders match that pattern.
				if ($pattern !== '*') {
					if (in_array($this_folder, $matching_folders)) {
						array_push($all, $this_folder);
					}
				} else {
					array_push($all, $this_folder);
				}
			}
			if ($recursivly) {
				// Continue calling this function for all the folders
				$deep_items = ls($pattern, $this_folder, $recursivly, $options); # :RECURSION:
				foreach ($deep_items as $item) {
					array_push($all, $this_folder . $item);
				}
			}
		}
	}
	if ($folder && is_dir($current_folder)) {
		chdir($current_folder);
	}
	if (in_array('datetime_asc', $options)) {
		global $current_dir;
		$current_dir = $folder;
		usort($all, function ($a, $b) {
			return filemtime($GLOBALS['current_dir'] . '/' . $a) < filemtime($GLOBALS['current_dir'] . '/' . $b);
		});
	}
	if (in_array('datetime_desc', $options)) {
		global $current_dir;
		$current_dir = $folder;
		usort($all, function ($a, $b) {
			return filemtime($GLOBALS['current_dir'] . '/' . $a) > filemtime($GLOBALS['current_dir'] . '/' . $b);
		});
	}
	return $all;
}

function removeCR($_string) {
	$_string = str_replace("\n", '', $_string);
	$_string = str_replace("\r\n", '', $_string);
	$_string = str_replace("\r", '', $_string);
	$_string = str_replace("\n\r", '', $_string);
	return trim($_string);
}

function rcopy($src, $dst, $_emptyDest = true, $_exclude = array(), $_noError = false) {
	if (!file_exists($src)) {
		return true;
	}
	if ($_emptyDest) {
		rrmdir($dst);
	}
	if (is_dir($src)) {
		if (!file_exists($dst)) {
			@mkdir($dst);
		}
		$files = scandir($src);
		foreach ($files as $file) {
			if ($file != "." && $file != ".." && !in_array($file, $_exclude) && !in_array(realpath($src . '/' . $file), $_exclude)) {
				if (!rcopy($src . '/' . $file, $dst . '/' . $file, $_emptyDest, $_exclude, $_noError) && !$_noError) {
					return false;
				}
			}
		}
	} else {
		if (!in_array(basename($src), $_exclude) && !in_array(realpath($src), $_exclude)) {
			if (!$_noError) {
				return copy($src, $dst);
			} else {
				@copy($src, $dst);
				return true;
			}
		}
	}
	return true;
}

// removes files and non-empty directories
function rrmdir($dir) {
	if (is_dir($dir)) {
		$files = scandir($dir);
		foreach ($files as $file) {
			if ($file != "." && $file != "..") {
				rrmdir("$dir/$file");
			}
		}
		if (!rmdir($dir)) {
			return false;
		}
	} else if (file_exists($dir)) {
		return unlink($dir);
	}
	return true;
}

function date_fr($date_en) {
	if (config::byKey('language', 'core', 'fr_FR') == 'en_US') {
		return $date_en;
	}
	$texte_long_en = array(
		"Monday", "Tuesday", "Wednesday", "Thursday",
		"Friday", "Saturday", "Sunday", "January",
		"February", "March", "April", "May",
		"June", "July", "August", "September",
		"October", "November", "December",
	);
	$texte_short_en = array(
		"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
		"Aug", "Sep", "Oct", "Nov", "Dec",
	);
	switch (config::byKey('language', 'core', 'fr_FR')) {
		case 'fr_FR':
			$texte_long = array(
				"Lundi", "Mardi", "Mercredi", "Jeudi",
				"Vendredi", "Samedi", "Dimanche", "Janvier",
				"Février", "Mars", "Avril", "Mai",
				"Juin", "Juillet", "Août", "Septembre",
				"Octobre", "Novembre", "Décembre",
			);
			$texte_short = array(
				"Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim",
				"Jan", "Fev", "Mar", "Avr", "Mai", "Jui",
				"Jui", "Aou;", "Sep", "Oct", "Nov", "Dec",
			);
			break;
		case 'de_DE':
			$texte_long = array(
				"Montag", "Dienstag", "Mittwoch", "Donnerstag",
				"Freitag", "Samstag", "Sonntag", "Januar",
				"Februar", "März", "April", "May",
				"Juni", "July", "August", "September",
				"October", "November", "December",
			);
			$texte_short = array(
				"Mon", "Die", "Mit", "Thu", "Don", "Sam", "Son",
				"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
				"Aug", "Sep", "Oct", "Nov", "Dec",
			);
			break;
		default:
			return $date_en;
			break;
	}
	return str_replace($texte_short_en, $texte_short, str_replace($texte_long_en, $texte_long, $date_en));
}

function convertDayEnToFr($_day) {
	switch (config::byKey('language', 'core', 'fr_FR')) {
		case 'fr_FR':
			if ($_day == 'Monday' || $_day == 'Mon') {
				return 'Lundi';
			}
			if ($_day == 'monday' || $_day == 'mon') {
				return 'lundi';
			}
			if ($_day == 'Tuesday' || $_day == 'Tue') {
				return 'Mardi';
			}
			if ($_day == 'tuesday' || $_day == 'tue') {
				return 'mardi';
			}
			if ($_day == 'Wednesday' || $_day == 'Wed') {
				return 'Mercredi';
			}
			if ($_day == 'wednesday' || $_day == 'wed') {
				return 'mercredi';
			}
			if ($_day == 'Thursday' || $_day == 'Thu') {
				return 'Jeudi';
			}
			if ($_day == 'thursday' || $_day == 'thu') {
				return 'Jeudi';
			}
			if ($_day == 'Friday' || $_day == 'Fri') {
				return 'Vendredi';
			}
			if ($_day == 'friday' || $_day == 'fri') {
				return 'vendredi';
			}
			if ($_day == 'Saturday' || $_day == 'Sat') {
				return 'Samedi';
			}
			if ($_day == 'saturday' || $_day == 'sat') {
				return 'samedi';
			}
			if ($_day == 'Sunday' || $_day == 'Sun') {
				return 'Dimanche';
			}
			if ($_day == 'sunday' || $_day == 'sun') {
				return 'dimanche';
			}
		case 'de_DE':
			if ($_day == 'Monday' || $_day == 'Mon') {
				return 'Montag';
			}
			if ($_day == 'monday' || $_day == 'mon') {
				return 'montag';
			}
			if ($_day == 'Tuesday' || $_day == 'Tue') {
				return 'Donnerstag';
			}
			if ($_day == 'tuesday' || $_day == 'tue') {
				return 'donnerstag';
			}
			if ($_day == 'Wednesday' || $_day == 'Wed') {
				return 'Mittwoch';
			}
			if ($_day == 'wednesday' || $_day == 'wed') {
				return 'mittwoch';
			}
			if ($_day == 'Thursday' || $_day == 'Thu') {
				return 'Donnerstag';
			}
			if ($_day == 'thursday' || $_day == 'thu') {
				return 'Donnerstag';
			}
			if ($_day == 'Friday' || $_day == 'Fri') {
				return 'Freitag';
			}
			if ($_day == 'friday' || $_day == 'fri') {
				return 'freitag';
			}
			if ($_day == 'Saturday' || $_day == 'Sat') {
				return 'Samstag';
			}
			if ($_day == 'saturday' || $_day == 'sat') {
				return 'samstag';
			}
			if ($_day == 'Sunday' || $_day == 'Sun') {
				return 'Sonntag';
			}
			if ($_day == 'sunday' || $_day == 'sun') {
				return 'Sonntag';
			}
	}
	return $_day;
}

function create_zip($source_arr, $destination) {
	if (is_string($source_arr)) {
		$source_arr = array($source_arr);
	}
	// convert it to array
	if (!extension_loaded('zip')) {
		throw new Exception('Extension php ZIP non chargée');
	}
	$zip = new ZipArchive();
	if (!$zip->open($destination, ZIPARCHIVE::CREATE)) {
		throw new Exception('Impossible de creer l\'archive ZIP dans le dossier de destination : ' . $destination);
	}
	foreach ($source_arr as $source) {
		if (!file_exists($source)) {
			continue;
		}
		$source = str_replace('\\', '/', realpath($source));
		if (is_dir($source) === true) {
			$files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source), RecursiveIteratorIterator::SELF_FIRST);
			foreach ($files as $file) {
				if (strpos($file, $source) === false) {
					continue;
				}
				if ($file == $source . '/..') {
					continue;
				}
				if ($file == $source . '/.') {
					continue;
				}
				$file = str_replace('\\', '/', realpath($file));
				if (is_dir($file) === true) {
					$zip->addEmptyDir(str_replace($source . '/', '', $file . '/'));
				} else if (is_file($file) === true) {
					$zip->addFromString(str_replace($source . '/', '', $file), file_get_contents($file));
				}
			}
		} else if (is_file($source) === true) {
			$zip->addFromString(basename($source), file_get_contents($source));
		}
	}
	return $zip->close();
}

function br2nl($string) {
	return preg_replace('/\<br(\s*)?\/?\>/i', "\n", $string);
}

function calculPath($_path) {
	if (strpos($_path, '/') !== 0) {
		return dirname(__FILE__) . '/../../' . $_path;
	}
	return $_path;
}

function getDirectorySize($path) {
	$totalsize = 0;
	if ($handle = opendir($path)) {
		while (false !== ($file = readdir($handle))) {
			$nextpath = $path . '/' . $file;
			if ($file != '.' && $file != '..' && !is_link($nextpath)) {
				if (is_dir($nextpath)) {
					$totalsize += getDirectorySize($nextpath);
				} elseif (is_file($nextpath)) {
					$totalsize += filesize($nextpath);
				}
			}
		}
		closedir($handle);
	}
	return $totalsize;
}

function sizeFormat($size) {
	$mod = 1024;
	$units = explode(' ', 'B KB MB GB TB PB');
	for ($i = 0; $size > $mod; $i++) {
		$size /= $mod;
	}
	return round($size, 2) . ' ' . $units[$i];
}

function netMatch($network, $ip) {
	$network = trim($network);
	$orig_network = $network;
	$ip = trim($ip);
	if ($ip == $network) {
		return TRUE;
	}
	$network = str_replace(' ', '', $network);
	if (strpos($network, '*') !== FALSE) {
		if (strpos($network, '/') !== FALSE) {
			$asParts = explode('/', $network);
			$network = @$asParts[0];
		}
		$nCount = substr_count($network, '*');
		$network = str_replace('*', '0', $network);
		if ($nCount == 1) {
			$network .= '/24';
		} else if ($nCount == 2) {
			$network .= '/16';
		} else if ($nCount == 3) {
			$network .= '/8';
		} else if ($nCount > 3) {
			return TRUE; // if *.*.*.*, then all, so matched
		}
	}
	$d = strpos($network, '-');
	if ($d === FALSE) {
		if (strpos($network, '/') === false) {
			if ($ip == $network) {
				return true;
			}
			return false;
		}
		$ip_arr = explode('/', $network);
		if (!preg_match("@\d*\.\d*\.\d*\.\d*@", $ip_arr[0], $matches)) {
			$ip_arr[0] .= ".0"; // Alternate form 194.1.4/24
		}
		$network_long = ip2long($ip_arr[0]);
		$x = ip2long($ip_arr[1]);
		$mask = long2ip($x) == $ip_arr[1] ? $x : (0xffffffff << (32 - $ip_arr[1]));
		$ip_long = ip2long($ip);
		return ($ip_long & $mask) == ($network_long & $mask);
	} else {
		$from = trim(ip2long(substr($network, 0, $d)));
		$to = trim(ip2long(substr($network, $d + 1)));
		$ip = ip2long($ip);
		return ($ip >= $from and $ip <= $to);
	}
	return false;
}

function getNtpTime() {
	$time_servers = array(
		'ntp2.emn.fr',
		'time-a.timefreq.bldrdoc.gov',
		'utcnist.colorado.edu',
		'time.nist.gov',
		'ntp.pads.ufrj.br',
	);
	$time_adjustment = 0;
	foreach ($time_servers as $time_server) {
		$fp = fsockopen($time_server, 37, $errno, $errstr, 1);
		if ($fp) {
			$data = NULL;
			while (!feof($fp)) {
				$data .= fgets($fp, 128);
			}
			fclose($fp);
			if (strlen($data) == 4) {
				$NTPtime = ord($data{0}) * pow(256, 3) + ord($data{1}) * pow(256, 2) + ord($data{2}) * 256 + ord($data{3});
				$TimeFrom1990 = $NTPtime - 2840140800;
				$TimeNow = $TimeFrom1990 + 631152000;
				return date("m/d/Y H:i:s", $TimeNow + $time_adjustment);
			}
		}
	}
	return false;
}

function cast($sourceObject, $destination) {
	if (is_string($destination)) {
		$destination = new $destination();
	}
	$sourceReflection = new ReflectionObject($sourceObject);
	$destinationReflection = new ReflectionObject($destination);
	$sourceProperties = $sourceReflection->getProperties();
	foreach ($sourceProperties as $sourceProperty) {
		$sourceProperty->setAccessible(true);
		$name = $sourceProperty->getName();
		$value = $sourceProperty->getValue($sourceObject);
		if ($destinationReflection->hasProperty($name)) {
			$propDest = $destinationReflection->getProperty($name);
			$propDest->setAccessible(true);
			$propDest->setValue($destination, $value);
		} else {
			$destination->$name = $value;
		}
	}
	return $destination;
}

function getIpFromString($_string) {
	$result = parse_url($_string);
	if (isset($result['host'])) {
		$_string = $result['host'];
	} else {
		$_string = str_replace(array('https://', 'http://'), '', $_string);
		if (strpos($_string, '/') !== false) {
			$_string = substr($_string, 0, strpos($_string, '/'));
		}
		if (strpos($_string, ':') !== false) {
			$_string = substr($_string, 0, strpos($_string, ':'));
		}
	}
	if (!filter_var($_string, FILTER_VALIDATE_IP)) {
		$_string = gethostbyname($_string);
	}
	return $_string;
}

function secureXSS($_string) {
	return str_replace('&amp;', '&', htmlspecialchars(strip_tags($_string), ENT_QUOTES | ENT_HTML5, 'UTF-8'));
}

function minify($buffer) {
	$search = array(
		'/\>[^\S ]+/s', // strip whitespaces after tags, except space
		'/[^\S ]+\</s', // strip whitespaces before tags, except space
		'/(\s)+/s', // shorten multiple whitespace sequences
	);
	$replace = array(
		'>',
		'<',
		'\\1',
	);
	return preg_replace($search, $replace, $buffer);
}

function sanitizeAccent($_message) {
	$caracteres = array(
		'À' => 'a', 'Á' => 'a', 'Â' => 'a', 'Ä' => 'a', 'à' => 'a', 'á' => 'a', 'â' => 'a', 'ä' => 'a', '@' => 'a',
		'È' => 'e', 'É' => 'e', 'Ê' => 'e', 'Ë' => 'e', 'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e', '€' => 'e',
		'Ì' => 'i', 'Í' => 'i', 'Î' => 'i', 'Ï' => 'i', 'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i',
		'Ò' => 'o', 'Ó' => 'o', 'Ô' => 'o', 'Ö' => 'o', 'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'ö' => 'o',
		'Ù' => 'u', 'Ú' => 'u', 'Û' => 'u', 'Ü' => 'u', 'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ü' => 'u', 'µ' => 'u',
		'Œ' => 'oe', 'œ' => 'oe',
		'$' => 's');
	return preg_replace('#[^A-Za-z0-9 \n\.\'=\*:]+\##', '', strtr($_message, $caracteres));
}

function isConnect($_right = '') {
	if (session_status() == PHP_SESSION_DISABLED || !isset($_SESSION) || !isset($_SESSION['user'])) {
		return false;
	}
	if (is_object($_SESSION['user']) && $_SESSION['user']->is_Connected()) {
		// Actualisation
		@session_start();
		$_SESSION['user']->refresh();
		@session_write_close();

		if ($_right != '') {
			return ($_SESSION['user']->getRights($_right) == 1) ? true : false;
		}
		return true;
	}
	return false;
}

function hasRight($_right, $_needAdmin = false) {
	if (!isConnect()) {
		return false;
	}
	if (!isset($_SESSION['rights']) || !is_array($_SESSION['rights'])) {
		@session_start();
		$_SESSION['rights'] = array();
		@session_write_close();
	}
	if (isset($_SESSION['rights']['*'])) {
		return $_SESSION['rights']['*'];
	}
	if (isset($_SESSION['rights'][$_right])) {
		if ($_SESSION['rights'][$_right] == -1) {
			return !$_needAdmin;
		}
		return $_SESSION['rights'][$_right];
	}
	if (isConnect('admin')) {
		@session_start();
		$_SESSION['rights']['*'] = true;
		@session_write_close();
		return true;
	}
	if (config::byKey('rights::enable') == 0) {
		return !$_needAdmin;
	}
	$rights = rights::byuserIdAndEntity($_SESSION['user']->getId(), $_right);
	if (!is_object($rights)) {
		@session_start();
		$_SESSION['rights'][$_right] = -1;
		@session_write_close();
		return !$_needAdmin;
	}
	@session_start();
	$_SESSION['rights'][$_right] = $rights->getRight();
	@session_write_close();
	return $_SESSION['rights'][$_right];
}

function ZipErrorMessage($code) {
	switch ($code) {
		case 0:
			return 'No error';
		case 1:
			return 'Multi-disk zip archives not supported';
		case 2:
			return 'Renaming temporary file failed';
		case 3:
			return 'Closing zip archive failed';
		case 4:
			return 'Seek error';
		case 5:
			return 'Read error';
		case 6:
			return 'Write error';
		case 7:
			return 'CRC error';
		case 8:
			return 'Containing zip archive was closed';
		case 9:
			return 'No such file';
		case 10:
			return 'File already exists';
		case 11:
			return 'Can\'t open file';
		case 12:
			return 'Failure to create temporary file';
		case 13:
			return 'Zlib error';
		case 14:
			return 'Malloc failure';
		case 15:
			return 'Entry has been changed';
		case 16:
			return 'Compression method not supported';
		case 17:
			return 'Premature EOF';
		case 18:
			return 'Invalid argument';
		case 19:
			return 'Not a zip archive';
		case 20:
			return 'Internal error';
		case 21:
			return 'Zip archive inconsistent';
		case 22:
			return 'Can\'t remove file';
		case 23:
			return 'Entry has been deleted';
		default:
			return 'An unknown error has occurred(' . intval($code) . ')';
	}
}

$STATE = json_decode(file_get_contents(dirname(__FILE__) . '/../../core/config/stateList.json'));
$STATE->stateList = array();

foreach ($STATE as $items) {
	if(is_object($items) and property_exists($items, 'groups')){
	    foreach ($items->groups as $group) {
	    	foreach ($group->list as $key => $etat) {
		    	$STATE->stateList[$key] = $etat;
		    }
	    }
	}
}

function getStateText($state){
	global $STATE;

	return $STATE->stateList[$state]->text;
}

function getZoneStateEqLogic($state){
	global $STATE;
	
	if(property_exists($STATE->stateList[$state] , 'eqLogicState')){
		return $STATE->stateList[$state]->eqLogicState;
	}else{
		return false;
	}
}

function getStateColorClass($state){
	global $STATE;

	return $STATE->stateList[$state]->colorClass;
}