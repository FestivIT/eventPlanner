<?php

require_once dirname(__FILE__) . '/core.inc.php';

$slack = new slack('https://hooks.slack.com/services/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');
//$slack->sendTextMsg('Hello world from EP!'); 
$slack->sendEventLastMsg();
?>