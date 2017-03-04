<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

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

?>