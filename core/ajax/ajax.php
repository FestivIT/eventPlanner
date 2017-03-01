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
			ajax::success(utils::addPrefixToArray(utils::o2a($_SESSION['user']), 'user'));
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
			case "eqLink":
			case "eqLogic":
			case "mission":
			case "msg":
			case "zone":
			case "contact":
				// Pour ceux-là, on ne récupère que ceux liés à l'événement en cours
				$results = $class::byEventId($_SESSION['user']->getEventId());
				foreach ($results as &$result) {
					$result = $result->formatForFront();
				}
				ajax::success($results);
			break;

			default:
				// Pour ceux-là, on récupére tout
				$results = $class::all();
				foreach ($results as &$result) {
					$result = $result->formatForFront();
				}
				ajax::success($results);
			break;
		}
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
			$el->save(false); // Première sauvegarde dans le cas
			$el->refresh();
		}
		
		// eqLogic: traitement des eqLinks
		if(($class == 'eqLogic') && array_key_exists('eqLinks',$json)){
			foreach ($json['eqLinks']['create'] as $eqLinkData){
			    $eqLink = new eqLink();
			    $eqLink->setEventId($eqLogic->getEventId());
			    $eqLink->setEqLogicId1($eqLogic->getId());
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
			$missionUsers = missionUserAssociation::byMissionId($json['id']);
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
				$missionUser->setMissionId($json['id']);
				$missionUser->setUserId($userId);
				$missionUser->save();

			}
		}

		if(($class == 'mission') && array_key_exists('zones',$json)){
			$missionZones = missionZoneAssociation::byMissionId($json['id']);
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

		if(($class == 'matType') && array_key_exists('attributes',$json)){
			$matTypeAttributes = matTypeAttribute::byMatTypeId($json['id']);
			foreach ($matTypeAttributes as $matTypeAttribute){
				foreach ($json['attributes'] as $i => $jsonAttribute){
					if($matTypeAttribute->getId() == $jsonAttribute['id']){
						// Si l'attribut existe déjà, on le met à jour
						$matTypeAttribute->setName($jsonAttribute['name']);
						$matTypeAttribute->setOptions($jsonAttribute['options']);
						$matTypeAttribute->save();
						unset($json['attributes'][$i]);
					}else{
						// sinon, on le supprime de la BDD
						$matTypeAttribute->remove();
					}
				}
			}

			// Pour les ID restants, on créer les attributs
			foreach ($json['attributes'] as $jsonAttribute){
				$matTypeAttribute = new matTypeAttribute();
				$matTypeAttribute->setMatTypeId($json['id']);
				$matTypeAttribute->setName($jsonAttribute['name']);
				$matTypeAttribute->setOptions($jsonAttribute['options']);
				$matTypeAttribute->save();
			}
		}

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

	// MSG
	if  (($class == 'msg') && (init('action') == 'sinceId')) {
		$results = msg::byEventIdSinceId(init('id'), $_SESSION['user']->getEventId());
		foreach ($results as &$result) {
			$result = $result->formatForFront();
		}
		ajax::success($results);
	}

	// USER
	if (($class == 'user') && (init('action') == 'get')) {
		// ajax::success(utils::o2a($_SESSION['user']));
		ajax::success($_SESSION['user']->formatForFront(true));
	}

	throw new Exception('Aucune methode correspondante à : ' . init('action'));
	/*     * *********Catch exeption*************** */
} catch (Exception $e) {
	ajax::error(displayExeption($e), $e->getCode());
}

?>