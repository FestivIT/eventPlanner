<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class mission {
	/*     * *************************Attributs****************************** */

	private $id;
	private $eventId;
	private $comment;
	private $state;
	private $date;
	private $configuration;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id, $_fullData = false) {

	}

	public static function all($_fullData = false) {

	}

	public static function byEventId($_eventId, $_fullData = false) {
		
	}

	public static function byZoneId($_zoneId, $_fullData = false) {
		
	}

	public static function byUserId($_userId, $_fullData = false) {
		
	}

	public static function updateState($_listId, $_state) {
	
	}

	/*     * *********************Méthodes d'instance************************* */

	public function save($_addMsg = true) {
		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEventId(), $this->getZoneId(), $this->getId(), $_SESSION['user']->getId(), "Création de la mission.");
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add($this->getEventId(), $this->getZoneId(), $this->getId(), $_SESSION['user']->getId(), "Mise à jour de la mission.");
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