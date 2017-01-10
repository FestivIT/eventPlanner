<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class eqReal {
	/*     * *************************Attributs****************************** */

	private $id;
	private $matTypeId;
	private $name;
	private $comment;
	private $state;
	private $configuration;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id, $_fullData = false) {
		$values = array(
			'id' => $_id,
		);
		
		if($_fullData){
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
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM eqReal
	        WHERE id=:id';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function byMatTypeId($_matTypeId, $_fullData = false) {
		$values = array(
			'matTypeId' => $_matTypeId,
		);
		
		if($_fullData){
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
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM eqReal
	        WHERE matTypeId=:matTypeId';
			return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function all($_fullData = false) {
		if($_fullData){
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
		}else{
			$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	        FROM eqReal';
			return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
		}
	}

	public static function updateState($_listId, $_state) {

        $sqlIdList = '(';
		$separator = '';

        foreach ($_listId as $id) {
        	$eqReal = eqReal::byId($id);

        	if(is_object($eqReal)){
        		if($eqReal->getState() != $_state){
	        		//msg::add($eqLogic->getEventId(), $eqLogic->getZoneId(), $eqLogic->getId(), $_SESSION['user']->getId(), "Changement d'état de " . $eqLogic->getState() . " à " . $_state);
	        		$eqReal->setState($_state);
	        		$eqReal->save(false);

	        		$sqlIdList .= $separator . $id;
		    		$separator = ', ';
        		}
        	}
		}

		$sqlIdList .= ")";

		if($sqlIdList == '()'){
			return array();
		}

		$sql = 'SELECT ' . DB::buildField(__CLASS__, 'eqReal') . ', ' . DB::buildField('matType', 'matType') . '
				FROM eqReal 
   				LEFT OUTER JOIN matType
         		ON eqReal.matTypeId = matType.id
    			WHERE eqReal.id IN ' . $sqlIdList;
         $result = DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL);
         
         // décode les champs en JSON
         $JSONField = ['matTypeOptions'];
	 	 foreach($JSONField as $fieldName){
		 		$result[$fieldName] = json_decode($result[$fieldName], true);
		 }
         return $result;
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
	public function getName() {
		return $this->name;
	}
	public function getMatTypeId() {
		return $this->matTypeId;
	}
	public function getComment() {
		return $this->comment;
	}
	public function getState() {
		return $this->state;
	}	
	public function getConfiguration($_key = '', $_default = '') {
		return utils::getJsonAttr($this->configuration, $_key, $_default);
	}

	public function setId($id) {
		$this->id = $id;
	}
	public function setName($name) {
		$this->name = $name;
	}
	public function setMatTypeId($matTypeId) {
		$this->matTypeId = $matTypeId;
	}
	public function setComment($comment) {
		$this->comment = $comment;
	}
	public function setState($state) {
		$this->state = $state;
	}
	public function setConfiguration($_key, $_value) {
		$this->configuration = utils::setJsonAttr($this->configuration, $_key, $_value);
	}

}
?>