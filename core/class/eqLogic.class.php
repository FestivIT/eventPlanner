<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class eqLogic {
	/*     * *************************Attributs****************************** */

	private $id;
	private $eventId;
	private $zoneId;
	private $matTypeId;
	private $eqRealId;
	private $ip;
	private $comment;
	private $state;
	private $configuration;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id, $_fullData = false) {
		$values = array(
			'id' => $_id,
		);

		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__, 'eqLogic') . ', ' . DB::buildField('event', 'event') . ', ' . DB::buildField('zone', 'zone') . ', ' . DB::buildField('matType', 'matType') . ', ' . DB::buildField('eqReal', 'eqReal') . '
					FROM eqLogic 
       				LEFT OUTER JOIN event
             		ON eqLogic.eventId = event.id
       				LEFT OUTER JOIN zone
             		ON eqLogic.zoneId = zone.id
       				LEFT OUTER JOIN eqReal
             		ON eqLogic.eqRealId = eqReal.id
       				LEFT OUTER JOIN matType
             		ON eqLogic.matTypeId = matType.id
        			WHERE eqLogic.id=:id';
             $result = DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW);
             
             // d ode les champs en JSON
             $JSONField = ['eqLogicConfiguration', 'eventConfiguration', 'eventLocalisation', 'zoneLocalisation', 'zoneConfiguration'];
		 	 foreach($JSONField as $fieldName){
			 		$result[$fieldName] = json_decode($result[$fieldName], true);
			 }
             return $result;
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM eqLogic
	        WHERE id=:id';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function all($_fullData = false) {
		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__, 'eqLogic') . ', ' . DB::buildField('event', 'event') . ', ' . DB::buildField('zone', 'zone') . ', ' . DB::buildField('matType', 'matType') . ', ' . DB::buildField('eqReal', 'eqReal') . '
					FROM eqLogic 
       				LEFT OUTER JOIN event
             		ON eqLogic.eventId = event.id
       				LEFT OUTER JOIN zone
             		ON eqLogic.zoneId = zone.id
       				LEFT OUTER JOIN eqReal
             		ON eqLogic.eqRealId = eqReal.id
       				LEFT OUTER JOIN matType
             		ON eqLogic.matTypeId = matType.id
       				ORDER BY eqLogic.matTypeId';
             $result = DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL);
             
             // d ode les champs en JSON
             $JSONField = ['eqLogicConfiguration', 'eventConfiguration', 'eventLocalisation', 'zoneLocalisation', 'zoneConfiguration'];
             foreach ($result as &$eq) {
			 	foreach($JSONField as $fieldName){
			 		$eq[$fieldName] = json_decode($eq[$fieldName], true);
			 	}
			 }
             return $result;
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM eqLogic';
			return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function byEventId($_eventId, $_fullData = false) {
		$values = array(
			'eventId' => $_eventId,
		);
		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__, 'eqLogic') . ', ' . DB::buildField('event', 'event') . ', ' . DB::buildField('zone', 'zone') . ', ' . DB::buildField('matType', 'matType') . ', ' . DB::buildField('eqReal', 'eqReal') . '
					FROM eqLogic 
       				LEFT OUTER JOIN event
             		ON eqLogic.eventId = event.id
       				LEFT OUTER JOIN zone
             		ON eqLogic.zoneId = zone.id
       				LEFT OUTER JOIN eqReal
             		ON eqLogic.eqRealId = eqReal.id
       				LEFT OUTER JOIN matType
             		ON eqLogic.matTypeId = matType.id
        			WHERE eqLogic.eventId=:eventId
       				ORDER BY eqLogic.matTypeId';
             $result = DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL);
             
             // d ode les champs en JSON
             $JSONField = ['eqLogicConfiguration', 'eventConfiguration', 'eventLocalisation', 'zoneLocalisation', 'zoneConfiguration'];
             foreach ($result as &$eq) {
			 	foreach($JSONField as $fieldName){
			 		$eq[$fieldName] = json_decode($eq[$fieldName], true);
			 	}
			 }
             return $result;
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM eqLogic
	        WHERE eventId=:eventId';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function byZoneId($_zoneId, $_fullData = false) {
		$values = array(
			'zoneId' => $_zoneId,
		);
		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__, 'eqLogic') . ', ' . DB::buildField('event', 'event') . ', ' . DB::buildField('zone', 'zone') . ', ' . DB::buildField('matType', 'matType') . ', ' . DB::buildField('eqReal', 'eqReal') . '
					FROM eqLogic 
       				LEFT OUTER JOIN event
             		ON eqLogic.eventId = event.id
       				LEFT OUTER JOIN zone
             		ON eqLogic.zoneId = zone.id
       				LEFT OUTER JOIN eqReal
             		ON eqLogic.eqRealId = eqReal.id
       				LEFT OUTER JOIN matType
             		ON eqLogic.matTypeId = matType.id
        			WHERE eqLogic.zoneId=:zoneId
       				ORDER BY eqLogic.matTypeId';
             $result = DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL);
             
             // d ode les champs en JSON
             $JSONField = ['eqLogicConfiguration', 'eventConfiguration', 'eventLocalisation', 'zoneLocalisation', 'zoneConfiguration'];
             foreach ($result as &$eq) {
			 	foreach($JSONField as $fieldName){
			 		$eq[$fieldName] = json_decode($eq[$fieldName], true);
			 	}
			 }
             return $result;
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM eqLogic
	        WHERE zoneId=:zoneId';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function updateState($_listId, $_state) {
		$values = array(
			'state' => $_state,
		);

		$sqlIdList = '(';
		$separator = '';
		foreach ($_listId as $id) {
		    $sqlIdList .= $separator . $id;
		    $separator = ', ';
		}
		$sqlIdList .= ")";

		$sql = 'UPDATE eqLogic 
		SET state=:state 
        WHERE id IN ' . $sqlIdList;
        
        return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL);
	}

	/*     * *********************Méthodes d'instance************************* */

	public function save() {
		if($this->getId() == null){
			DB::save($this);
			msg::add($this->getEventId(), $this->getZoneId(), $this->getId(), $_SESSION['user']->getId(), "Création de l'équipement.");
		}else{
			DB::save($this);
			msg::add($this->getEventId(), $this->getZoneId(), $this->getId(), $_SESSION['user']->getId(), "Mise à jour de l'équipement.");
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
	public function getZoneId() {
		return $this->zoneId;
	}
	public function getMatTypeId() {
		return $this->matTypeId;
	}
	public function getEqRealId() {
		return $this->eqRealId;
	}
	public function getIp() {
		return $this->ip;
	}
	public function getComment() {
		return $this->comment;
	}
	public function getState() {
		return $this->state;
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
	public function setZoneId($zoneId) {
		$this->zoneId = $zoneId;
	}
	public function setMatTypeId($matTypeId) {
		$this->matTypeId = $matTypeId;
	}
	public function setEqRealId($eqRealId) {
		$this->eqRealId = $eqRealId;
	}
	public function setIp($ip) {
		$this->ip = $ip;
	}
	public function setComment($comment) {
		$this->comment = $comment;
	}
	public function setState($state) {
		$this->state = $state;
	}
	public function setConfiguration($_key, $_value) {
		$this->configuration = utils::setJsonAttr($this->configuration, $_key, $_value);
	}

}
?>