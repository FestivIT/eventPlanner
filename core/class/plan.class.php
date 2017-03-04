<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class plan {
	/*     * *************************Attributs****************************** */

	private $id;
	private $name;
	private $bounds;
	private $organisationId;


	/*     * ***********************Méthodes statiques*************************** */

	public static function all() {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
       	FROM plan';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}
	
	public static function byId($_id) {
		$values = array(
			'id' => $_id,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        	FROM plan
        	WHERE id=:id';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}
	
	public static function byOrganisationId($_organisationId) {
		$values = array(
			'organisationId' => $_organisationId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        	FROM plan
        	WHERE organisationId=:organisationId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
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
				msg::add(null, null, null, $_SESSION['user']->getId(), "Création du plan " . $this->getName(), 'plan', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add(null, null, null, $_SESSION['user']->getId(), "Mise à jour du plan " . $this->getName(), 'plan', 'update', $this);
			}
		}
		return $this;
	}

	public function remove($_addMsg = true) {
		if($_addMsg){
			msg::add(null, null, null, $_SESSION['user']->getId(), "Suppression du plan " . $this->getName(), 'plan', 'remove', $this);
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
	/*
	public function getDiscipline() {
		return matType::byId($this->matTypeId);
	}
	*/
	public function getOrganisationId() {
		return $this->organisationId;
	}
	public function getBounds() {
		return json_decode($this->bounds, true);
	}

	public function setId($id) {
		$this->id = $id;
	}
	public function setName($name) {
		$this->name = $name;
	}
	public function setOrganisationId($organisationId) {
		$this->organisationId = $organisationId;
	}
	public function setBounds($bounds) {
		$this->bounds = json_encode($bounds, JSON_UNESCAPED_UNICODE);
	}

}

?>