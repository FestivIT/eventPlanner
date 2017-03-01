<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class contact {
	/*     * *************************Attributs****************************** */

	private $id;
	private $eventId;
	private $name;
	private $fct;
	private $zoneId;
	private $coord;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id) {
		$values = array(
			'id' => $_id,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM contact
        WHERE id=:id';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function all() {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM contact';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byEventId($_eventId) {
		$values = array(
			'eventId' => $_eventId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM contact
        WHERE eventId=:eventId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byZoneId($_zoneId) {
		$values = array(
			'zoneId' => $_zoneId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM contact
        WHERE zoneId=:zoneId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}


	/*     * *********************Méthodes d'instance************************* */

	public function save($_addMsg = true) {
		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEventId(), $this->getZoneId(), null, $_SESSION['user']->getId(), "Création du contact", 'contact', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEventId(), $this->getZoneId(), null, $_SESSION['user']->getId(), "Mise à jour du contact.", 'contact', 'update', $this);
			}
		}
		return $this;
	}

	public function formatForFront(){
		$return = utils::addPrefixToArray(utils::o2a($this), get_class($this));
		return $return;
	}

	public function remove($_addMsg = true) {
		if($_addMsg){
			msg::add($this->getEventId(), $this->getZoneId(), null, $_SESSION['user']->getId(), "Suppression du contact.", 'contact', 'remove', $this);
		}

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
	public function getFct() {
		if($this->fct == ''){
			$this->fct = null;
		}
		return $this->fct;
	}
	public function getZoneId() {
		return $this->zoneId;
	}
	public function getCoord() {
		return $this->coord;
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
	public function setFct($fct) {
		$this->fct = $fct;
	}
	public function setZoneId($zoneId) {
		$this->zoneId = $zoneId;
	}
	public function setCoord($coord) {
		$this->coord = $coord;
	}

}
?>