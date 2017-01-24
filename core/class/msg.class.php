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

	public static function byId($_id) {
		$values = array(
			'id' => $_id,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM msg
        WHERE id=:id';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function all() {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM msg';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byEventId($_eventId) {
		$values = array(
			'eventId' => $_eventId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM msg
        WHERE eventId=:eventId OR eventId IS NULL';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byEventIdSinceId($_id, $_eventId) {
		$values = array(
			'eventId' => $_eventId
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM msg
        WHERE (eventId=:eventId OR eventId IS NULL) AND id > \'' . $_id . '\' ';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byZoneId($_zoneId) {
		$values = array(
			'zoneId' => $_zoneId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM msg
        WHERE zoneId=:zoneId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byEqId($_eqId) {
		$values = array(
			'eqId' => $_eqId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM msg
        WHERE eqId=:eqId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byUserId($_userId) {
		$values = array(
			'userId' => $_userId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM msg
        WHERE userId=:userId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function add($_eventId, $_zoneId, $_eqId, $_userId, $_content, $_type, $_op, $_data) {
		switch ($_op) {
		    case 'add':
		    case 'update':
		    case 'remove':
		    break;

		    default:
		        throw new Exception('Opération [' . $_op . '] inconnue. Utiliser add, remove ou update!');
		    break;
		}

		if (!class_exists($_type)) {
		    throw new Exception('Type [' . $_type . '] inconnu!');
		}
		
		$data = array(
						'type' => $_type,
						'op' => $_op,
						'content' => utils::addPrefixToArray(utils::o2a($_data), $_type) // ajout des prefixs
					);


		$message = new msg();
		$message->setEventId($_eventId);
		$message->setzoneId($_zoneId);
		$message->setEqId($_eqId);
		$message->setUserId($_userId);
		$message->setContent($_content);
		$message->setData($data);
		$message->save(false);
	}


	/*     * *********************Méthodes d'instance************************* */

	public function save($_addMsgData = true) {
		if($_addMsgData){
				$data = array(
					'type' => 'msg',
					'op' => 'add',
					'content' => array()
				);
				$this->setData($data);
			}
		
		DB::save($this);
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
		if(is_object($data)){
			$this->data = json_encode(utils::o2a($data), JSON_UNESCAPED_UNICODE);
		}else{
			$this->data = json_encode($data, JSON_UNESCAPED_UNICODE);
		}
	}
}
?>