<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class eqLogic {
	/*     * *************************Attributs****************************** */

	private $id;
	private $eventId;
	private $disciplineId;
	private $zoneId;
	private $matTypeId;
	private $eqRealId;
	private $comment;
	private $state;
	private $localisation;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id) {
		$values = array(
			'id' => $_id,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM eqLogic
        WHERE id=:id';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function all() {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM eqLogic';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byEventId($_eventId) {
		$values = array(
			'eventId' => $_eventId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM eqLogic
        WHERE eventId=:eventId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}
	
	public static function byEqRealId($_eqRealId) {
		$values = array(
			'eqRealId' => $_eqRealId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM eqLogic
        WHERE eqRealId=:eqRealId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byZoneId($_zoneId) {
		$values = array(
			'zoneId' => $_zoneId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM eqLogic
        WHERE zoneId=:zoneId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function updateState($_listId, $_state) {

        $sqlIdList = '(';
		$separator = '';

        foreach ($_listId as $id) {
        	$eqLogic = eqLogic::byId($id);

        	if(is_object($eqLogic)){
        		if($eqLogic->getState() != $_state){
        			$oldState = $eqLogic->getState();
        			$eqLogic->setState($_state);
        			$eqLogic->save(false);
        			
	        		msg::add($eqLogic->getEvent()->getOrganisationId(), $eqLogic->getDisciplineId(), $eqLogic->getEventId(), $eqLogic->getZoneId(), $eqLogic->getId(), $_SESSION['user']->getId(), "Changement d'état de '" . getStateText($oldState) . "' à '" . getStateText($eqLogic->getState()) . "'", 'eqLogic', 'update', $eqLogic, 3);

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
		        FROM eqLogic
		        WHERE id IN ' . $sqlIdList;    			
        return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	/*     * *********************Méthodes d'instance************************* */

	public function save($_addMsg = true) {
		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEvent()->getOrganisationId(), $this->getDisciplineId(), $this->getEventId(), $this->getZoneId(), $this->getId(), $_SESSION['user']->getId(), "Création de l'équipement.", 'eqLogic', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEvent()->getOrganisationId(), $this->getDisciplineId(), $this->getEventId(), $this->getZoneId(), $this->getId(), $_SESSION['user']->getId(), "Mise à jour de l'équipement.", 'eqLogic', 'update', $this);
			}
		}
		return $this;
	}

	public function formatForFront(){
		$return = utils::addPrefixToArray(utils::o2a($this), get_class($this));
		return $return;
	}

	public function remove($_addMsg = true) {
		// suppression des msg
		foreach(msg::byEqLogicId($this->getId()) as $msg){
			$msg->remove($_addMsg);
		}
		
		// suppression des attributs
		foreach($this->getAttributes() as $attr){
			$attr->remove($_addMsg);
		}
		
		// suppression des liens
		foreach($this->getEqLinks() as $eqLink){
			$eqLink->remove($_addMsg);
		}
		
		if($_addMsg){
			msg::add($this->getEvent()->getOrganisationId(), $this->getDisciplineId(), $this->getEventId(), $this->getZoneId(), null, $_SESSION['user']->getId(), "Suppression de l'équipement." , 'eqLogic', 'remove', $this);
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
	public function getDisciplineId() {
		return $this->disciplineId;
	}
	public function getZoneId() {
		return $this->zoneId;
	}
	public function getZone(){
		return zone::byId($this->zoneId);
	}
	public function getMatTypeId() {
		return $this->matTypeId;
	}
	public function getMatType(){
		return matType::byId($this->matTypeId);
	}
	public function getEqRealId() {
		return $this->eqRealId;
	}	
	public function getEqReal(){
		if($this->eqRealId != null){
			return zone::byId($this->eqRealId);
		}else{
			return false;
		}
	}
	public function getComment() {
		return $this->comment;
	}
	public function getState() {
		return $this->state;
	}
	public function getLocalisation() {
		return json_decode($this->localisation, true);
	}
	public function getAttributes() {
		return eqLogicAttribute::byEqLogicId($this->getId());
	}
	public function getEqLinks() {
		return eqLink::byEqLogicId($this->getId());
	}

	public function setId($id) {
		$this->id = $id;
	}
	public function setEventId($eventId) {
		$this->eventId = $eventId;
	}
	public function setDisciplineId($disciplineId) {
		$this->disciplineId = $disciplineId;
	}
	public function setZoneId($zoneId) {
		$this->zoneId = $zoneId;
	}
	public function setMatTypeId($matTypeId) {
		$this->matTypeId = $matTypeId;
	}
	public function setEqRealId($eqRealId) {
		$this->eqRealId = $eqRealId;
	}
	public function setComment($comment) {
		$this->comment = $comment;
	}
	public function setState($state) {
		$this->state = $state;
	}
	public function setLocalisation($localisation) {
		$this->localisation = json_encode($localisation, JSON_UNESCAPED_UNICODE);
	}

}
?>