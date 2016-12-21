<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class eqLink {
	/*     * *************************Attributs****************************** */

	private $id;
	private $eqLogicId1;
	private $eqLogicId2;
	private $type;
	private $configuration;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id, $_fullData = false) {
		$values = array(
			'id' => $_id,
		);
		
		if($_fullData){
			/*
			$sql = 'SELECT ' . DB::buildField(__CLASS__, 'eqReal') . ', ' . DB::buildField('matType', 'matType') . '
					FROM eqReal 
       				LEFT OUTER JOIN matType
             		ON eqReal.matTypeId = matType.id
        			WHERE eqReal.id=:id';
             $result = DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW);
             
             // décode les champs en JSON
             $JSONField = ['matTypeOptions'];
		 	 foreach($JSONField as $fieldName){
			 		$result[$fieldName] = json_decode($result[$fieldName], true);
			 }
             return $result;
             */
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM eqLink
	        WHERE id=:id';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function byEventId($_eventId, $_fullData = false) {
		$values = array(
			'eventId' => $_eventId,
		);
		
		if($_fullData){
			/*
			$sql = 'SELECT ' . DB::buildField(__CLASS__, 'eqReal') . ', ' . DB::buildField('matType', 'matType') . '
					FROM eqReal 
       				LEFT OUTER JOIN matType
             		ON eqReal.matTypeId = matType.id
        			WHERE eqReal.matTypeId=:matTypeId
       				ORDER BY eqReal.name';
             $result = DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL);
             
             // décode les champs en JSON
             $JSONField = ['matTypeOptions'];
             foreach ($result as &$eq) {
			 	foreach($JSONField as $fieldName){
			 		$eq[$fieldName] = json_decode($eq[$fieldName], true);
			 	}
			 }
             return $result;
             */
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM eqLink
	        WHERE eventId=:eventId';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function byEqLogicId($_eqLogicId, $_fullData = false) {
		$values = array(
			'eqLogicId' => $_eqLogicId,
		);
		
		if($_fullData){
			/*
			$sql = 'SELECT ' . DB::buildField(__CLASS__, 'eqReal') . ', ' . DB::buildField('matType', 'matType') . '
					FROM eqReal 
       				LEFT OUTER JOIN matType
             		ON eqReal.matTypeId = matType.id
        			WHERE eqReal.matTypeId=:matTypeId
       				ORDER BY eqReal.name';
             $result = DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL);
             
             // décode les champs en JSON
             $JSONField = ['matTypeOptions'];
             foreach ($result as &$eq) {
			 	foreach($JSONField as $fieldName){
			 		$eq[$fieldName] = json_decode($eq[$fieldName], true);
			 	}
			 }
             return $result;
             */
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM eqLink
	        WHERE eqLogicId1=:eqLogicId OR eqLogicId2=:eqLogicId';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function all($_fullData = false) {
		if($_fullData){
			/*
			$sql = 'SELECT ' . DB::buildField(__CLASS__, 'eqReal') . ', ' . DB::buildField('matType', 'matType') . '
					FROM eqReal 
       				LEFT OUTER JOIN matType
             		ON eqReal.matTypeId = matType.id
       				ORDER BY eqReal.matTypeId';
            $result = DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL);
             
            // décode les champs en JSON
            $JSONField = ['matTypeOptions'];
            foreach ($result as &$eq) {
				foreach($JSONField as $fieldName){
			 		$eq[$fieldName] = json_decode($eq[$fieldName], true);
			 	}
			}
			 
            return $result;
            */
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM eqLink';
			return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
		}
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
	public function getEqLogicId1() {
		return $this->eqLogicId1;
	}
	public function getEqLogicId2() {
		return $this->eqLogicId2;
	}
	public function getType() {
		return $this->type;
	}	
	public function getConfiguration($_key = '', $_default = '') {
		return utils::getJsonAttr($this->configuration, $_key, $_default);
	}

	public function setId($id) {
		$this->id = $id;
	}
	public function setEqLogicId1($eqLogicId1) {
		$this->eqLogicId1 = $eqLogicId1;
	}
	public function setEqLogicId2($eqLogicId2) {
		$this->eqLogicId2 = $eqLogicId2;
	}
	public function setType($type) {
		$this->type = $type;
	}
	public function setConfiguration($_key, $_value) {
		$this->configuration = utils::setJsonAttr($this->configuration, $_key, $_value);
	}

}
?>