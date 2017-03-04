<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class organisation {
	/*     * *************************Attributs****************************** */

	private $id;
	private $name;


	/*     * ***********************Méthodes statiques*************************** */

	public static function all() {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
       	FROM organisation';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}
	
	public static function byId($_id) {
		$values = array(
			'id' => $_id,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        	FROM organisation
        	WHERE id=:id';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
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
				msg::add(null, null, null, $_SESSION['user']->getId(), "Création de l'organisation " . $this->getName(), 'organisation', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add(null, null, null, $_SESSION['user']->getId(), "Mise à jour du l'organisation " . $this->getName(), 'organisation', 'update', $this);
			}
		}
		return $this;
	}

	public function remove($_addMsg = true) {
		if($_addMsg){
			msg::add(null, null, null, $_SESSION['user']->getId(), "Suppression du l'organisation " . $this->getName(), 'organisation', 'remove', $this);
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

	public function setId($id) {
		$this->id = $id;
	}
	public function setName($name) {
		$this->name = $name;
	}

}

?>