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

	public static function getDistanceM($lat1, $lng1, $lat2, $lng2) {
		  $earth_radius = 6378137;   // Terre = sphère de 6378km de rayon
		  $rlo1 = deg2rad($lng1);
		  $rla1 = deg2rad($lat1);
		  $rlo2 = deg2rad($lng2);
		  $rla2 = deg2rad($lat2);
		  $dlo = ($rlo2 - $rlo1) / 2;
		  $dla = ($rla2 - $rla1) / 2;
		  $a = (sin($dla) * sin($dla)) + cos($rla1) * cos($rla2) * (sin($dlo) * sin($dlo
		));
		  $d = 2 * atan2(sqrt($a), sqrt(1 - $a));
		  return ($earth_radius * $d);
	}

	/*     * *********************Méthodes d'instance************************* */


	public function formatForFront(){
		$return = utils::addPrefixToArray(utils::o2a($this), get_class($this));
		return $return;
	}

	public function save($_addMsg = true) {
		if($this->getId() == null){
			DB::save($this);
			if($_addMsg){
				msg::add($this->getOrganisationId(), null, null, null, null, $_SESSION['user']->getId(), "Création du plan " . $this->getName(), 'plan', 'add', $this);
			}
		}else{
			DB::save($this);
			if($_addMsg){
				msg::add($this->getOrganisationId(), null, null, null, null, $_SESSION['user']->getId(), "Mise à jour du plan " . $this->getName(), 'plan', 'update', $this);
			}
		}
		return $this;
	}

	public function remove($_addMsg = true) {
		if($_addMsg){
			msg::add($this->getOrganisationId(), null, null, null, null, $_SESSION['user']->getId(), "Suppression du plan " . $this->getName(), 'plan', 'remove', $this);
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

	public function getPdfSize(){
		$pdfSize = explode(' x ', exec('pdfinfo ' . dirname(__FILE__) . '/../../ressources/eventPlan/' . $this->getId() . '/plan.pdf | grep "Page size:" | grep -o "[0-9]* x [0-9]*"'));
		return $pdfSize;
	}

	public function getJpgLDSize(){
		$jpgSize = explode('x', exec('file ' . dirname(__FILE__) . '/../../ressources/eventPlan/' . $this->getId() . '/planLD.jpg | grep -o ", [0-9]*x[0-9]*" | grep -o "[0-9]*x[0-9]*"'));
		return $jpgSize;
	}

	public function getJpgHDSize(){
		$jpgSize = explode('x', exec('file ' . dirname(__FILE__) . '/../../ressources/eventPlan/' . $this->getId() . '/planHD.jpg | grep -o ", [0-9]*x[0-9]*" | grep -o "[0-9]*x[0-9]*"'));
		return $jpgSize;
	}

	public function getMaxDistance(){
		$planBounds = $this->getBounds();
		return max(plan::getDistanceM($planBounds[0]['lat'], $planBounds[0]['lng'], $planBounds[1]['lat'], $planBounds[1]['lng']), plan::getDistanceM($planBounds[1]['lat'], $planBounds[1]['lng'], $planBounds[2]['lat'], $planBounds[2]['lng']), plan::getDistanceM($planBounds[0]['lat'], $planBounds[0]['lng'], $planBounds[2]['lat'], $planBounds[2]['lng']));
	}

	public function calcDensityLD(){
		$pdfSize = $this->getPdfSize();
		$nbrMaxPixel = 2000;

		$density = round($nbrMaxPixel / (max(intval($pdfSize[0]), intval($pdfSize[1])) / 72 ));

		return $density;
	}

	public function calcDensityHD(){
		$pdfSize = $this->getPdfSize();
		$nbrMaxPixel = round($this->getMaxDistance()/(0.0074*2)); // *2: car trop gros sinon
		$maxDensity = 1200;

		$density = min($maxDensity, round($nbrMaxPixel / (max(intval($pdfSize[0]), intval($pdfSize[1])) / 72 )));

		return $density;
	}

	public function convertPdfToJpgLD(){
		return exec('gs -q -dQUIET -dSAFER -dBATCH -dNOPAUSE -dNOPROMPT -dMaxBitmap=500000000 -dAlignToPixels=0 -dGridFitTT=2 "-sDEVICE=jpeg" -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -dJPEGQ=100 -sOutputFile=' . dirname(__FILE__) . '/../../ressources/eventPlan/' . $this->getId() . '/planLD.jpg -r' . $this->calcDensityLD() .' ' . dirname(__FILE__) . '/../../ressources/eventPlan/' . $this->getId() . '/plan.pdf');
	}

	public function convertJpgToJpgLD(){
		// return exec('gs -q -dQUIET -dSAFER -dBATCH -dNOPAUSE -dNOPROMPT -dMaxBitmap=500000000 -dAlignToPixels=0 -dGridFitTT=2 "-sDEVICE=jpeg" -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -dJPEGQ=100 -sOutputFile=' . dirname(__FILE__) . '/../../ressources/eventPlan/' . $this->getId() . '/planLD.jpg -r' . $this->calcDensityLD() .' ' . dirname(__FILE__) . '/../../ressources/eventPlan/' . $this->getId() . '/planLD.pdf');
	}

	public function makeTiles(){
		$planBounds = $this->getBounds();
		return exec("sh " . dirname(__FILE__) . "/../shell/maketile.sh " . $this->getId() . " '" . round($planBounds[0]['lng'], 6) . "' '" . round($planBounds[0]['lat'], 6) . "' '" . round($planBounds[1]['lng'], 6) . "' '" . round($planBounds[1]['lat'], 6) . "' '" . round($planBounds[2]['lng'], 6) . "' '" . round($planBounds[2]['lat'], 6) . "' " . $this->calcDensityHD() . " > " . dirname(__FILE__) . "/../../ressources/eventPlan/" . $this->getId() . "/log.txt 2>&1 &");
	}

}
?>

