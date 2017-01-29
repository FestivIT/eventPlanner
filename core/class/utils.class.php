<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../php/core.inc.php';

class utils {
	/*     * *************************Attributs****************************** */

	/*     * ***********************Methode static*************************** */
	public static function formatDateYmd2Dmy($date){
		$newdate = new DateTime($date);
		return $newdate->format('d/m/Y');
	}

	public static function formatDateDmy2Ymd($date){
		$newdate = DateTime::createFromFormat('d/m/Y', $date);
		return $newdate->format('Y-m-d');
	}

	public static function o2a($_object, $_noToArray = false) {
		if (is_array($_object)) {
			$return = array();
			foreach ($_object as $object) {
				$return[] = self::o2a($object);
			}
			return $return;
		}
		$array = array();
		if (!is_object($_object)) {
			return $array;
		}
		if (!$_noToArray && method_exists($_object, 'toArray')) {
			return $_object->toArray();
		}
		$reflections = array();
		$uuid = spl_object_hash($_object);
		if (!class_exists(get_class($_object))) {
			return array();
		}
		if (!isset($reflections[$uuid])) {
			$reflections[$uuid] = new ReflectionClass($_object);
		}
		$reflection = $reflections[$uuid];
		$properties = $reflection->getProperties();
		foreach ($properties as $property) {
			$name = $property->getName();
			if ('_' !== $name[0]) {
				$method = 'get' . ucfirst($name);
				if (method_exists($_object, $method)) {
					$value = $_object->$method();
				} else {
					$property->setAccessible(true);
					$value = $property->getValue($_object);
					$property->setAccessible(false);
				}
				if (is_json($value)) {
					$array[$name] = json_decode($value, true);
				} else {
					$array[$name] = $value;
				}
			}
		}
		return $array;
	}

	public static function a2o(&$_object, $_data) {
		if (is_array($_data)) {
			foreach ($_data as $key => $value) {
				$method = 'set' . ucfirst($key);
				if (method_exists($_object, $method)) {
					$function = new ReflectionMethod($_object, $method);
					if (is_json($value)) {
						$value = json_decode($value, true);
					}
					if (is_array($value)) {
						if ($function->getNumberOfRequiredParameters() == 2) {
							foreach ($value as $arrayKey => $arrayValue) {
								if (is_array($arrayValue)) {
									if ($function->getNumberOfRequiredParameters() == 3) {
										foreach ($arrayValue as $arrayArraykey => $arrayArrayvalue) {
											$_object->$method($arrayKey, $arrayArraykey, $arrayArrayvalue);
										}
									} else {
										$_object->$method($arrayKey, $arrayValue);
									}
								} else {
									$_object->$method($arrayKey, $arrayValue);
								}
							}
						} else {
							$_object->$method(json_encode($value, JSON_UNESCAPED_UNICODE));
						}
					} else {
						if ($function->getNumberOfRequiredParameters() < 2) {
							$_object->$method($value);
						}
					}
				}
			}
		}
	}
	
	public static function addPrefixToArray($_array, $_prefix, $_isList = false){
		if($_isList){
			$newArray = array();

			foreach ($_array as $item) {
				$newItem = array();
				foreach ($item as $key => $value) {
				    $newItem[$_prefix . ucfirst($key)] = $value;
				}

				array_push($newArray, $newItem);
			}
		}else{
			$newArray = array();
			foreach ($_array as $key => $value) {
			    $newArray[$_prefix . ucfirst($key)] = $value;
			}
		}		
		
		return $newArray;
	}

	public static function unsetElementFromArray($_array, $_elements, $_isList = false){
		if($_isList){
			foreach ($_array as &$item) {
				foreach ($_elements as $_element) {
				    unset($item[$_element]);
				}
			}
		}else{
			foreach ($_elements as $_element) {
			    unset($_array[$_element]);
			}
		}
		
		return $_array;
	}

	public static function processJsonObject($_class, $_ajaxList, $_dbList = null) {
		if (!is_array($_ajaxList)) {
			if (is_json($_ajaxList)) {
				$_ajaxList = json_decode($_ajaxList, true);
			} else {
				throw new Exception('Invalid json : ' . print_r($_ajaxList, true));
			}
		}
		if (!is_array($_dbList)) {
			if (!class_exists($_class)) {
				throw new Exception('Invalid class : ' . $_class);
			}
			$_dbList = $_class::all();
		}

		$enableList = array();
		//ajout/modif
		foreach ($_ajaxList as $ajaxObject) {
			$object = $_class::byId($ajaxObject['id']);
			if (!is_object($object)) {
				$object = new $_class();
			}
			self::a2o($object, $ajaxObject);
			$object->save();
			$enableList[$object->getId()] = true;
		}
		//suppression des entrées non modifiées.
		foreach ($_dbList as $dbObject) {
			if (!isset($enableList[$dbObject->getId()])) {
				$dbObject->remove();
			}
		}
	}

	public static function setJsonAttr($_attr, $_key, $_value) {
		if ($_value === null) {
			if ($_attr != '' && is_json($_attr)) {
				$attr = json_decode($_attr, true);
				unset($attr[$_key]);
				$_attr = json_encode($attr, JSON_UNESCAPED_UNICODE);
			}
		} else {
			if ($_attr == '' || !is_json($_attr)) {
				$_attr = json_encode(array($_key => $_value), JSON_UNESCAPED_UNICODE);
			} else {
				$attr = json_decode($_attr, true);
				$attr[$_key] = $_value;
				$_attr = json_encode($attr, JSON_UNESCAPED_UNICODE);
			}
		}
		return $_attr;
	}

	public static function getJsonAttr($_attr, $_key = '', $_default = '') {
		if ($_key == '') {
			if ($_attr == '' || !is_json($_attr)) {
				return $_attr;
			}
			return json_decode($_attr, true);
		}
		if ($_attr === '') {
			return $_default;
		}
		$attr = json_decode($_attr, true);
		return (isset($attr[$_key]) && $attr[$_key] !== '') ? $attr[$_key] : $_default;
	}

	public static function compareObj($a1, $a2) { 
		$a1 = o2a($a1);
		$a2 = o2a($a2);

	    $r = array(); 
	    foreach ($a1 as $k => $v) {
	        if (array_key_exists($k, $a2)) { 
	            if (is_array($v)) { 
	                $rad = compareObj($v, $a2[$k]); 
	                if (count($rad)) { $r[$k] = $rad; } 
	            } else { 
	                if ($v != $a2[$k]) { 
	                    $r[$k] = $v; 
	                }
	            }
	        } else { 
	            $r[$k] = $v; 
	        } 
	    } 
	    return $r; 
	}

	/*     * *********************Methode d'instance************************* */

	/*     * **********************Getteur Setteur*************************** */
}

?>