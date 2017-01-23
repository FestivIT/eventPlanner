<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class zone {
	/*     * *************************Attributs****************************** */

	private $id;
	private $eventId;
	private $name;
	private $localisation;
	private $installDate;
	private $uninstallDate;
	private $state;
	private $configuration;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id) {
		$values = array(
			'id' => $_id,
		);
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM zone
        WHERE id=:id';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function all() {

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
    	FROM zone
    	ORDER BY `name`';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byEventId($_eventId) {
		$values = array(
			'eventId' => $_eventId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
    	FROM zone
    	WHERE eventId=:eventId 
    	ORDER BY `name`';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function updateState($_listId, $_state) {

        $sqlIdList = '(';
		$separator = '';

        foreach ($_listId as $id) {
        	$zone = zone::byId($id);

        	if(is_object($zone)){
        		if($zone->getState() != $_state){
	        		msg::add($zone->getEventId(), $zone->getId(), null, $_SESSION['user']->getId(), "Changement d'état de " . $zone->getState() . " à " . $_state);
	        		$zone->setState($_state);
	        		$zone->save(false);

	        		$sqlIdList .= $separator . $id;
		    		$separator = ', ';
        		}
        	}
		}

		$sqlIdList .= ")";

		if($sqlIdList == '()'){
			return array();
		}

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
		        FROM zone
		        WHERE id IN ' . $sqlIdList;    			
        return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	/*     * *********************Méthodes d'instance************************* */

	public function save() {
		if($this->getId() == null){
			DB::save($this);
			msg::add($this->getEventId(), $this->getId(), null, $_SESSION['user']->getId(), "Création de la zone.");
		}else{
			DB::save($this);
			msg::add($this->getEventId(), $this->getId(), null, $_SESSION['user']->getId(), "Mise à jour de la zone.");
		}
		return $this;
	}

	public function remove() {
		return DB::remove($this);
	}

	public function refresh() {
		DB::refresh($this);
	}

	public function getId() {
		return $this->id;
	}
	public function getEventId() {
		return $this->eventId;
	}
	public function getName() {
		return $this->name;
	}
	public function getInstallDate() {
		return $this->installDate;
	}
	public function getUninstallDate() {
		return $this->uninstallDate;
	}
	public function getState() {
		return $this->state;
	}
	public function getLocalisation() {
		return json_decode($this->localisation, true);
	}
	public function getConfiguration($_key = '', $_default = '') {
		return utils::getJsonAttr($this->configuration, $_key, $_default);
	}

	public function setId($id) {
		$this->id = $id;
	}
	public function setEventId($eventId) {
		$this->eventId = $eventId;
	}
	public function setName($name) {
		$this->name = $name;
	}
	public function setInstallDate($installDate) {
		$this->installDate = $installDate;
	}
	public function setUninstallDate($uninstallDate) {
		$this->uninstallDate = $uninstallDate;
	}
	public function setState($state) {
		$this->state = $state;
	}
	public function setLocalisation($localisation) {
		$this->localisation = json_encode($localisation, JSON_UNESCAPED_UNICODE);
	}
	public function setConfiguration($_key, $_value) {
		$this->configuration = utils::setJsonAttr($this->configuration, $_key, $_value);
	}

}
?>