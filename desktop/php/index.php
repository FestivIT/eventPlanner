<?php
include_file('core', 'authentification', 'php');

global $EVENTPLANNER_INTERNAL_CONFIG;

$homeLink = 'index.php?p=dashboard';

if (init('p') == '' && isConnect()) {
	redirect($homeLink);
}

?>

<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="utf-8">
	<title>eventPlanner</title>
	<link rel="shortcut icon" href="core/img/logo-eventplanner-sans-nom-couleur-25x25.png">
	<meta name="viewport" content="initial-scale=1,user-scalable=no,maximum-scale=1,width=device-width">
	<meta name="description" content="">
	<meta name="author" content="">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	<?php
include_file('3rdparty', 'bootstrap/css/bootstrap.min', 'css');
include_file('3rdparty', 'roboto/roboto', 'css');


include_file('core', 'icon.inc', 'php');
include_file('core', 'core', 'css');

include_file('3rdparty', 'jquery.toastr/jquery.toastr.min', 'css');
include_file('3rdparty', 'jquery.ui/jquery-ui-bootstrap/jquery-ui', 'css');
include_file('3rdparty', 'jquery.utils/jquery.utils', 'css');
include_file('3rdparty', 'bootstrap.slider/css/slider', 'css');

include_file('3rdparty', 'jquery/jquery.min', 'js');
?>
	<script>
		EVENTPLANNER_AJAX_TOKEN='<?php echo ajax::getToken() ?>';
		$.ajaxSetup({
			type: "POST",
			data: {
				eventplanner_token: '<?php echo ajax::getToken() ?>'
			}
		})
	</script>
	<?php
include_file('3rdparty', 'jquery.utils/jquery.utils', 'js');
include_file('3rdparty', 'bootstrap/bootstrap.min', 'js');
include_file('3rdparty', 'jquery.ui/jquery-ui.min', 'js');
include_file('3rdparty', 'bootbox/bootbox.min', 'js');
//include_file('3rdparty', 'highstock/highstock', 'js');
//include_file('3rdparty', 'highstock/highcharts-more', 'js');
//include_file('3rdparty', 'highstock/modules/solid-gauge', 'js');
//include_file('3rdparty', 'highstock/modules/exporting', 'js');
include_file('3rdparty', 'jquery.toastr/jquery.toastr.min', 'js');
include_file('3rdparty', 'jquery.at.caret/jquery.at.caret.min', 'js');
include_file('3rdparty', 'bootstrap.slider/js/bootstrap-slider', 'js');
include_file('3rdparty', 'jwerty/jwerty', 'js');
//include_file('3rdparty', 'jquery.packery/jquery.packery', 'js');
//include_file('3rdparty', 'jquery.lazyload/jquery.lazyload', 'js');
include_file('3rdparty', 'jquery.loadTemplate/jquery.loadTemplate.min', 'js');
include_file('3rdparty', 'jquery.tree/jstree.min', 'js');
include_file('3rdparty', 'jquery.fileupload/jquery.ui.widget', 'js');
include_file('3rdparty', 'jquery.fileupload/jquery.iframe-transport', 'js');
include_file('3rdparty', 'jquery.fileupload/jquery.fileupload', 'js');
include_file('3rdparty', 'jquery.tablesorter/jquery.tablesorter.min', 'js');
include_file('3rdparty', 'jquery.tablesorter/jquery.tablesorter.widgets.min', 'js');
include_file('3rdparty', 'jquery.tablesorter/jquery.tablesorter.pager', 'js');
include_file('3rdparty', 'jquery.typeahead/jquery.typeahead.min', 'js');
include_file('3rdparty', 'bootstrap-switch/bootstrap-switch.min', 'js');
include_file('3rdparty', 'bootstrap-datepicker/bootstrap-datepicker.min', 'js');
include_file('3rdparty', 'leaflet/leaflet', 'js');
include_file('3rdparty', 'leaflet/leaflet.awesome-markers.min', 'js');
include_file('3rdparty', 'leaflet/Leaflet.ImageOverlay.Rotated', 'js');
include_file('3rdparty', 'leaflet/Leaflet.tilelayer.fallback', 'js');
include_file('3rdparty', 'leaflet/Leaflet.singleclick', 'js');
include_file('3rdparty', 'snap.svg/snap.svg-min', 'js');

include_file('core', 'core', 'js');
include_file('core', 'js.inc', 'php');

include_file('desktop', 'commun', 'js');
include_file('desktop', 'eventplanner.ui.class', 'js');

include_file('3rdparty', 'jquery.sew/jquery.sew', 'css');
include_file('3rdparty', 'jquery.tree/themes/default/style.min', 'css');
include_file('3rdparty', 'jquery.tablesorter/theme.bootstrap', 'css');
include_file('3rdparty', 'jquery.tablesorter/jquery.tablesorter.pager', 'css');
include_file('3rdparty', 'jquery.typeahead/jquery.typeahead.min', 'css');
include_file('3rdparty', 'bootstrap-switch/bootstrap-switch.min', 'css');
include_file('3rdparty', 'bootstrap-datepicker/bootstrap-datepicker.min', 'css');
include_file('3rdparty', 'leaflet/leaflet', 'css');
include_file('3rdparty', 'leaflet/leaflet.awesome-markers', 'css');

include_file('desktop', 'commun', 'css');

