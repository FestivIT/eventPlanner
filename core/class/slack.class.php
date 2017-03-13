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
	
	public function sendTextMsg($_msg){
		$this->client->send($_msg);
	}
	 
	public function sendEventLastMsg($_eventId){
		$message = $this->client->createMessage();
		
		$message->attach(new Maknz\Slack\Attachment([
		    'color' => 'good',
            'footer' => 'Gaël GRIFFON',
            'title' => 'Logistique Alimentaire',
            'fields' => [
		        new Maknz\Slack\AttachmentField([
		            'title' => 'UBNT NSM5',
		            'value' => 'Installé - Opérationnel',
		            'short' => false])]
		]));
		
		$message->attach(new Maknz\Slack\Attachment([
		    'color' => 'danger',
            'footer' => 'Gaël GRIFFON',
            'title' => 'Régie Bar',
            'text' => 'Problème'
        ]));
		
		$message->send('Changement d\'état 5 dernières minutes');
		
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