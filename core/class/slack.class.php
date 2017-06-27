<?php

/* * ***************************Includes********************************* */
require_once dirname(__FILE__) . '/../../core/php/core.inc.php';

class slack {
	/*     * *************************Attributs****************************** */

	private $client;

	/*     * ***********************Méthodes statiques*************************** */

	/*     * ***********************Méthodes d'instance************************** */
	public function __construct($_hooksURL){
		/*
		Pour que ça fonctionne:
			Créer une application dans SLACK Deve API
			Configurer un Incomming WebHooks
			Configurer l'URL de retour Interactiv Message
		
		TESTER LES MESSAGES INTERACTIF A LA CONNECTION (SI POSSIBLE)
		
		*/
		
		$this->client = new Maknz\Slack\Client($_hooksURL);
	}

	public function getStateColor($state){
		$colorClass = getStateColorClass($state);

		switch($colorClass){
			case 'active':
				return '#4b98ea';

			case 'success':
				return 'good';

			case 'warning':
				return 'warning';

			case 'danger':
				return 'danger';
		}
	}
	
	public function sendTextMsg($_msg){
		$this->client->send($_msg);
	}
	 
	public function sendEventLastMsg($_eventId, $_minuteInterval){

		$eqLogicStateAlreadyCheck = [];
		$missionStateAlreadyCheck = [];
		$zoneStateAlreadyCheck = [];

		$message = $this->client->createMessage();

		$msgList = msg::byEventIdInterval($_eventId, $_minuteInterval, 3);

		foreach ($msgList as $msg){

			$msgData = $msg->getData();

			$zone = '';
			if($msg->getZone() != null){
				$zone = $msg->getZone()->getName();
			}

			$user = '';
			if($msg->getUser() != null){
				$user = $msg->getUser()->getName();
			}

			$msgContent = json_decode($msg->getContent(), true);

			switch($msg->getLevel()){
				case '3': // Changement d'état
					switch($msgData['type']){
						case 'eqLogic':
							$eqLogicId = $msgData['content']['eqLogicId'];

							if(!in_array($eqLogicId, $eqLogicStateAlreadyCheck)){
								array_push($eqLogicStateAlreadyCheck, $eqLogicId);

								$eqLogic = eqLogic::byId($eqLogicId);

								$eqLogicName = $eqLogic->getMatType()->getName();
								if($eqLogic->getEqReal() != null){
									$eqLogicName .= ' ' . $eqLogic->getEqReal()->getName();
								}

								$message->attach(new Maknz\Slack\Attachment([
									'color' => slack::getStateColor($eqLogic->getState()),
						            'author_name' => $user,
						            'footer' => $msg->getDate(),
						            'title' => $eqLogic->getZone()->getName(),
				   					'fields' => [
				   						new Maknz\Slack\AttachmentField([
								            'title' => $eqLogicName,
								            'value' => getStateText($eqLogic->getState()),
								            'short' => faslse])]
									]));
							}
						break;

						case 'zone':
							$zoneId = $msgData['content']['zoneId'];

							if(!in_array($zoneId, $zoneStateAlreadyCheck)){
								array_push($zoneStateAlreadyCheck, $zoneId);

								$zone = zone::byId($zoneId);

								$message->attach(new Maknz\Slack\Attachment([
									'color' => slack::getStateColor($zone->getState()),
						            'author_name' => $user,
						            'footer' => $msg->getDate(),
						            'title' => $zone->getName(),
				   					'text' => getStateText($zone->getState())
									]));
							}
						break;

						case 'mission':
							$missionId = $msgData['content']['missionId'];
							if(!in_array($missionId, $missionStateAlreadyCheck)){
								array_push($missionStateAlreadyCheck, $missionId);

								$mission = mission::byId($missionId);

								$message->attach(new Maknz\Slack\Attachment([
									'color' => slack::getStateColor($mission->getState()),
						            'author_name' => $user,
						            'footer' => $msg->getDate(),
						            'title' => 'Mission: ' . $mission->getName(),
				   					'text' => getStateText($mission->getState())
									]));
							}
						break;
					}
				break;

				case '4': // Nouvelle mission
					$missionId = $msgData['content']['missionId'];

					$mission = mission::byId($missionId);

					$userList = "";
					foreach($mission->getUsers() as $userAssoc){
						$userList .= $userAssoc->getUser()->getName() . "\n";
					}

					$zoneList = "";
					foreach($mission->getZones() as $zoneAssoc){
						$zoneList .= $zoneAssoc->getZone()->getName() . "\n";
					}

					$message->attach(new Maknz\Slack\Attachment([
					'color' => slack::getStateColor($mission->getState()),
					'pretext' => 'Nouvelle mission créée!',
		            'author_name' => $user,
					'footer' => $msg->getDate(),
		            'title' => $mission->getName(),
   					'text' => $mission->getComment(),
   					'fields' => [
   						new Maknz\Slack\AttachmentField([
				            'title' => 'Zones concernées:',
				            'value' => $zoneList,
				            'short' => true]),

   						new Maknz\Slack\AttachmentField([
				            'title' => 'Attribuée à:',
				            'value' => $userList,
				            'short' => true])]
					]));
				break;

				case '6': // Saisie utilisateur
					switch($msgContent['type']){
						case 'text':
							$message->attach(new Maknz\Slack\Attachment([
							'color' => '#4b98ea',
				            'author_name' => $user,
					        'footer' => $msg->getDate(),
				            'title' => $zone,
           					'text' => $msgContent['value']
							]));
						break;

						case 'msgPhoto';
							$message->attach(new Maknz\Slack\Attachment([
							'color' => '#4b98ea',
				            'author_name' => $user,
					        'footer' => $msg->getDate(),
				            'title' => $zone,
           					'image_url' => 'https://event.festivit.ovh/ressources/msgPhoto/' . $msgContent['fileName']
							]));
						break;
					}
				break;
			}

			
		}
		
		if(count($msgList)){
			$message->send('Changement des 2 dernières minutes:');
		}
		

		/*
		
		{
            "color": "good",
            "footer": "Gaël GRIFFON",
            "title": "Logistique Alimentaire",
            "fields": [
                {
                    "title": "UBNT NSM5",
                    "value": "Installé - Opérationnel",
                    "short": false
                }
            ]
        }
		
		
		*/
		/*$attachAction = new Maknz\Slack\AttachmentAction([
		            'name' => 'Game',
		            'text' => 'Chess',
		            'type' => 'button',
		            'value' => 'Chess',
		            "confirm" => [
                        "title" => "Are you sure?",
                        "text" => "Wouldn't you prefer a good game of chess?",
                        "ok_text" => "Yes",
                        "dismiss_text" => "No"
					]
		        ]);
		        
		$attach = new Maknz\Slack\Attachment([
		    'fallback' => 'Current server stats',
		    'text' => 'Current server stats',
		    'color' => 'danger',
		    'callback_id' => 'wopr_game',
		    'attachment_type' => 'default',
		    'actions' => [$attachAction]
		]);
		
		*/
	}
}

?>