?>
</head>
<body>
	<?php
	if (!isConnect()) {
		include_file('desktop', 'connection', 'php');
	} else {
		sendVarToJS('userProfils', $_SESSION['user']->getOptions());
		sendVarToJS('user_id', $_SESSION['user']->getId());
		sendVarToJS('user_login', $_SESSION['user']->getLogin());
	?>
		<div class="navbar navbar-default navbar-fixed-top" role="navigation">
	      <div class="container-fluid">
	        <div class="navbar-header">
	          <div class="navbar-icon-container">
	            <a href="#" class="navbar-icon pull-right visible-xs" id="nav-btn"><i class="fa fa-bars fa-lg white"></i></a>
	          </div>
	          <a class="navbar-brand" href="<?php echo $homeLink; ?>">eventPlanner by FestivIT</a>
	        </div>





	        <div class="navbar-collapse collapse">

	          <form class="navbar-form navbar-right" role="search">
	            <div class="form-group has-feedback typeahead__container typeahead__field typeahead__query">
	                <input id="searchbox" type="search" placeholder="Rechercher" class="form-control" name="q" autocomplete="off">
	                <span id="searchicon" class="fa fa-search form-control-feedback"></span>
	            </div>
	          </form>

	          <ul class="nav navbar-nav">
	            <li class="dropdown">
	              <a id="generalDrop" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-book"></i>&nbsp;&nbsp; Général<b class="caret"></b></a>
	              <ul class="dropdown-menu">
	                <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in"  class="navBarBtn" data-link="dashboard"><i class="glyphicon glyphicon-th"></i>&nbsp;&nbsp;Dashboard</a></li>
	                <li class="divider hidden-xs"></li>
	                <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="inventaire"><i class="glyphicon glyphicon-th-list"></i>&nbsp;&nbsp;Inventaire Matériel</a></li>
	                <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="utilitaires"><i class="glyphicon glyphicon-wrench"></i>&nbsp;&nbsp;Utilitaires</a></li>
	                <li class="divider hidden-xs"></li>
	                <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="configuration"><i class="glyphicon glyphicon-cog"></i>&nbsp;&nbsp;Configuration</a></li>
	              </ul>
	            </li>
	            <li class="dropdown">
	            <?php

// A reprendre pour un paramétrage à l'initialisation de l'UI

	            	$currentEventId = $_SESSION['user']->getOptions('eventId', '0');
	            	if($currentEventId != 0){
	            		$currentEvent = event::byId($currentEventId);
	            		if(is_object($currentEvent)){
	            			echo '<a id="eventDrop" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-cd"></i>&nbsp;&nbsp;' . $currentEvent->getName() . ' <b class="caret"></b></a>';
	            		}else{
	            			echo '<a style="display: none;" id="eventDrop" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-cd"></i>&nbsp;&nbsp;Evenement <b class="caret"></b></a>';
	            		}
	            	}else{
	            		echo '<a style="display: none;" id="eventDrop" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-cd"></i>&nbsp;&nbsp;Evenement <b class="caret"></b></a>';
	            	}
	            ?>
	              <ul class="dropdown-menu">
	                <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="map"><i class="fa fa-globe white"></i>&nbsp;&nbsp;Carte</a></li>
	                <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="planning"><i class="glyphicon glyphicon-calendar"></i>&nbsp;&nbsp;Planning</a></li>
	                <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="maincourante"><i class="glyphicon glyphicon-pencil"></i>&nbsp;&nbsp;Main courante</a></li>
	                <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="mission"><i class="glyphicon glyphicon-list-alt"></i>&nbsp;&nbsp;Missions</a></li>
	                <li class="divider hidden-xs"></li>
	                <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="equipements"><i class="glyphicon glyphicon-hdd"></i>&nbsp;&nbsp;Equipements</a></li>
	                <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="zones"><i class="glyphicon glyphicon-map-marker"></i>&nbsp;&nbsp;Zones</a></li>
	                <li class="divider hidden-xs"></li>
	                <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="eventinfos"><i class="glyphicon glyphicon-info-sign"></i>&nbsp;&nbsp;Infos Evenement</a></li>
	              </ul>
	            </li>
	            <li class="dropdown">
	                <a class="dropdown-toggle" id="accountDrop" href="#" role="button" data-toggle="dropdown"><i class="glyphicon glyphicon-folder-open"></i>&nbsp;&nbsp;Mon compte <b class="caret"></b></a>
	                <ul class="dropdown-menu">
	                  	<li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="userinfos"><i class="glyphicon glyphicon-briefcase"></i>&nbsp;&nbsp;Mes infos</a></li>
	                	<li class="divider hidden-xs"></li>
	                	<li><a href="<?php echo $homeLink; ?>&logout=1" data-toggle="collapse" data-target=".navbar-collapse.in"><i class="glyphicon glyphicon-off"></i>&nbsp;&nbsp;Se déconnecter</a></li>
	                </ul>
	            </li>
	          </ul>
	        </div><!--/.navbar-collapse -->
	      </div>
	    </div>
	    
	    <div class="container" id="pageContainer"></div>
	    
		<div id="modalContainer"></div>
		<script type="text/html" id="templateModal">
			<div class="modal fade" data-template-bind='[{"attribute": "id", "value": "modalId"}]' role="dialog">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button class="close" type="button" data-dismiss="modal" aria-hidden="true">&times;</button>
							<h4 class="modal-title text-primary" data-content="title"></h4>
						</div>
						<div class="modal-body" data-content="modalContent"></div>
						<div class="modal-footer">
							<button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button>
						</div>
					</div>
				</div>
			</div>
		</script>
		<?php
	}
	?>
	
	</body>
</html>