<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class msg {
	/*     * *************************Attributs****************************** */

	private $id;
	private $eventId;
	private $zoneId;
	private $eqId;
	private $userId;
	private $date;
	private $content;
	private $data;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id, $_fullData = false) {
		$values = array(
			'id' => $_id,
		);

		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__, 'msg') . ', ' . DB::buildField('event', 'event') . ', ' . DB::buildField('zone', 'zone') . ', ' . DB::buildField('eqLogic', 'eqLogic') . ', ' . DB::buildField('matType', 'matType') . ', ' . DB::buildField('eqReal', 'eqReal') . ', ' . DB::buildField('user', 'user') . '
					FROM msg 
       				LEFT OUTER JOIN event
             		ON msg.eventId = event.id
       				LEFT OUTER JOIN zone
             		ON msg.zoneId = zone.id
       				LEFT OUTER JOIN eqLogic
             		ON msg.eqId = eqLogic.id
       				LEFT OUTER JOIN eqReal
             		ON eqLogic.eqRealId = eqReal.id
       				LEFT OUTER JOIN matType
             		ON eqLogic.matTypeId = matType.id
       				LEFT OUTER JOIN user
             		ON msg.userId = user.id
	        		WHERE msg.id=:id';
             return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW);
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM msg
	        WHERE id=:id';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function all($_fullData = false) {
		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__, 'msg') . ', ' . DB::buildField('event', 'event') . ', ' . DB::buildField('zone', 'zone') . ', ' . DB::buildField('eqLogic', 'eqLogic') . ', ' . DB::buildField('matType', 'matType') . ', ' . DB::buildField('eqReal', 'eqReal') . ', ' . DB::buildField('user', 'user') . '
					FROM msg 
       				LEFT OUTER JOIN event
             		ON msg.eventId = event.id
       				LEFT OUTER JOIN zone
             		ON msg.zoneId = zone.id
       				LEFT OUTER JOIN eqLogic
             		ON msg.eqId = eqLogic.id
       				LEFT OUTER JOIN eqReal
             		ON eqLogic.eqRealId = eqReal.id
       				LEFT OUTER JOIN matType
             		ON eqLogic.matTypeId = matType.id
       				LEFT OUTER JOIN user
             		ON msg.userId = user.id
             		ORDER BY msg.date DESC';
             return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL);
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM msg';
			return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function byEventId($_eventId, $_fullData = false) {
		$values = array(
			'eventId' => $_eventId,
		);

		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__, 'msg') . ', ' . DB::buildField('event', 'event') . ', ' . DB::buildField('zone', 'zone') . ', ' . DB::buildField('eqLogic', 'eqLogic') . ', ' . DB::buildField('matType', 'matType') . ', ' . DB::buildField('eqReal', 'eqReal') . ', ' . DB::buildField('user', 'user') . '
					FROM msg 
       				LEFT OUTER JOIN event
             		ON msg.eventId = event.id
       				LEFT OUTER JOIN zone
             		ON msg.zoneId = zone.id
       				LEFT OUTER JOIN eqLogic
             		ON msg.eqId = eqLogic.id
       				LEFT OUTER JOIN eqReal
             		ON eqLogic.eqRealId = eqReal.id
       				LEFT OUTER JOIN matType
             		ON eqLogic.matTypeId = matType.id
       				LEFT OUTER JOIN user
             		ON msg.userId = user.id
	        		WHERE msg.eventId=:eventId
             		ORDER BY msg.date DESC';
             return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL);
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM msg
	        WHERE eventId=:eventId';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function byEventIdSinceDate($_date, $_eventId, $_fullData = false) {
		$values = array(
			'eventId' => $_eventId
		);

		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__, 'msg') . ', ' . DB::buildField('event', 'event') . ', ' . DB::buildField('zone', 'zone') . ', ' . DB::buildField('eqLogic', 'eqLogic') . ', ' . DB::buildField('matType', 'matType') . ', ' . DB::buildField('eqReal', 'eqReal') . ', ' . DB::buildField('user', 'user') . '
					FROM msg 
       				LEFT OUTER JOIN event
             		ON msg.eventId = event.id
       				LEFT OUTER JOIN zone
             		ON msg.zoneId = zone.id
       				LEFT OUTER JOIN eqLogic
             		ON msg.eqId = eqLogic.id
       				LEFT OUTER JOIN eqReal
             		ON eqLogic.eqRealId = eqReal.id
       				LEFT OUTER JOIN matType
             		ON eqLogic.matTypeId = matType.id
       				LEFT OUTER JOIN user
             		ON msg.userId = user.id
	        		WHERE msg.eventId=:eventId AND msg.date > \'' . $_date . '\' 
             		ORDER BY msg.date DESC';
             return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL);
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM msg
	        WHERE eventId=:eventId';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function byZoneId($_zoneId, $_fullData = false) {
		$values = array(
			'zoneId' => $_zoneId,
		);

		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__, 'msg') . ', ' . DB::buildField('event', 'event') . ', ' . DB::buildField('zone', 'zone') . ', ' . DB::buildField('eqLogic', 'eqLogic') . ', ' . DB::buildField('matType', 'matType') . ', ' . DB::buildField('eqReal', 'eqReal') . ', ' . DB::buildField('user', 'user') . '
					FROM msg 
       				LEFT OUTER JOIN event
             		ON msg.eventId = event.id
       				LEFT OUTER JOIN zone
             		ON msg.zoneId = zone.id
       				LEFT OUTER JOIN eqLogic
             		ON msg.eqId = eqLogic.id
       				LEFT OUTER JOIN eqReal
             		ON eqLogic.eqRealId = eqReal.id
       				LEFT OUTER JOIN matType
             		ON eqLogic.matTypeId = matType.id
       				LEFT OUTER JOIN user
             		ON msg.userId = user.id
             		WHERE msg.zoneId=:zoneId
             		ORDER BY msg.date DESC';
            return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL);
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM msg
	        WHERE zoneId=:zoneId';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function byEqId($_eqId, $_fullData = false) {
		$values = array(
			'eqId' => $_eqId,
		);

		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__, 'msg') . ', ' . DB::buildField('event', 'event') . ', ' . DB::buildField('zone', 'zone') . ', ' . DB::buildField('eqLogic', 'eqLogic') . ', ' . DB::buildField('matType', 'matType') . ', ' . DB::buildField('eqReal', 'eqReal') . ', ' . DB::buildField('user', 'user') . '
					FROM msg 
       				LEFT OUTER JOIN event
             		ON msg.eventId = event.id
       				LEFT OUTER JOIN zone
             		ON msg.zoneId = zone.id
       				LEFT OUTER JOIN eqLogic
             		ON msg.eqId = eqLogic.id
       				LEFT OUTER JOIN eqReal
             		ON eqLogic.eqRealId = eqReal.id
       				LEFT OUTER JOIN matType
             		ON eqLogic.matTypeId = matType.id
       				LEFT OUTER JOIN user
             		ON msg.userId = user.id
             		WHERE msg.eqId=:eqId
             		ORDER BY msg.date DESC';
             return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL);
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM msg
	        WHERE eqId=:eqId';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function byUserId($_userId, $_fullData = false) {
		$values = array(
			'userId' => $_userId,
		);

		if($_fullData){
			$sql = 'SELECT ' . DB::buildField(__CLASS__, 'msg') . ', ' . DB::buildField('event', 'event') . ', ' . DB::buildField('zone', 'zone') . ', ' . DB::buildField('eqLogic', 'eqLogic') . ', ' . DB::buildField('matType', 'matType') . ', ' . DB::buildField('eqReal', 'eqReal') . ', ' . DB::buildField('user', 'user') . '
					FROM msg 
       				LEFT OUTER JOIN event
             		ON msg.eventId = event.id
       				LEFT OUTER JOIN zone
             		ON msg.zoneId = zone.id
       				LEFT OUTER JOIN eqLogic
             		ON msg.eqId = eqLogic.id
       				LEFT OUTER JOIN eqReal
             		ON eqLogic.eqRealId = eqReal.id
       				LEFT OUTER JOIN matType
             		ON eqLogic.matTypeId = matType.id
       				LEFT OUTER JOIN user
             		ON msg.userId = user.id
	        		WHERE msg.userId=:userId
             		ORDER BY msg.date DESC';
             return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL);
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM msg
	        WHERE userId=:userId';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function add($_eventId, $_zoneId, $_eqId, $_userId, $_content, $_data) {
		$message = new msg();
		$message->setEventId($_eventId);
		$message->setzoneId($_zoneId);
		$message->setEqId($_eqId);
		$message->setUserId($_userId);
		$message->setContent($_content);
		$message->setData($_data);
		$message->save();
	}


	/*     * *********************Méthodes d'instance************************* */

	public function save() {
		return DB::save($this);
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
	public function getEqId() {
		return $this->eqId;
	}
	public function getUserId() {
		return $this->userId;
	}
	public function getDate() {
		return $this->date;
	}
	public function getContent() {
		return $this->content;
	}
	public function getData() {
		return json_decode($this->data, true);
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
	public function setEqId($eqId) {
		$this->eqId = $eqId;
	}
	public function setUserId($userId) {
		$this->userId = $userId;
	}
	public function setDate($date) {
		$this->date = $date;
	}
	public function setContent($content) {
		$this->content = $content;
	}
	public function setData($data) {
		$this->data = json_encode(utils::o2a($data), JSON_UNESCAPED_UNICODE);
	}

}
?>