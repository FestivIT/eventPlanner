<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

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