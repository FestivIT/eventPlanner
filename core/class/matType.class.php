<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class matType {
	/*     * *************************Attributs****************************** */

	private $id;
	private $name;
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
	
	/*     * *********************Méthodes d'instance************************* */

	public function save($_addMsg = true) {
		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add(null, null, null, $_SESSION['user']->getId(), "Création du type de matériel: " . $this->getName(), 'matType', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add(null, null, null, $_SESSION['user']->getId(), "Mise à jour du type de matériel: " . $this->getName(), 'matType', 'update', $this);
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
	public function getName() {
		return $this->name;
	}
	public function getParentId() {
		return $this->parentId;
	}
	public function getAttributes() {
		return false;
	}

	public function setId($id) {
		$this->id = $id;
	}
	public function setName($name) {
		$this->name = $name;
	}
	public function setParentId($parentId) {
		$this->parentId = $parentId;
	}
	public function addAttributes($name, $option) {
		
	}
}
?>