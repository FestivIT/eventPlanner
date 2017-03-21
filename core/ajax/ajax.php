<?php

try {
	require_once dirname(__FILE__) . '/../../core/php/core.inc.php';
	include_file('core', 'authentification', 'php');

	if(class_exists(init('type'))){
		$class = init('type');
	}else{
		throw new Exception('Aucune class correspondante à : ' . init('type'));
	}

	// USER: avant login
	if (($class == 'user') && (init('action') == 'login')) {
		if (!isConnect() && !login(init('username'), init('password'))) {
			throw new Exception('Mot de passe ou nom d\'utilisateur incorrect');
		}
		if (init('storeConnection') == 1) {
			setcookie('registerDevice', $_SESSION['user']->getHash(), time() + 365 * 24 * 3600, "/", '', false, true);
			if (!isset($_COOKIE['eventplanner_token'])) {
				setcookie('eventplanner_token', ajax::getToken(), time() + 365 * 24 * 3600, "/", '', false, true);
			}
		}
		ajax::success();
	}
	
	if (($class == 'user') && (init('action') == 'isConnect')) {
		if (isConnect()) {
			ajax::success($_SESSION['user']->formatForFront(true));
		}else{
			throw new Exception('Utilisateur non identifié.');
		}
	}

	if (!isConnect()) {
		throw new Exception('401 - Accès non autorisé');
	}

	ajax::init();

	if (init('action') == 'all') {
		switch($class){
			case "msg":
				$results = $class::forUserId($_SESSION['user']->getId());
				//$results = $class::byEventId($_SESSION['user']->getEventId());
				break;
			case "eqLink":
			case "eqLogic":
			case "eqLogicAttribute":
			case "mission":
			case "zone":
			case "contact":
			case "eventLevel":
				// Event Only
				$results = $class::byEventId($_SESSION['user']->getEventId());
				break;

			case "matType":
			case "matTypeAttribute":
			case "eqReal":
			case "user":
				// Discipline Only
				$results = $class::byDisciplineId($_SESSION['user']->getDisciplineId());
				break;

			case "event":
			case "discipline":
			case "plan":
				// Organisation only
				$results = $class::byOrganisationId($_SESSION['user']->getDiscipline()->getOrganisationId());
				break;

			case "organisation":
				$results = array($class::byId($_SESSION['user']->getDiscipline()->getOrganisationId()));
				break;

			default:
				throw new Exception('Classe non gérée: ' . $class);
				break;
		}

		foreach ($results as &$result) {
			$result = $result->formatForFront();
		}
		ajax::success($results);
	}

	if (init('action') == 'save') {
		$json = json_decode(init($class), true);
		
		if (isset($json['id'])) {
			$el = $class::byId($json['id']);
			utils::a2o($el, $json);
		}

		if (!isset($el) || !is_object($el)) {
			$el = new $class();
			utils::a2o($el, $json);
			$el->save(true); // Première sauvegarde dans le cas où on a pas d'ID: création
			$el->refresh();
		}
		
		// eqLogic: traitement des eqLinks
		if(($class == 'eqLogic') && array_key_exists('eqLinks',$json)){
			foreach ($json['eqLinks']['create'] as $eqLinkData){
			    $eqLink = new eqLink();
			    $eqLink->setEventId($el->getEventId());
			    $eqLink->setEqLogicId1($el->getId());
			    $eqLink->setEqLogicId2($eqLinkData['eqLinkTargetEqLogicId']);
			    $eqLink->setType($eqLinkData['eqLinkType']);
			    $eqLink->save();
			}

			foreach ($json['eqLinks']['update'] as $eqLinkData){
				$eqLink = eqLink::byId($eqLinkData['eqLinkId']);
				if(is_object($eqLink)){
				    $eqLink->setEqLogicId1($el->getId());
				    $eqLink->setEqLogicId2($eqLinkData['eqLinkTargetEqLogicId']);
				    $eqLink->setType($eqLinkData['eqLinkType']);
				    $eqLink->save();
				}
			}

			foreach ($json['eqLinks']['del'] as $eqLinkData){
				$eqLink = eqLink::byId($eqLinkData['eqLinkId']);
				if(is_object($eqLink)){
				    $eqLink->remove();
				}
			}
		}

		// Mission: traitement des zones et users
		if(($class == 'mission') && array_key_exists('users',$json)){
			$missionUsers = missionUserAssociation::byMissionId($el->getId());
			foreach ($missionUsers as $missionUser){
				if(array_key_exists($missionUser->getUserId(),$json['users'])){
					// Si l'utilisateur est déjà sur cette mission, on le supprime de la liste à ajouter
					unset($json['users'][array_search($missionUser->getUserId(), $json['users'])]);
				}else{
					// sinon, on le supprime de la BDD
					$missionUser->remove();
				}
			}

			// Pour les ID restants, on créer les liaisons
			foreach ($json['users'] as $userId){
				$missionUser = new missionUserAssociation();
				$missionUser->setMissionId($el->getId());
				$missionUser->setUserId($userId);
				$missionUser->save();

			}
		}

		if(($class == 'mission') && array_key_exists('zones',$json)){
			$missionZones = missionZoneAssociation::byMissionId($el->getId());
			foreach ($missionZones as $missionZone){
				if(array_key_exists($missionZone->getZoneId(),$json['zones'])){
					// Si la zone est déjà sur cette mission, on la supprime de la liste à ajouter
					unset($json['zones'][array_search($missionZone->getZoneId(), $json['zones'])]);
				}else{
					// sinon, on la supprime de la BDD
					$missionZone->remove();
				}
			}

			// Pour les ID restants, on créer les liaisons
			foreach ($json['zones'] as $zoneId){
				$missionZone = new missionZoneAssociation();
				$missionZone->setMissionId($json['id']);
				$missionZone->setZoneId($zoneId);
				$missionZone->save();

			}
		}

		// MatTypeAttributes
		if(($class == 'matType') && array_key_exists('attributes',$json)){
			$matTypeAttributes = matTypeAttribute::byMatTypeId($el->getId());
			
			// Pour chacun des attribut de la base (déjà connus)
			foreach ($matTypeAttributes as $matTypeAttribute){
				
				// On regarde chacun des attributs transmis pour retrouver celui (le connu) qu'on est entrain de traiter
				$attrFind = false;
				foreach ($json['attributes'] as $i => $jsonAttribute){
					if($matTypeAttribute->getId() == $jsonAttribute['id']){
						// Si l'attribut existe déjà, on le met à jour
						$matTypeAttribute->setName($jsonAttribute['name']);
						$matTypeAttribute->setOptions($jsonAttribute['options']);
						$matTypeAttribute->save();
						$attrFind = true;
						unset($json['attributes'][$i]);
					}
				}
				
				// Si on a pas trouvé l'attr dans les attr transmis, alors il faut le supprimer
				if(!$attrFind){
					$matTypeAttribute->remove();
				}
			}

			// Pour les ID restants, on créer les attributs
			foreach ($json['attributes'] as $jsonAttribute){
				$matTypeAttribute = new matTypeAttribute();
				$matTypeAttribute->setMatTypeId($el->getId());
				$matTypeAttribute->setName($jsonAttribute['name']);
				$matTypeAttribute->setOptions($jsonAttribute['options']);
				$matTypeAttribute->save();
			}
		}

		// EqLogicAttributes
		if(($class == 'eqLogic') && array_key_exists('attributes',$json)){
			$eqLogicAttributes = eqLogicAttribute::byEqLogicId($el->getId());
			
			// Pour chacun des attribut de la base (déjà connus)
			foreach ($eqLogicAttributes as $eqLogicAttribute){
				
				// On regarde chacun des attributs transmis pour retrouver celui (le connu) qu'on est entrain de traiter
				$attrFind = false;
				foreach ($json['attributes'] as $i => $jsonAttribute){
					if($eqLogicAttribute->getId() == $jsonAttribute['id']){
						// Si l'attribut existe déjà, on le met à jour
						$eqLogicAttribute->setValue($jsonAttribute['value']);
						$eqLogicAttribute->setMatTypeAttributeId($jsonAttribute['matTypeAttributeId']);
						$eqLogicAttribute->save();
						$attrFind = true;
						unset($json['attributes'][$i]);
					}
				}
				
				// Si on a pas trouvé l'attr dans les attr transmis, alors il faut le supprimer
				if(!$attrFind){
					$eqLogicAttribute->remove();
				}
			}

			// Pour les ID restants, on créer les attributs
			foreach ($json['attributes'] as $jsonAttribute){
				$eqLogicAttribute = new eqLogicAttribute();
				$eqLogicAttribute->setEqLogicId($el->getId());
				$eqLogicAttribute->setValue($jsonAttribute['value']);
				$eqLogicAttribute->setMatTypeAttributeId($jsonAttribute['matTypeAttributeId']);
				$eqLogicAttribute->save();
			}
		}

		// Sauvegarde avec création du MSG
		$el->save(true);

		ajax::success($el->formatForFront());
	}

	if (init('action') == 'updateState') {
		$listId = json_decode(init('listId'), true);
		$state = init('state');
		
		if($class == 'zone'){
			$eqLogicState = init('eqLogicState');
			$results = $class::updateState($listId, $state, $eqLogicState);
		}else{
			$results = $class::updateState($listId, $state);
		}

		foreach ($results as &$result) {
			$result = $result->formatForFront();
		}
		ajax::success($results);
	}

	if (init('action') == 'remove') {
		throw new Exception('Droit insuffisant pour supprimer - ' . $class);

		$el = $class::byId(init('id'));

		if (isset($el) && is_object($el)) {
			$el->remove();
		}

		ajax::success();
	}

	// MSG
	if  (($class == 'msg') && (init('action') == 'sinceId')) {
		$results = msg::forUserIdSinceId(init('id'), $_SESSION['user']->getId());
		//$results = msg::byEventIdSinceId(init('id'), $_SESSION['user']->getEventId());
		foreach ($results as &$result) {
			$result = $result->formatForFront();
		}
		ajax::success($results);
	}

	if (($class == 'msg') && (init('action') == 'uploadPhoto')) {
		$extension = strtolower(strrchr($_FILES['file']['name'], '.'));
		$uploaddir = dirname(__FILE__) . '/../../ressources/msgPhoto/';

		$msg = new msg();
		$msg->setEventId($_SESSION['user']->getEventId());
		$msg->setzoneId(init('zoneId', null));
		$msg->setEqId(init('eqLogicId', null));
		$msg->setUserId($_SESSION['user']->getId());
		$msg->setContent('');
		$msg->save();
		$msg->refresh();
		$msg->setContent(array(
			'type' => 'msgPhoto',
			'fileName' => $msg->getId() . $extension
		));
		$msg->save();

		if (!file_exists($uploaddir)) {
			mkdir($uploaddir);
		}
		if (!file_exists($uploaddir)) {
			$msg->remove();
			throw new Exception('Répertoire d\'upload non trouvé : ' . $uploaddir);
		}
		if (!isset($_FILES['file'])) {
			$msg->remove();
			throw new Exception('Aucun fichier trouvé. Vérifié parametre PHP (post size limit)');
		}
		if (!in_array($extension, array('.jpg', '.png'))) {
			$msg->remove();
			throw new Exception('Extension du fichier non valide: ' . $extension);
		}
		if (filesize($_FILES['file']['tmp_name']) > 30000000) {
			$msg->remove();
			throw new Exception('Le fichier est trop gros (maximum 30mo)');
		}
		if (!move_uploaded_file($_FILES['file']['tmp_name'], $uploaddir . '/' . $msg->getId() . $extension)) {
			$msg->remove();
			throw new Exception('Impossible de déplacer le fichier temporaire');
		}
		if (!file_exists($uploaddir . '/' . $msg->getId() . $extension)) {
			$msg->remove();
			throw new Exception('Impossible d\'uploader le fichier (limite du serveur web ?)');
		}
		ajax::success();
	}

	// USER
	if (($class == 'user') && (init('action') == 'get')) {
		// ajax::success(utils::o2a($_SESSION['user']));
		ajax::success($_SESSION['user']->formatForFront(true));
	}

	// PLAN
	if (($class == 'plan') && (init('action') == 'uploadPlanFile')) {
		$plan = plan::byId(init('planId'));
		
		if(!is_object($plan)){
			throw new Exception('Plan non trouvé : ' . init('planId'));
		}

		$extension = strtolower(strrchr($_FILES['file']['name'], '.'));
		$uploaddir = dirname(__FILE__) . '/../../ressources/eventPlan/' . $plan->getId();

		if (!file_exists($uploaddir)) {
			mkdir($uploaddir);
		}
		if (!file_exists($uploaddir)) {
			throw new Exception('Répertoire d\'upload non trouvé : ' . $uploaddir);
		}
		if (!isset($_FILES['file'])) {
			throw new Exception('Aucun fichier trouvé. Vérifié parametre PHP (post size limit)');
		}
		if (!in_array($extension, array('.jpg', '.pdf'))) {
			throw new Exception('Extension du fichier non valide: ' . $extension);
		}
		if (filesize($_FILES['file']['tmp_name']) > 300000000) {
			throw new Exception('Le fichier est trop gros (maximum 300mo)');
		}
		if (!move_uploaded_file($_FILES['file']['tmp_name'], $uploaddir . '/plan' . $extension)) {
			throw new Exception('Impossible de déplacer le fichier temporaire');
		}
		if (!file_exists($uploaddir . '/plan' . $extension)) {
			throw new Exception('Impossible d\'uploader le fichier (limite du serveur web ?)');
		}

		if($extension == '.pdf'){
			if($plan->convertPdfToJpgLD()){
				throw new Exception('Probléme lors de la conversion du plan PDF');
			}
		}

		if($extension == '.jpg'){
			if($plan->convertJpgToJpgLD()){
				throw new Exception('Probléme lors de la conversion du plan JPG');
			}
		}

		ajax::success();
	}

	if  (($class == 'plan') && (init('action') == 'generateTiles')) {
		$plan = $class::byId(init('id'));
		if (isset($plan) && is_object($plan)) {
			ajax::success($plan->makeTiles());
		}
		
		throw new Exception('Plan inconnu - Id:' . init('id'));
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>