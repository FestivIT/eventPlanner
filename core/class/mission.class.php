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
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM mission
        WHERE `zones` LIKE \'%\"' . $_zoneId . '\"%\'
	    ORDER BY `date`';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byUserId($_userId) {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM mission
        WHERE `users` LIKE \'%\"' . $_userId . '\"%\'
	    ORDER BY `date`';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
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

	        		msg::add($mission->getEventId(), null, null, $_SESSION['user']->getId(), "Mission [" . $mission->getName() . "]: Changement d'état de '" . getStateText($oldState) . "' à '" . getStateText($_state) . "'", $mission);

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
				msg::add($this->getEventId(), null, null, $_SESSION['user']->getId(), "Création de la mission.", $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEventId(), null, null, $_SESSION['user']->getId(), "Mise à jour de la mission.", $this);
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