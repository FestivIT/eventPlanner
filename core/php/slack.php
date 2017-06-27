<?php

require_once dirname(__FILE__) . '/core.inc.php';

$slack = new slack('https://hooks.slack.com/services/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'); // EVENTPLANNER VC-MONITORING
//$slack->sendTextMsg('Hello world from EP!'); 
$slack->sendEventLastMsg(15,2); // VIEILLES CHARRUES, 2 MINUTES
?>