<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';
use PragmaRX\Google2FA\Google2FA;

class user {
	/*     * *************************Attributs****************************** */

	private $id;
	private $disciplineId;
	private $login;
	private $name;
	private $password;
	private $lastConnection;
	private $eventId;
	private $eventLevelId;
	private $actionOnScan;
	private $slackID;
	private $rights;
	private $enable = 1;
	private $hash;

	/*     * ***********************Méthodes statiques*************************** */

	public static function byId($_id) {
		$values = array(
			'id' => $_id,
		);
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM user
        WHERE id=:id';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	/**
	 * Retourne un object utilisateur (si les information de connection sont valide)
	 * @param string $_login nom d'utilisateur
	 * @param string $_mdp motsz de passe en sha1
	 * @return user object user
	 */
	public static function connect($_login, $_mdp) {
		$sMdp = (!is_sha1($_mdp)) ? sha1($_mdp) : $_mdp;
		$user = user::byLoginAndPassword($_login, $sMdp);
		if (is_object($user)) {
			$user->setLastConnection(date('Y-m-d H:i:s'));
			$user->save(false);
			msg::add(null, null, null, $user->getId(), "Connection de l'utilisateur: " . $user->getName(), 'user', 'update', $user);
			//eventPlanner::event('user_connect');
			//log::add('event', 'info', __('Connexion de l\'utilisateur ', __FILE__) . $_login);
		}
		return $user;
	}

	public static function byDisciplineId($_disciplineId) {
		$values = array(
			'disciplineId' => $_disciplineId,
		);
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM user
        WHERE disciplineId=:disciplineId';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byLogin($_login) {
		$values = array(
			'login' => $_login,
		);
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM user
        WHERE login=:login';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byHash($_hash) {
		$values = array(
			'hash' => $_hash,
		);
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM user
        WHERE hash=:hash';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byLoginAndHash($_login, $_hash) {
		$values = array(
			'login' => $_login,
			'hash' => $_hash,
		);
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
		        FROM user
		        WHERE login=:login
		        AND hash=:hash';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function byLoginAndPassword($_login, $_password) {
		$values = array(
			'login' => $_login,
			'password' => $_password,
		);
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
		        FROM user
		        WHERE login=:login
		        AND password=:password';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ROW, PDO::FETCH_CLASS, __CLASS__);
	}

	/**
	 *
	 * @return array de tous les utilisateurs
	 */
	public static function all() {
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
    	FROM user';
		return DB::Prepare($sql, array(), DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function searchByRight($_rights) {
		$values = array(
			'rights' => '%"' . $_rights . '":1%',
			'rights2' => '%"' . $_rights . '":"1"%',
		);
		$sql = 'SELECT ' . DB::buildField(__CLASS__) . '
        FROM user
        WHERE rights LIKE :rights
        OR rights LIKE :rights2';
		return DB::Prepare($sql, $values, DB::FETCH_TYPE_ALL, PDO::FETCH_CLASS, __CLASS__);
	}

	public static function hasDefaultIdentification() {
		$sql = 'SELECT count(id) as nb
        FROM user
        WHERE login="admin"
        AND password=SHA1("admin")
        AND `enable` = 1';
		$result = DB::Prepare($sql, array(), DB::FETCH_TYPE_ROW);
		return $result['nb'];
	}

	/*     * *********************Méthodes d'instance************************* */

	public function presave() {
		if ($this->getLogin() == '') {
			throw new Exception(__('Le nom d\'utilisateur ne peut pas être vide', __FILE__));
		}
	}

	public function save($_addMsg = true) {
		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add($this->getDiscipline()->getOrganisationId(), $this->getDisciplineId(), null, null, null, $_SESSION['user']->getId(), "Création de l'utilisateur: " . $this->getName(), 'user', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add($this->getDiscipline()->getOrganisationId(), $this->getDisciplineId(), null, null, null, $_SESSION['user']->getId(), "Mise à jour de l'utilisateur: " . $this->getName(), 'user', 'update', $this);
			}
		}

		// Si c'est l'utilisateur en cours, on met à jour la session
		if(is_object($_SESSION['user']) && ($this->getId() == $_SESSION['user']->getId())){
			@session_start();
			$_SESSION['user']->refresh();
			@session_write_close();
		}		

		return $this;
	}

	public function formatForFront($_currentUser = false){
		$return = utils::addPrefixToArray(utils::o2a($this), get_class($this));

		// Si c'est pas l'utilisateur en cours, on supprimer certains champs
		if(!$_currentUser){
			$return = utils::unsetElementFromArray($return, array('userPassword', 'userHash', 'userOptions', 'userRights'));
		}		

		return $return;
	}

	public function remove($_addMsg = true) {
		if($_addMsg){
			msg::add($this->getDiscipline()->getOrganisationId(), $this->getDisciplineId(), null, null, null, $_SESSION['user']->getId(), "Suppression de l'utilisateur: " . $this->getName() , 'user', 'remove', $this);
		}

		return DB::remove($this);
	}

	public function refresh() {
		DB::refresh($this);
	}

	/**
	 *
	 * @return boolean vrai si l'utilisateur est valide
	 */
	public function is_Connected() {
		return (is_numeric($this->id) && $this->login != '');
	}

	/*     * **********************Getteur Setteur*************************** */

	public function getId() {
		return $this->id;
	}

	public function getDisciplineId() {
		return $this->disciplineId;
	}

	public function getDiscipline() {
		return discipline::byId($this->disciplineId);
	}

	public function getLogin() {
		return $this->login;
	}

	public function getName() {
		return $this->name;
	}

	public function getPassword() {
		return $this->password;
	}

	public function getLastConnection() {
		return $this->lastConnection;
	}

	public function getActionOnScan() {
		return $this->actionOnScan;
	}

	public function getSlackID() {
		return $this->slackID;
	}

	public function getEventId() {
		return $this->eventId;
	}

	public function getEventLevelId() {
		return $this->eventLevelId;
	}

	public function setId($id) {
		$this->id = $id;
	}

	public function setDisciplineId($disciplineId) {
		$this->disciplineId = $disciplineId;
	}

	public function setLogin($login) {
		$this->login = $login;
	}

	public function setName($name) {
		$this->name = $name;
	}

	public function setLastConnection($lastConnection) {
		$this->lastConnection = $lastConnection;
	}

	public function setActionOnScan($actionOnScan) {
		$this->actionOnScan = $actionOnScan;
	}

	public function setSlackID($slackID) {
		$this->slackID = $slackID;
	}

	public function setEventId($eventId) {
		$this->eventId = $eventId;
	}

	public function setEventLevelId($eventLevelId) {
		$this->eventLevelId = $eventLevelId;
	}

	public function setPassword($password) {
		$this->password = (!is_sha1($password)) ? sha1($password) : $password;
	}

	public function getRights($_key = '', $_default = '') {
		return utils::getJsonAttr($this->rights, $_key, $_default);
	}

	public function setRights($_key, $_value) {
		$this->rights = utils::setJsonAttr($this->rights, $_key, $_value);
	}

	public function getEnable() {
		return $this->enable;
	}

	public function setEnable($enable) {
		$this->enable = $enable;
	}

	public function getHash() {
		if ($this->hash == '' && $this->id != '') {
			$hash = config::genKey(255);
			while (is_object(self::byHash($hash))) {
				$hash = config::genKey(255);
			}
			$this->setHash($hash);
			$this->save();
		}
		return $this->hash;
	}

	public function setHash($hash) {
		$this->hash = $hash;
	}

}

?>