<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class eventLevel {
	/*     * *************************Attributs****************************** */

	private $id;
	private $name;
	private $eventId;
	private $planId;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id) {
		$values = array(
			'id' => $_id,
		);
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM eventLevel
        WHERE id=:id';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function all() {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
       	FROM eventLevel
	   	ORDER BY `name`';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byEventId($_eventId) {
		$values = array(
			'eventId' => $_eventId,
		);
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM eventLevel
        WHERE eventId=:eventId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}
	
	/*     * *********************Méthodes d'instance************************* */

	public function save($_addMsg = true) {
		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEvent()->getOrganisationId(), null, $this->getEventId(), null, null, $_SESSION['user']->getId(), "Création du niveau: " . $this->getName(), 'eventLevel', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEvent()->getOrganisationId(), null, $this->getEventId(), null, null, $_SESSION['user']->getId(), "Mise à jour du niveau: " . $this->getName(), 'eventLevel', 'update', $this);
			}
		}
		return $this;
	}

	public function formatForFront(){
		$return = utils::addPrefixToArray(utils::o2a($this), get_class($this));
		$return['attributes'] = matTypeAttribute::listIdByMatTypeId($this->getId());
		return $return;
	}

	public function remove($_addMsg = true) {
		if($_addMsg){
			msg::add($this->getEvent()->getOrganisationId(), null, $this->getEventId(), null, null, $_SESSION['user']->getId(), "Suppression du niveau." . $this->getName() , 'eventLevel', 'remove', $this);
		}

		return DB::remove($this);
	}

	public function refresh() {
		DB::refresh($this);
	}

	public function getId() {
		return $this->id;
	}
	public function getName() {
		return $this->name;
	}
	public function getEventId() {
		return $this->eventId;
	}
	public function getEvent() {
		return event::byId($this->getEventId());
	}
	public function getPlanId() {
		return $this->planId;
	}

	public function setId($id) {
		$this->id = $id;
	}
	public function setName($name) {
		$this->name = $name;
	}
	public function setEventId($eventId) {
		$this->eventId = $eventId;
	}
	public function setPlanId($planId) {
		$this->planId = $planId;
	}
}

?>