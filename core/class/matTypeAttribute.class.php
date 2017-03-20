<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class matTypeAttribute {
	/*     * *************************Attributs****************************** */

	private $id;
	private $matTypeId;
	private $name;
	private $options;


	/*     * ***********************Méthodes statiques*************************** */

	public static function all() {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
       	FROM matTypeAttribute';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}
	
	public static function byId($_id) {
		$values = array(
			'id' => $_id,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        	FROM matTypeAttribute
        	WHERE id=:id';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}
	
	public static function byMatTypeId($_matTypeId) {
		$values = array(
			'matTypeId' => $_matTypeId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        	FROM matTypeAttribute
        	WHERE matTypeId=:matTypeId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byDisciplineId($_disciplineId) {
		$values = array(
			'disciplineId' => $_disciplineId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM matTypeAttribute 
        LEFT JOIN matType 
        ON matTypeAttribute.matTypeId = matType.id 
        WHERE matType.disciplineId =:disciplineId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function listIdByMatTypeId($_matTypeId) {
		$list = array();
		foreach(matTypeAttribute::byMatTypeId($_matTypeId) as $matTypeAttribute){
			array_push($list, $matTypeAttribute->getId());
		}
		return $list;
	}
	
	public function formatForFront(){
		$return = utils::addPrefixToArray(utils::o2a($this), get_class($this));
		return $return;
	}

	/*     * *********************Méthodes d'instance************************* */

	public function save($_addMsg = true) {
		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add($this->getMatType()->getDiscipline()->getOrganisationId(),$this->getMatType()->getDisciplineId(),null, null, null, $_SESSION['user']->getId(), "Création de l'attribut " . $this->getName() . " du type de matériel: " . $this->getMatType()->getName(), 'matTypeAttribute', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add($this->getMatType()->getDiscipline()->getOrganisationId(),$this->getMatType()->getDisciplineId(),null, null, null, $_SESSION['user']->getId(), "Mise à jour de l'attribut " . $this->getName() . " du type de matériel: " . $this->getMatType()->getName(), 'matTypeAttribute', 'update', $this);
			}
		}
		return $this;
	}

	public function remove($_addMsg = true) {
		if($_addMsg){
			msg::add($this->getMatType()->getDiscipline()->getOrganisationId(),$this->getMatType()->getDisciplineId(),null, null, null, $_SESSION['user']->getId(), "Suppression de l'attribut " . $this->getName() . " du type de matériel: " . $this->getMatType()->getName() , 'matTypeAttribute', 'remove', $this);
		}

		return DB::remove($this);
	}

	public function refresh() {
		DB::refresh($this);
	}

	public function getId() {
		return $this->id;
	}
	public function getMatTypeId() {
		return $this->matTypeId;
	}
	public function getMatType() {
		return matType::byId($this->matTypeId);
	}
	public function getName() {
		return $this->name;
	}
	public function getOptions() {
		return json_decode($this->options, true);
	}

	public function setId($id) {
		$this->id = $id;
	}
	public function setMatTypeId($matTypeId) {
		$this->matTypeId = $matTypeId;
	}
	public function setName($name) {
		$this->name = $name;
	}
	public function setOptions($options) {
		$this->options = json_encode($options, JSON_UNESCAPED_UNICODE);
	}

}

?>