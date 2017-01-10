<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class mission {
	/*     * *************************Attributs****************************** */

	private $id;
	private $eventId;
	private $name;
	private $users;
	private $zones;
	private $comment;
	private $state;
	private $date;
	private $configuration;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id, $_fullData = false) {
		$values = array(
			'id' => $_id,
		);

		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
		        FROM mission
	        	WHERE id=:id
			    ORDER BY `date`';
             $result = DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW);
             
             // d ode les champs en JSON
            $JSONField = ['users', 'zones', 'configuration'];
		 	foreach($JSONField as $fieldName){
		 		$result[$fieldName] = json_decode($result[$fieldName], true);
		 	}

             return mission::listToObjects($result);
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        	FROM mission
	        	WHERE id=:id
			    ORDER BY `date`';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function all($_fullData = false) {
		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
		        FROM mission
			    ORDER BY `date`';
             $result = DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL);
             
             // d ode les champs en JSON
             $JSONField = ['users', 'zones', 'configuration'];
             foreach ($result as &$mission) {
			 	foreach($JSONField as $fieldName){
			 		$mission[$fieldName] = json_decode($mission[$fieldName], true);
			 	}
			 }

			 foreach ($result as &$mission) {
			 	$mission = mission::listToObjects($mission);
			 }
             return $result;
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM mission
		    ORDER BY `date`';
			return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function byEventId($_eventId, $_fullData = false) {
		$values = array(
			'eventId' => $_eventId,
		);
		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
		        FROM mission
		        WHERE eventId=:eventId
			    ORDER BY `date`';
             $result = DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL);
             
             // d ode les champs en JSON
             $JSONField = ['users', 'zones', 'configuration'];
             foreach ($result as &$mission) {
			 	foreach($JSONField as $fieldName){
			 		$mission[$fieldName] = json_decode($mission[$fieldName], true);
			 	}
			 }

             foreach ($result as &$mission) {
			 	$mission = mission::listToObjects($mission);
			 }
             return $result;
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM mission
	        WHERE eventId=:eventId
		    ORDER BY `date`';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function byZoneId($_zoneId, $_fullData = false) {
		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
		        FROM mission
		        WHERE `zones` LIKE \'%\"' . $_zoneId . '\"%\'
			    ORDER BY `date`';
             $result = DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL);
             
             // d ode les champs en JSON
             $JSONField = ['users', 'zones', 'configuration'];
             foreach ($result as &$mission) {
			 	foreach($JSONField as $fieldName){
			 		$mission[$fieldName] = json_decode($mission[$fieldName], true);
			 	}
			 }

             foreach ($result as &$mission) {
			 	$mission = mission::listToObjects($mission);
			 }
             return $result;
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM mission
	        WHERE `zones` LIKE \'%\"' . $_zoneId . '\"%\'
		    ORDER BY `date`';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function byUserId($_userId, $_fullData = false) {
		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
		        FROM mission
		        WHERE `users` LIKE \'%\"' . $_userId . '\"%\'
			    ORDER BY `date`';
             $result = DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL);
             
             // d ode les champs en JSON
             $JSONField = ['users', 'zones', 'configuration'];
             foreach ($result as &$mission) {
			 	foreach($JSONField as $fieldName){
			 		$mission[$fieldName] = json_decode($mission[$fieldName], true);
			 	}
			 }

             foreach ($result as &$mission) {
			 	$mission = mission::listToObjects($mission);
			 }
             return $result;
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM mission
	        WHERE `users` LIKE \'%\"' . $_userId . '\"%\'
		    ORDER BY `date`';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function byUserIdMaxState($_userId, $_maxState, $_fullData = false) {
		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
		        FROM mission
		        WHERE `users` LIKE \'%\"' . $_userId . '\"%\' AND `state` <= ' . $_maxState . '
			    ORDER BY `date`';
             $result = DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL);
             
             // d ode les champs en JSON
             $JSONField = ['users', 'zones', 'configuration'];
             foreach ($result as &$mission) {
			 	foreach($JSONField as $fieldName){
			 		$mission[$fieldName] = json_decode($mission[$fieldName], true);
			 	}
			 }

             foreach ($result as &$mission) {
			 	$mission = mission::listToObjects($mission);
			 }
             return $result;
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM mission
	        WHERE `users` LIKE \'%\"' . $_userId . '\"%\'
		    ORDER BY `date`';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function updateState($_listId, $_state) {

        $sqlIdList = '(';
		$separator = '';

        foreach ($_listId as $id) {
        	$mission = mission::byId($id);

        	if(is_object($mission)){
        		if($mission->getState() != $_state){
	        		//msg::add($eqLogic->getEventId(), $eqLogic->getZoneId(), $eqLogic->getId(), $_SESSION['user']->getId(), "Changement d'état de " . $eqLogic->getState() . " à " . $_state);
	        		$mission->setState($_state);
	        		$mission->save(false);

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
	        FROM mission
	        WHERE id IN ' . $sqlIdList;
         $result = DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL);
         
         // d ode les champs en JSON
         $JSONField = ['users', 'zones', 'configuration'];
         foreach ($result as &$mission) {
		 	foreach($JSONField as $fieldName){
		 		$mission[$fieldName] = json_decode($mission[$fieldName], true);
		 	}
		 }

         foreach ($result as &$mission) {
		 	$mission = mission::listToObjects($mission);
		 }
         return $result;
	}

	private static function listToObjects($mission){
		
		foreach($mission['users'] as &$user){
		 	$userObj = user::byId($user);
		 	if(is_object($userObj)){
		 		$user = utils::o2a($userObj);
		 	}
		}

		foreach($mission['zones'] as &$zone){
		 	$zoneObj = zone::byId($zone);
		 	if(is_object($zoneObj)){
		 		$zone = utils::o2a($zoneObj);
		 	}
		}
		return $mission;
	}

	/*     * *********************Méthodes d'instance************************* */

	public function save($_addMsg = true) {
		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEventId(), null, null, $_SESSION['user']->getId(), "Création de la mission.");
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEventId(), null, null, $_SESSION['user']->getId(), "Mise à jour de la mission.");
			}
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
	public function getUsers() {
		return json_decode($this->users, true);
	}
	public function getZones() {
		return json_decode($this->zones, true);
	}
	public function getComment() {
		return $this->comment;
	}
	public function getState() {
		return $this->state;
	}	
	public function getDate() {
		return $this->date;
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
	public function setUsers($users) {
		$this->users = json_encode($users, JSON_UNESCAPED_UNICODE);
	}
	public function setZones($zones) {
		$this->zones = json_encode($zones, JSON_UNESCAPED_UNICODE);
	}
	public function setComment($comment) {
		$this->comment = $comment;
	}
	public function setState($state) {
		$this->state = $state;
	}
	public function setDate($date) {
		$this->date = $date;
	}
	public function setConfiguration($_key, $_value) {
		$this->configuration = utils::setJsonAttr($this->configuration, $_key, $_value);
	}

}
?>