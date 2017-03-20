<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class zone {
	/*     * *************************Attributs****************************** */

	private $id;
	private $eventId;
	private $eventLevelId;
	private $name;
	private $localisation;
	private $installDate;
	private $uninstallDate;
	private $state;
	private $comment;


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

	public static function updateState($_listId, $_state, $_eqLogicState) {
        $sqlIdList = '(';
		$separator = '';

        foreach ($_listId as $id) {
        	$zone = zone::byId($id);
			
        	if(is_object($zone)){
        		if($zone->getState() != $_state){
        			$oldState = $zone->getState();
        			$zone->setState($_state);
        			$zone->save(false);
        			
	        		msg::add($zone->getEvent()->getOrganisationId(), null, $zone->getEventId(), $zone->getId(), null, $_SESSION['user']->getId(), "Changement d'état de '" . getStateText($oldState) . "' à '" . getStateText($zone->getState()) . "'", 'zone', 'update', $zone);
	     
	        		$sqlIdList .= $separator . $id;
		    		$separator = ', ';
        		}
        		
        		if($_eqLogicState){
	        		$zone->setEqLogicState(getZoneStateEqLogic($_state));
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
	
	public function save($_addMsg = true) {
		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEvent()->getOrganisationId(), null, $this->getEventId(), $this->getId(), null, $_SESSION['user']->getId(), "Création de la zone.", 'zone', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEvent()->getOrganisationId(), null, $this->getEventId(), $this->getId(), null, $_SESSION['user']->getId(), "Mise à jour de la zone.", 'zone', 'update', $this);
			}
		}
		return $this;
	}

	public function formatForFront(){
		$return = utils::addPrefixToArray(utils::o2a($this), get_class($this));
		return $return;
	}
	
	public function setEqLogicState($_state){
		$eqLogics = eqLogic::byZoneId($this->getId());
		$eqLogicsId = array();
		
		foreach ($eqLogics as $eqLogic) {
			array_push ($eqLogicsId, $eqLogic->getId());
		}
		
		eqLogic::updateState($eqLogicsId, $_state);
	}

	public function remove($_addMsg = true) {
		if($_addMsg){
			msg::add($this->getEvent()->getOrganisationId(), null, $this->getEventId(), $this->getId(), null, $_SESSION['user']->getId(), "Suppression de la zone." , 'zone', 'remove', $this);
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
	public function getEventLevelId() {
		return $this->eventLevelId;
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
	public function getComment() {
		return $this->comment;
	}

	public function setId($id) {
		$this->id = $id;
	}
	public function setEventId($eventId) {
		$this->eventId = $eventId;
	}
	public function setEventLevelId($eventLevelId) {
		$this->eventLevelId = $eventLevelId;
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
	public function setComment($comment) {
		$this->comment = $comment;
	}

}
?>