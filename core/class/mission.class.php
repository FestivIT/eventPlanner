<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class mission {
	/*     * *************************Attributs****************************** */

	private $id;
	private $eventId;
	private $name;
	private $comment;
	private $state;
	private $date;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id) {
		$values = array(
			'id' => $_id,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        	FROM mission
        	WHERE id=:id';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function all() {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM mission
	    ORDER BY `date`';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byEventId($_eventId) {
		$values = array(
			'eventId' => $_eventId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM mission
        WHERE eventId=:eventId
	    ORDER BY `date`';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byZoneId($_zoneId) {
		$values = array(
			'zoneId' => $_zoneId,
		);
		
	    $sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	    FROM mission 
	    LEFT OUTER JOIN missionZoneAssociation ON missionZoneAssociation.missionId = mission.id 
	    WHERE missionZoneAssociation.zoneId =:zoneId
	    ORDER BY `date`';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byUserId($_userId) {
	    $values = array(
			'userId' => $_userId,
		);
		
	    $sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	    FROM mission 
	    LEFT OUTER JOIN missionUserAssociation ON missionUserAssociation.missionId = mission.id 
	    WHERE missionUserAssociation.userId =:userId
	    ORDER BY `date`';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byUserIdMaxState($_userId, $_maxState, $_fullData = false) {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM mission
        WHERE `users` LIKE \'%\"' . $_userId . '\"%\' AND `state` <= ' . $_maxState . '
	    ORDER BY `date`';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function updateState($_listId, $_state) {

        $sqlIdList = '(';
		$separator = '';

        foreach ($_listId as $id) {
        	$mission = mission::byId($id);

        	if(is_object($mission)){
        		if($mission->getState() != $_state){
        			$old_state = $mission->getState();

	        		$mission->setState($_state);
	        		$mission->save(false);

	        		msg::add($mission->getEventId(), null, null, $_SESSION['user']->getId(), "Mission [" . $mission->getName() . "]: Changement d'état de '" . getStateText($oldState) . "' à '" . getStateText($_state) . "'", 'mission', 'update', $mission);

	        		$sqlIdList .= $separator . $id;
		    		$separator = ', ';
        		}
        	}
		}

		$sqlIdList .= ")";

		if($sqlIdList == '()'){
			return array();
		}

		// retourne les éléments modifiés
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM mission
        WHERE id IN ' . $sqlIdList . ' 
		ORDER BY `date`';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}


	/*     * *********************Méthodes d'instance************************* */

	public function save($_addMsg = true) {
		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEventId(), null, null, $_SESSION['user']->getId(), "Création de la mission.", 'mission', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEventId(), null, null, $_SESSION['user']->getId(), "Mise à jour de la mission.", 'mission', 'update', $this);
			}
		}
		return $this;
	}

	public function formatForFront(){
		$mission = utils::addPrefixToArray(utils::o2a($this), 'mission');
		$mission['missionUsers'] = missionUserAssociation::listIdByMissionId($this->getId());
		$mission['missionZones'] = missionZoneAssociation::listIdByMissionId($this->getId());
		return $mission;
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
	public function getUsers(){
	    return missionUserAssociation::byMissionId($this->getId());
	}
	public function getZones(){
	    return missionZoneAssociation::byMissionId($this->getId());
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

	public function setId($id) {
		$this->id = $id;
	}
	public function setEventId($eventId) {
		$this->eventId = $eventId;
	}
	public function setName($name) {
		$this->name = $name;
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

}

class missionUserAssociation {
	/*     * *************************Attributs****************************** */

	private $missionId;
	private $userId;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byUserId($_userId) {
		$values = array(
			'userId' => $_userId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        	FROM missionUserAssociation
        	WHERE userId=:userId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byMissionId($_missionId) {
		$values = array(
			'missionId' => $_missionId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        	FROM missionUserAssociation
        	WHERE missionId=:missionId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function listIdByMissionId($_missionId) {
		$list = array();
		foreach(missionUserAssociation::byMissionId($_missionId) as $missionUserAssociation){
			array_push($list, $missionUserAssociation->getUserId());
		}
		return $list;
	}

	public static function byEventId($_eventId) {
		$values = array(
			'eventId' => $_eventId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . ' 
        FROM missionUserAssociation 
        LEFT JOIN mission 
        ON missionUserAssociation.missionId = mission.id 
        WHERE mission.eventId =:eventId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	/*     * *********************Méthodes d'instance************************* */

	public function save() {
		return DB::save($this);;
	}

	public function remove() {
		return DB::remove($this);
	}

	public function refresh() {
		DB::refresh($this);
	}

	public function getMissionId() {
		return $this->missionId;
	}
	public function getUserId() {
		return $this->userId;
	}

	public function setMissionId($missionId) {
		$this->missionId = $missionId;
	}
	public function setUserId($userId) {
		$this->userId = $userId;
	}

}

class missionZoneAssociation {
	/*     * *************************Attributs****************************** */

	private $missionId;
	private $zoneId;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byZoneId($_zoneId) {
		$values = array(
			'zoneId' => $_zoneId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        	FROM missionZoneAssociation
        	WHERE zoneId=:zoneId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byMissionId($_missionId) {
		$values = array(
			'missionId' => $_missionId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        	FROM missionZoneAssociation
        	WHERE missionId=:missionId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function listIdByMissionId($_missionId) {
		$list = array();
		foreach(missionZoneAssociation::byMissionId($_missionId) as $missionZoneAssociation){
			array_push($list, $missionZoneAssociation->getZoneId());
		}
		return $list;
	}

	public static function byEventId($_eventId) {
		$values = array(
			'eventId' => $_eventId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . ' 
        FROM missionZoneAssociation 
        LEFT JOIN mission 
        ON missionZoneAssociation.missionId = mission.id 
        WHERE mission.eventId =:eventId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	/*     * *********************Méthodes d'instance************************* */

	public function save() {
		return DB::save($this);;
	}

	public function remove() {
		return DB::remove($this);
	}

	public function refresh() {
		DB::refresh($this);
	}

	public function getMissionId() {
		return $this->missionId;
	}
	public function getZoneId() {
		return $this->zoneId;
	}

	public function setMissionId($missionId) {
		$this->missionId = $missionId;
	}
	public function setZoneId($zoneId) {
		$this->zoneId = $zoneId;
	}

}
?>