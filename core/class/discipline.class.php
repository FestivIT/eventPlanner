<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class discipline {
	/*     * *************************Attributs****************************** */

	private $id;
	private $organisationId;
	private $name;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id) {
		$values = array(
			'id' => $_id,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM discipline
        WHERE id=:id';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function all() {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM discipline';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byOrganisationId($_organisationId) {
		$values = array(
			'organisationId' => $_organisationId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM discipline
        WHERE organisationId=:organisationId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	/*     * *********************Méthodes d'instance************************* */

	public function save($_addMsg = true) {
		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add(null, null, null, $_SESSION['user']->getId(), "Création de la discipline", 'discipline', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add(null, null, null, $_SESSION['user']->getId(), "Mise à jour de la discipline", 'discipline', 'update', $this);
			}
		}
		return $this;
	}

	public function formatForFront(){
		$return = utils::addPrefixToArray(utils::o2a($this), get_class($this));
		return $return;
	}

	public function remove($_addMsg = true) {
		if($_addMsg){
			msg::add(null, null, null, $_SESSION['user']->getId(), "Suppression de la discipline.", 'discipline', 'remove', $this);
		}

		return DB::remove($this);
	}

	public function refresh() {
		DB::refresh($this);
	}

	public function getId() {
		return $this->id;
	}
	public function getOrganisationId() {
		return $this->organisationId;
	}
	public function getName() {
		return $this->name;
	}

	public function setId($id) {
		$this->id = $id;
	}
	public function setOrganisationId($organisationId) {
		$this->organisationId = $organisationId;
	}
	public function setName($name) {
		$this->name = $name;
	}

}
?>