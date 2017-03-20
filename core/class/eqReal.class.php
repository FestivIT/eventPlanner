<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class eqReal {
	/*     * *************************Attributs****************************** */

	private $id;
	private $matTypeId;
	private $disciplineId;
	private $name;
	private $comment;
	private $state;
	private $localisation;


	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id) {
		$values = array(
			'id' => $_id,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . ' 
	    FROM eqReal 
	    WHERE id=:id';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byMatTypeId($_matTypeId) {
		$values = array(
			'matTypeId' => $_matTypeId,
		);

		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
	    FROM eqReal
	    WHERE matTypeId=:matTypeId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}
	
	public static function all() {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM eqReal
		ORDER BY `matTypeId`';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byDisciplineId($_disciplineId) {
		$values = array(
			'disciplineId' => $_disciplineId,
		);
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM eqReal
        WHERE disciplineId=:disciplineId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}
	
	public static function updateState($_listId, $_state) {
        $sqlIdList = '(';
		$separator = '';

        foreach ($_listId as $id) {
        	$eqReal = eqReal::byId($id);

        	if(is_object($eqReal)){
        		if($eqReal->getState() != $_state){
		    		$old_state = $eqReal->getState();

	        		$eqReal->setState($_state);
	        		$eqReal->save(false);

	        		msg::add($_SESSION['user']->getDiscipline()->getOrganisationId(), $_SESSION['user']->getDisciplineId(), null, null, null, $_SESSION['user']->getId(), "Matériel [" . $eqReal->getName() . "]: Changement d'état de '" . getStateText($oldState) . "' à '" . getStateText($_state) . "'", 'eqReal', 'update', $eqReal);

	        		$sqlIdList .= $separator . $id;
		    		$separator = ', ';
        		}
        	}
		}

		$sqlIdList .= ")";

		if($sqlIdList == '()'){
			return array();
		}
		
		// retourne les éléments modifiés
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM eqReal
        WHERE id IN ' . $sqlIdList . ' 
		ORDER BY `matTypeId`';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	/*     * *********************Méthodes d'instance************************* */

	public function save($_addMsg = true) {
		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add($_SESSION['user']->getDiscipline()->getOrganisationId(), $this->getDisciplineId(), null, null, null, $_SESSION['user']->getId(), "Création du matériel: " . $this->getName(), 'eqReal', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add($_SESSION['user']->getDiscipline()->getOrganisationId(), $this->getDisciplineId(), null, null, null, $_SESSION['user']->getId(), "Mise à jour du matériel: " . $this->getName(), 'eqReal', 'update', $this);
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
			msg::add($_SESSION['user']->getDiscipline()->getOrganisationId(), $this->getDisciplineId(), null, null, null, $_SESSION['user']->getId(), "Suppression du matériel." , 'eqReal', 'remove', $this);
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
	public function getMatTypeId() {
		return $this->matTypeId;
	}
	public function getComment() {
		return $this->comment;
	}
	public function getState() {
		return $this->state;
	}
	public function getLocalisation() {
		return $this->localisation;
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
	public function setMatTypeId($matTypeId) {
		$this->matTypeId = $matTypeId;
	}
	public function setComment($comment) {
		$this->comment = $comment;
	}
	public function setState($state) {
		$this->state = $state;
	}
	public function setLocalisation($localisation) {
		$this->localisation = $localisation;
	}

}
?>