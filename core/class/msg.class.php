<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class msg {
	/*     * *************************Attributs****************************** */

	private $id;
	private $organisationId;
	private $disciplineId;
	private $eventId;
	private $zoneId;
	private $eqId;
	private $userId;
	private $date;
	private $content;
	private $data;
	private $level;
	/*
		0: messages system
		1: ajout/modification/suppression
		2: connexion utilisateur
		3: modification de status
		4: création mission
		5: 
		6: photo/texte saisi utilisateur
	*/


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

	public static function byEventIdInterval($_eventId, $_minuteInterval, $_minLevel = 2) {
		$values = array(
			'eventId' => $_eventId,
			'level' => $_minLevel
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM msg
        WHERE eventId=:eventId AND level>=:level AND date>=DATE_ADD(NOW(), INTERVAL -' . $_minuteInterval . ' MINUTE) ORDER BY `msg`.`level`, `msg`.`date` DESC';

		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}
	
	public static function forUserIdSinceId($_id, $_userId) {
		$user = user::byId($_userId);
		
		if(!is_object($user)){
			throw new Exception('User [' . $_userId . '] inconnu.');
		}
		
		$values = array(
			'eventId' => $user->getEventId(),
			'disciplineId' => $user->getDisciplineId(),
			'organisationId' => $user->getDiscipline()->getOrganisationId()
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM msg
        WHERE ((eventId=:eventId AND (disciplineId IS NULL OR disciplineId=:disciplineId)) 
        OR (eventId IS NULL AND disciplineId=:disciplineId) 
        OR (eventId IS NULL AND (disciplineId IS NULL OR disciplineId=:disciplineId) AND organisationId=:organisationId)) AND id > \'' . $_id . '\' ';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}
	
	public static function forUserId($_userId) {
		$user = user::byId($_userId);
		
		if(!is_object($user)){
			throw new Exception('User [' . $_userId . '] inconnu.');
		}
		
		$values = array(
			'eventId' => $user->getEventId(),
			'disciplineId' => $user->getDisciplineId(),
			'organisationId' => $user->getDiscipline()->getOrganisationId()
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM msg
        WHERE (eventId=:eventId AND (disciplineId IS NULL OR disciplineId=:disciplineId)) 
        OR (eventId IS NULL AND disciplineId=:disciplineId) 
        OR (eventId IS NULL AND (disciplineId IS NULL OR disciplineId=:disciplineId) AND organisationId=:organisationId)';
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

	public static function byEqLogicId($_eqId) {
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

	public static function add($_organisationId, $_disciplineId, $_eventId, $_zoneId, $_eqId, $_userId, $_content, $_type, $_op, $_data, $_level = 0) {
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

		if (!is_object($_data)) {
		    throw new Exception('Data doit être un objet!');
		}

		if (!method_exists($_data, 'formatForFront')) {
		    throw new Exception('Data doit avoir la méthode formatForFront!');
		}
		
		$data = array(
						'type' => $_type,
						'op' => $_op,
						'content' => $_data->formatForFront()
					);


		$message = new msg();
		$message->setOrganisationId($_organisationId);
		$message->setDisciplineId($_disciplineId);
		$message->setEventId($_eventId);
		$message->setzoneId($_zoneId);
		$message->setEqId($_eqId);
		$message->setUserId($_userId);
		$message->setContent($_content);
		$message->setLevel($_level);
		$message->setData($data);
		if($_type == 'msg'){
			$message->save(true);
		}else{
			$message->save(false);
		}
		$message->refresh();

		return $message;
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

	public function formatForFront(){
		$return = utils::addPrefixToArray(utils::o2a($this), get_class($this));
		return $return;
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
	public function getOrganisationId() {
		return $this->organisationId;
	}
	public function getDisciplineId() {
		return $this->disciplineId;
	}
	public function getEventId() {
		return $this->eventId;
	}
	public function getZoneId() {
		return $this->zoneId;
	}
	public function getZone() {
		return zone::byId($this->zoneId);
	}
	public function getEqId() {
		return $this->eqId;
	}
	public function getEqLogic() {
		return eqLogic::byId($this->eqId);
	}
	public function getUserId() {
		return $this->userId;
	}
	public function getUser() {
		return user::byId($this->userId);
	}
	public function getDate() {
		return $this->date;
	}
	public function getLevel() {
		return $this->level;
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
	public function setOrganisationId($organisationId) {
		$this->organisationId = $organisationId;
	}
	public function setDisciplineId($disciplineId) {
		$this->disciplineId = $disciplineId;
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
	public function setLevel($level) {
		if(!is_integer($level)){
			$level = 0;
		}
		$this->level = $level;
	}
	public function setContent($content) {
		if(!is_array($content) || (is_array($content) && !array_key_exists('type', $content))){
			$content = array(
				'type' => 'text',
				'value' => $content
			);
		}
		
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