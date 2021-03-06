<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class matType {
	/*     * *************************Attributs****************************** */

	private $id;
	private $name;
	private $disciplineId;
	private $parentId;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id) {
		$values = array(
			'id' => $_id,
		);
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM matType
        WHERE id=:id';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function all() {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
       	FROM matType
	   	ORDER BY `name`';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byDisciplineId($_disciplineId) {
		$values = array(
			'disciplineId' => $_disciplineId,
		);
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM matType
        WHERE disciplineId=:disciplineId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}
	
	/*     * *********************Méthodes d'instance************************* */

	public function save($_addMsg = true) {
		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add($this->getDiscipline()->getOrganisationId(),$this->getDisciplineId(),null, null, null, $_SESSION['user']->getId(), "Création du type de matériel: " . $this->getName(), 'matType', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add($this->getDiscipline()->getOrganisationId(),$this->getDisciplineId(),null, null, null, $_SESSION['user']->getId(), "Mise à jour du type de matériel: " . $this->getName(), 'matType', 'update', $this);
			}
		}
		return $this;
	}

	public function formatForFront(){
		$return = utils::addPrefixToArray(utils::o2a($this), get_class($this));
		$return['attributes'] = matTypeAttribute::listIdByMatTypeId($this->getId());
		return $return;
	}

	public function remove($_addMsg = true) {
		if($_addMsg){
			msg::add($this->getDiscipline()->getOrganisationId(),$this->getDisciplineId(),null, null, null, $_SESSION['user']->getId(), "Suppression du type de matériel."  . $this->getName(), 'matType', 'remove', $this);
		}

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
	public function getDisciplineId() {
		return $this->disciplineId;
	}
	public function getDiscipline() {
		return discipline::byId($this->getDisciplineId());
	}
	public function getParentId() {
		return $this->parentId;
	}
	public function getAttributes() {
		return matTypeAttribute::byMatTypeId($this->getId());
	}

	public function setId($id) {
		$this->id = $id;
	}
	public function setName($name) {
		$this->name = $name;
	}
	public function setDisciplineId($disciplineId) {
		$this->disciplineId = $disciplineId;
	}
	public function setParentId($parentId) {
		$this->parentId = $parentId;
	}
	public function addAttributes($name, $option) {
		
	}
}

?>