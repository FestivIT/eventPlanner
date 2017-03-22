<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class eqLink {
	/*     * *************************Attributs****************************** */

	private $id;
	private $eventId;
	private $eqLogicId1;
	private $eqLogicId2;
	private $type;
	private $comment;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id) {
		$values = array(
			'id' => $_id,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM eqLink
        WHERE id=:id';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function all() {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM eqLink';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byEventId($_eventId) {
		$values = array(
			'eventId' => $_eventId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM eqLink
        WHERE eventId=:eventId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byEqLogicId($_eqLogicId) {
		$values = array(
			'eqLogicId' => $_eqLogicId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM eqLink
        WHERE eqLogicId1=:eqLogicId OR eqLogicId2=:eqLogicId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}


	/*     * *********************Méthodes d'instance************************* */

	public function save($_addMsg = true) {
		if($this->configuration == null){
			$this->configuration = array();
		}

		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEvent()->getOrganisationId(), $_SESSION['user']->getDisciplineId(), $this->getEventId(), null, null, $_SESSION['user']->getId(), "Création du lien", 'eqLink', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEvent()->getOrganisationId(), $_SESSION['user']->getDisciplineId(), $this->getEventId(), null, null, $_SESSION['user']->getId(), "Mise à jour du lien.", 'eqLink', 'update', $this);
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
			msg::add($this->getEvent()->getOrganisationId(), $_SESSION['user']->getDisciplineId(), $this->getEventId(), null, null, $_SESSION['user']->getId(), "Suppression du lien.", 'eqLink', 'remove', $this);
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
	public function getEvent() {
		return event::byId($this->getEventId());	
	}
	public function getEqLogicId1() {
		return $this->eqLogicId1;
	}
	public function getEqLogic1() {
		return eqLogic::byId($this->eqLogicId1);
	}
	public function getEqLogicId2() {
		return $this->eqLogicId2;
	}
	public function getEqLogic2() {
		return eqLogic::byId($this->eqLogicId2);
	}
	public function getType() {
		return $this->type;
	}	
	public function getComment() {
		return $this->comment;
	}	

	public function setId($id) {
		$this->id = $id;
	}
	public function setEventId($eventId) {
		$this->eventId = $eventId;
	}
	public function setEqLogicId1($eqLogicId1) {
		$this->eqLogicId1 = $eqLogicId1;
	}
	public function setEqLogicId2($eqLogicId2) {
		$this->eqLogicId2 = $eqLogicId2;
	}
	public function setType($type) {
		$this->type = $type;
	}
	public function setComment($comment) {
		$this->comment = $comment;
	}
}
?>