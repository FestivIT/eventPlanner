<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class eqLogicAttribute {
	/*     * *************************Attributs****************************** */

	private $id;
	private $matTypeAttributeId;
	private $eqLogicId;
	private $value;
	private $viewOnPlanning;


	/*     * ***********************Méthodes statiques*************************** */

	public static function all() {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
       	FROM eqLogicAttribute';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}
	
	public static function byId($_id) {
		$values = array(
			'id' => $_id,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        	FROM eqLogicAttribute
        	WHERE id=:id';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}
	
	public static function byEqLogicId($_eqLogicId) {
		$values = array(
			'eqLogicId' => $_eqLogicId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        	FROM eqLogicAttribute
        	WHERE eqLogicId=:eqLogicId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}
	
	public static function byMatTypeAttributeIdEqLogicId($_matTypeAttributeId, $_eqLogicId) {
		$values = array(
			'eqLogicId' => $_eqLogicId,
			'matTypeAttributeId' => $_matTypeAttributeId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        	FROM eqLogicAttribute
        	WHERE matTypeAttributeId=:matTypeAttributeId AND eqLogicId=:eqLogicId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function listIdByEqLogicId($_eqLogicId) {
		$list = array();
		foreach(eqLogicAttribute::byEqLogicId($_eqLogicId) as $eqLogicAttribute){
			array_push($list, $eqLogicAttribute->getId());
		}
		return $list;
	}

	public static function byEventId($_eventId) {
		$values = array(
			'eventId' => $_eventId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . ' 
        FROM eqLogicAttribute 
        LEFT JOIN eqLogic 
        ON eqLogicAttribute.eqLogicId = eqLogic.id 
        WHERE eqLogic.eventId =:eventId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}
	
	public function formatForFront(){
		$return = utils::addPrefixToArray(utils::o2a($this), get_class($this));
		return $return;
	}

	/*     * *********************Méthodes d'instance************************* */

	public function save($_addMsg = true) {
		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEqLogic()->getEvent()->getOrganisationId(), $_SESSION['user']->getDisciplineId(), $this->getEqLogic()->getEventId(), $this->getEqLogic()->getZoneId(), $this->getEqLogicId(), $_SESSION['user']->getId(), "Création de l'attribut " . $this->getMatTypeAttribute()->getName() . " de l'équipement: " . $this->getEqLogic()->getZone()->getName() ." " . $this->getEqLogic()->getMatType()->getName(), 'eqLogicAttribute', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEqLogic()->getEvent()->getOrganisationId(), $_SESSION['user']->getDisciplineId(), $this->getEqLogic()->getEventId(), $this->getEqLogic()->getZoneId(), $this->getEqLogicId(), $_SESSION['user']->getId(), "Mise à jour de l'attribut " . $this->getMatTypeAttribute()->getName() . " de l'équipement: " . $this->getEqLogic()->getZone()->getName() . " " . $this->getEqLogic()->getMatType()->getName(), 'eqLogicAttribute', 'update', $this);
			}
		}
		return $this;
	}

	public function remove($_addMsg = true) {
		if($_addMsg){
			msg::add($this->getEqLogic()->getEvent()->getOrganisationId(), $_SESSION['user']->getDisciplineId(), $this->getEqLogic()->getEventId(), $this->getEqLogic()->getZoneId(), $this->getEqLogicId(), $_SESSION['user']->getId(), "Suppression de l'attribut " . $this->getMatTypeAttribute()->getName() . " de l'équipement: " . $this->getEqLogic()->getZone()->getName() . " " . $this->getEqLogic()->getMatType()->getName(), 'eqLogicAttribute', 'remove', $this);
		}

		return DB::remove($this);
	}

	public function refresh() {
		DB::refresh($this);
	}

	public function getId() {
		return $this->id;
	}
	public function getMatTypeAttributeId() {
		return $this->matTypeAttributeId;
	}
	public function getMatTypeAttribute() {
		return matTypeAttribute::byId($this->matTypeAttributeId);
	}
	public function getEqLogicId() {
		return $this->eqLogicId;
	}
	public function getEqLogic() {
		return eqLogic::byId($this->eqLogicId);
	}
	public function getValue() {
		return $this->value;
	}
	public function getViewOnPlanning() {
		return $this->viewOnPlanning;
	}
	

	public function setId($id) {
		$this->id = $id;
	}
	public function setMatTypeAttributeId($matTypeAttributeId) {
		$this->matTypeAttributeId = $matTypeAttributeId;
	}
	public function setEqLogicId($eqLogicId) {
		$this->eqLogicId = $eqLogicId;
	}
	public function setValue($value) {
		$this->value = $value;
	}
	public function setViewOnPlanning($viewOnPlanning) {
		$this->viewOnPlanning = $viewOnPlanning;
	}

}

?>