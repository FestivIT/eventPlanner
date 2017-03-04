<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class event {
	/*     * *************************Attributs****************************** */

	private $id;
	private $name;
	private $ville;
	private $localisation;
	private $startDate;
	private $endDate;
	private $generalInfo;
	private $configuration;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id) {
		$values = array(
			'id' => $_id,
		);
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM event
        WHERE id=:id';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function all() {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM event
        ORDER BY `startDate` DESC';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	// A SUPRIMER APRES IMPLEMENTATION EN JS
	public static function byDayInterval($_dayBefore, $_dayAfter) {
		$values = array(
			'dayBefore' => $_dayBefore,
			'dayAfter' => $_dayAfter
		);
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM event
        WHERE startDate BETWEEN DATE_SUB(CURDATE(), INTERVAL :dayBefore DAY) AND DATE_ADD(CURDATE(), INTERVAL :dayAfter DAY)
        ORDER BY `startDate` DESC';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	/*     * *********************Méthodes d'instance************************* */

	public function save($_addMsg = true) {
		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add($this->getId(), null, null, $_SESSION['user']->getId(), "Création de l'événement: " . $this->getName(), 'event', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add($this->getId(), null, null, $_SESSION['user']->getId(), "Mise à jour de l'événement: " . $this->getName(), 'event', 'update', $this);
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
			msg::add($this->getId(), null, null, $_SESSION['user']->getId(), "Suppression de l'événement." , 'event', 'remove', $this);
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
	public function getLocalisation() {
		return json_decode($this->localisation, true);
	}
	public function getVille() {
		return $this->ville;
	}
	public function getStartDate() {
		return $this->startDate;
	}
	public function getEndDate() {
		return $this->endDate;
	}
	public function getConfiguration() {
		return $this->configuration;
	}
	public function getGeneralInfo() {
		return $this->generalInfo;
	}

	public function setId($id) {
		$this->id = $id;
	}
	public function setName($name) {
		$this->name = $name;
	}
	public function setLocalisation($localisation) {
		$this->localisation = json_encode($localisation, JSON_UNESCAPED_UNICODE);
	}
	public function setVille($ville) {
		$this->ville = $ville;
	}
	public function setStartDate($startDate) {
		$this->startDate = $startDate;
	}
	public function setEndDate($endDate) {
		$this->endDate = $endDate;
	}
	public function setConfiguration($configuration) {
		$this->configuration = $configuration;
	}
	public function setGeneralInfo($generalInfo) {
		$this->generalInfo = $generalInfo;
	}
}
?>