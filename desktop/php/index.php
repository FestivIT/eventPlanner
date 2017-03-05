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
	<link rel="shortcut icon" href="desktop/img/logo25.png">
	
	<meta name="description" content="Préparez et Plannifiez vos événements!">
	<meta name="author" content="Gaël GRIFFON">

	<!-- Allow web app to be run in full-screen mode. -->  
    <meta name="apple-mobile-web-app-capable" content="yes">  
    <meta name="mobile-web-app-capable" content="yes">

    <!-- Make the app title different than the page title. -->  
    <meta name="apple-mobile-web-app-title" content="eventPlanner">

     <!-- Configure the status bar. --> 
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />

	<!-- Set the viewport. -->  
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

    <!-- Enable automatic phone number detection. -->  
    <meta name="format-detection" content="telephone=yes">
 
    <meta name="application-name" content="eventPlanner">  
    <meta name="msapplication-TileColor" content="#2196f3">  
    <meta name="msapplication-TileImage" content="desktop/img/logo114.png">  
    <meta name="theme-color" content="#2196f3"> 

    <link rel="apple-touch-icon" href="desktop/img/logo25.png"/>
	<link rel="apple-touch-icon" sizes="114x114" href="desktop/img/logo114.png"/>
	<link rel="apple-touch-icon" sizes="72x72" href="desktop/img/logo72.png" />
     
    <!-- STARTUP IMAGES --> 
	<link rel="apple-touch-startup-image" href="desktop/img/logo320x460.png"/>
	<link rel="apple-touch-startup-image" sizes="1024x748" href="desktop/img/splashscreen1024x748.png" />
	<link rel="apple-touch-startup-image" sizes="768x1004" href="desktop/img/logo768x1004.png" />
	<link rel="apple-touch-startup-image" sizes="640x960" href="desktop/img/logo640x960.png" />
	<!-- END icon for iOS Devices -->

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
//include_file('3rdparty', 'bootstrap/multimodal', 'js');
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
include_file('3rdparty', 'bootstrap-tokenfield/bootstrap-tokenfield.min', 'js');
include_file('3rdparty', 'bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min', 'js');
include_file('3rdparty', 'bootstrap-treeview/bootstrap-treeview.min', 'js');
include_file('3rdparty', 'leaflet/leaflet', 'js');
include_file('3rdparty', 'leaflet/leaflet.awesome-markers.min', 'js');
include_file('3rdparty', 'leaflet/Leaflet.ImageOverlay.Rotated', 'js');
include_file('3rdparty', 'leaflet/Leaflet.tilelayer.fallback', 'js');
include_file('3rdparty', 'leaflet/Leaflet.singleclick', 'js');
include_file('3rdparty', 'leaflet/leaflet.easy-button', 'js');
include_file('3rdparty', 'leaflet/leaflet.contextmenu.min', 'js');
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
include_file('3rdparty', 'bootstrap-tokenfield/bootstrap-tokenfield.min', 'css');
include_file('3rdparty', 'bootstrap-tokenfield/tokenfield-typeahead.min', 'css');
include_file('3rdparty', 'bootstrap-wysihtml5/bootstrap3-wysihtml5.min', 'css');
include_file('3rdparty', 'bootstrap-treeview/bootstrap-treeview.min', 'css');
include_file('3rdparty', 'leaflet/leaflet', 'css');
include_file('3rdparty', 'leaflet/leaflet.awesome-markers', 'css');
include_file('3rdparty', 'leaflet/leaflet.easy-button', 'css');
include_file('3rdparty', 'leaflet/leaflet.contextmenu.min', 'css');

include_file('desktop', 'commun', 'css');

?>
</head>
<body>
	<?php
	if (!isConnect()) {
		include_file('desktop', 'connection', 'php');
	} else {
	?>
		<div class="navbar navbar-default navbar-fixed-top" role="navigation">
	      <div class="container-fluid">
	        <div class="navbar-header">
	          <div class="navbar-icon-container">
	          	<a href="#" class="navbar-icon pull-right visible-xs" id="nav-btn"><i class="fa fa-bars fa-lg white"></i></a>
	          	<a href="#" class="navbar-icon pull-right visible-xs navBarBtn" data-link="eventinfos"><i class="glyphicon glyphicon-info-sign"></i></a>
	          	<a href="#" class="navbar-icon pull-right visible-xs navBarBtn" data-link="mission"><i class="glyphicon glyphicon-list-alt"></i></a>
	          	<a href="#" class="navbar-icon pull-right visible-xs navBarBtn" data-link="maincourante"><i class="glyphicon glyphicon-pencil"></i></a>
	          	<a href="#" class="navbar-icon pull-right visible-xs navBarBtn" data-link="planning"><i class="glyphicon glyphicon-calendar"></i></a>
	          	<a href="#" class="navbar-icon pull-right visible-xs navBarBtn" data-link="map"><i class="fa fa-globe white"></i></a>
	          	<a href="#" class="navbar-icon pull-right visible-xs navBarBtn" data-link="dashboard"><i class="glyphicon glyphicon-th"></i></a>
	          </div>
	          <a class="navbar-brand" href="<?php echo $homeLink; ?>"><span><img alt="Brand" src="desktop/img/logo25.png"></span> <span class="hidden-xs">eventPlanner</span></a>

	        </div>

	        <div class="navbar-collapse collapse">

	          <form class="navbar-form navbar-right" role="search">
	            <div class="form-group has-feedback typeahead__container typeahead__field typeahead__query">
	                <input id="searchbox" type="search" placeholder="Rechercher" class="form-control" name="q" autocomplete="off">
	                <span id="searchicon" class="fa fa-search form-control-feedback"></span>
	            </div>
	          </form>

	          <div class="btn-group navbar-btn navbar-right mapModeMenu" style="display: none;">
				  <button type="button" class="btn btn-default mapModeMenuLabel">Mode: Démontage</button>
				  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				    <span class="caret"></span>
				    <span class="sr-only">Toggle Dropdown</span>
				  </button>
				  <ul class="dropdown-menu">
				    <li><a href="#" class="mapModeMenuBtn" data-mapmode="global">Mode: Global</a></li>
				    <li><a href="#" class="mapModeMenuBtn" data-mapmode="montage">Mode: Montage</a></li>
				    <li><a href="#" class="mapModeMenuBtn" data-mapmode="demontage">Mode: Démontage</a></li>
				  </ul>
				</div>

	          <ul class="nav navbar-nav">
	            <li class="dropdown epNavBtn">
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
            	<li class="epNavBtn"><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="map"><i class="fa fa-globe white"></i><span class="epNavTitle" style="display: none;">&nbsp;&nbsp;Carte</span></a></li>
	            <li class="epNavBtn"><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="planning"><i class="glyphicon glyphicon-calendar"></i><span class="epNavTitle" style="display: none;">&nbsp;&nbsp;Planning</span></a></li>
                <li class="epNavBtn"><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="maincourante"><i class="glyphicon glyphicon-pencil"></i><span class="epNavTitle" style="display: none;">&nbsp;&nbsp;Main courante</span></a></li>
                <li class="epNavBtn"><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="mission"><i class="glyphicon glyphicon-list-alt"></i><span class="epNavTitle" style="display: none;">&nbsp;&nbsp;Missions</span></a></li>
	            <li class="dropdown epNavBtn">
	            <?php

// A reprendre pour un paramétrage à l'initialisation de l'UI

	            	$currentEventId = $_SESSION['user']->getEventId();
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
							<button type="button" class="btn btn-primary modalValidBtn">Valider</button>
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