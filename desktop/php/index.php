<?php
include_file('core', 'authentification', 'php');

global $EVENTPLANNER_INTERNAL_CONFIG;

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
include_file('3rdparty', 'jquery.toastr/jquery.toastr.min', 'js');
include_file('3rdparty', 'jquery.at.caret/jquery.at.caret.min', 'js');
include_file('3rdparty', 'bootstrap.slider/js/bootstrap-slider', 'js');
include_file('3rdparty', 'jwerty/jwerty', 'js');
include_file('3rdparty', 'jquery.loadTemplate/jquery.loadTemplate.min', 'js');
include_file('3rdparty', 'jquery.tree/jstree.min', 'js');
include_file('3rdparty', 'jquery.fileupload/jquery.ui.widget', 'js');
include_file('3rdparty', 'jquery.fileupload/jquery.iframe-transport', 'js');
include_file('3rdparty', 'jquery.fileupload/jquery.fileupload', 'js');
include_file('3rdparty', 'jquery.fileupload/load-image.all.min', 'js');
include_file('3rdparty', 'jquery.fileupload/canvas-to-blob.min', 'js');
include_file('3rdparty', 'jquery.fileupload/jquery.fileupload-process', 'js');
include_file('3rdparty', 'jquery.fileupload/jquery.fileupload-image', 'js');
include_file('3rdparty', 'jquery.tablesorter/jquery.tablesorter.min', 'js');
include_file('3rdparty', 'jquery.tablesorter/jquery.tablesorter.widgets.min', 'js');
include_file('3rdparty', 'jquery.tablesorter/jquery.tablesorter.pager', 'js');
include_file('3rdparty', 'jquery.tablesorter/widgets/widget-columnSelector.min', 'js');
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
include_file('3rdparty', 'leaflet/leaflet.locate.min', 'js');
include_file('3rdparty', 'snap.svg/snap.svg-min', 'js');
include_file('3rdparty', 'editable-table/editabletable', 'js');

include_file('core', 'core', 'js');
include_file('core', 'js.inc', 'php');

include_file('desktop', 'commun', 'js');
include_file('desktop', 'eventplanner.ui.class', 'js');


include_file('3rdparty', 'font-awesome/css/font-awesome.min', 'css');
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
include_file('3rdparty', 'leaflet/leaflet.locate.min', 'css');
include_file('3rdparty', 'bootstrap/css/bootstrap.min', 'css');
include_file('3rdparty', 'roboto/roboto', 'css');

include_file('desktop', 'commun', 'css');

?>
</head>
<body>
	<?php
	if (!isConnect()) {
		include_file('desktop', 'connection', 'php');
	} else {
	?>
		<div id="epNavBar" class="navbar navbar-default navbar-fixed-top" role="navigation">
	      <div class="container-fluid">
	        <div class="navbar-header">
	          <div class="navbar-icon-container">
	          	<a href="#" class="navbar-icon pull-right visible-xs" id="nav-btn"><i class="fa fa-bars fa-lg"></i></a>
	          	<a href="#" class="navbar-icon pull-right visible-xs navBarBtn" data-link="eventinfos"><i class="glyphicon glyphicon-info-sign"></i></a>
	          	<a href="#" class="navbar-icon pull-right visible-xs navBarBtn" data-link="contact"><i class="fa fa-address-book-o"></i></a>
	          	<a href="#" class="navbar-icon pull-right visible-xs navBarBtn" data-link="mission"><i class="fa fa-tasks"></i></a>
	          	<a href="#" class="navbar-icon pull-right visible-xs navBarBtn" data-link="maincourante"><i class="glyphicon glyphicon-pencil"></i></a>
	          	<a href="#" class="navbar-icon pull-right visible-xs navBarBtn" data-link="planning"><i class="glyphicon glyphicon-calendar"></i></a>
	          	<a href="#" class="navbar-icon pull-right visible-xs navBarBtn" data-link="map"><i class="fa fa-map-o"></i></a>
	          	<a href="#" class="navbar-icon pull-right visible-xs navBarBtn" data-link="dashboard"><i class="glyphicon glyphicon-th"></i></a>
	          </div>
	          <a class="navbar-brand" href="index.php"><span><img alt="eventPlanner" src="desktop/img/logo25.png"></span> <span class="hidden-xs">eventPlanner</span></a>
	        </div>

	        <div class="navbar-collapse collapse">

	          <form class="navbar-form navbar-right" role="search">
	            <div class="form-group has-feedback typeahead__container typeahead__field typeahead__query">
	                <input id="searchbox" type="search" placeholder="Rechercher" class="form-control" name="q" autocomplete="off">
	                <span id="searchicon" class="fa fa-search form-control-feedback"></span>
	            </div>

	            
	          </form>

          		<ul class="nav navbar-nav navbar-right">
	          		<li class="dropdown epNavBtn">
		                <a class="dropdown-toggle" id="accountDrop" href="#" role="button" data-toggle="dropdown"><i class="glyphicon glyphicon-folder-open"></i>&nbsp;&nbsp;<span id="epUserMenu"></span> <b class="caret"></b></a>
		                <ul class="dropdown-menu">
		                  	<li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="userinfos"><i class="glyphicon glyphicon-briefcase"></i>&nbsp;&nbsp;Mes infos</a></li>
		                	<li class="divider hidden-xs"></li>
		                	<li><a href="index.php?logout=1" data-toggle="collapse" data-target=".navbar-collapse.in"><i class="glyphicon glyphicon-off"></i>&nbsp;&nbsp;Se déconnecter</a></li>
		                </ul>
		            </li>
		        </ul>

		        

	          <ul class="nav navbar-nav">
	            <li class="dropdown epNavBtn">
	              <a id="generalDrop" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-book"></i>&nbsp;&nbsp; <span id="epOrganisationMenu"></span><b class="caret"></b></a>
	              <ul class="dropdown-menu">
	                <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="inventaire"><i class="glyphicon glyphicon-th-list"></i>&nbsp;&nbsp;Inventaire Matériel</a></li>
	                <!--
	                	<li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="utilitaires"><i class="glyphicon glyphicon-wrench"></i>&nbsp;&nbsp;Utilitaires</a></li>
	            	-->
	                <li class="divider hidden-xs"></li>
					<li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="disciplines"><i class="fa fa-graduation-cap"></i>&nbsp;&nbsp;Disciplines</a></li>
					<li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="users"><i class="fa fa-users"></i>&nbsp;&nbsp;Utilisateurs</a></li>
					<li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="events"><i class="glyphicon glyphicon-cd"></i>&nbsp;&nbsp;Evenements</a></li>
					<li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="plans"><i class="fa fa-map-o"></i>&nbsp;&nbsp;Plans</a></li>
					<li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="mattype"><i class="fa fa-object-ungroup"></i>&nbsp;&nbsp;Types de matériels</a></li>
	            	<li class="divider hidden-xs"></li>
	                <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="configuration"><i class="fa fa-cogs"></i>&nbsp;&nbsp;Configuration de l'organisation</a></li>
	              </ul>
	            </li>
            	<li class="dropdown epNavBtn">
	              <a style="display: none;" id="eventDrop" href="#" role="button" class="dropdown-toggle" data-toggle="dropdown"><i class="glyphicon glyphicon-cd"></i>&nbsp;&nbsp;Evenement <b class="caret"></b></a>
	              <ul class="dropdown-menu">
	                <!-- NETTOYAGE POUR LA PROD VC
	                <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="equipements"><i class="glyphicon glyphicon-hdd"></i>&nbsp;&nbsp;Equipements</a></li>
	                -->
	                <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="zones"><i class="glyphicon glyphicon-map-marker"></i>&nbsp;&nbsp;Zones</a></li>
	              	<!-- NETTOYAGE POUR LA PROD VC
	              	<li class="divider hidden-xs"></li>
	                <li><a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" class="navBarBtn" data-link="configevent"><i class="fa fa-cogs"></i>&nbsp;&nbsp;Configuration de l'événement</a></li>
	            	-->
	              </ul>
	            </li>
	          </ul>

	          <div class="nav navbar-nav mapModeMenu btn-group hidden-xs" style="display: none;">
				  <button type="button" class="btn navbar-btn btn-default mapModeMenuLabel">Mode: Démontage</button>
				  <button type="button" class="btn navbar-btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				    <span class="caret"></span>
				    <span class="sr-only">Toggle Dropdown</span>
				  </button>
				  <ul class="dropdown-menu">
				    <li><a href="#" class="mapModeMenuBtn" data-mapmode="global">Mode: Global</a></li>
				    <li><a href="#" class="mapModeMenuBtn" data-mapmode="montage">Mode: Montage</a></li>
				    <li><a href="#" class="mapModeMenuBtn" data-mapmode="demontage">Mode: Démontage</a></li>
				  </ul>
				</div>
	        </div><!--/.navbar-collapse -->
	      </div>
	    </div>
	    
	    <div id="sidebar-wrapper">
            <ul class="sidebar-nav">
            	<li class="epNavBtn"><a href="#" class="navBarBtn" data-link="dashboard" title="Dashboard"><i class="glyphicon glyphicon-th"></i><span class="epNavTitle" style="display: none;">&nbsp;&nbsp;Dashboard</a></span></li>
                <li class="epNavBtn"><a href="#" class="navBarBtn" data-link="map" title="Carte"><i class="fa fa-map-o"></i><span class="epNavTitle" style="display: none;">&nbsp;&nbsp;Carte</span></a></li>
	            <li class="epNavBtn"><a href="#" class="navBarBtn" data-link="planning" title="Planning"><i class="glyphicon glyphicon-calendar"></i><span class="epNavTitle" style="display: none;">&nbsp;&nbsp;Planning</span></a></li>
                <li class="epNavBtn"><a href="#" class="navBarBtn" data-link="maincourante" title="Main courante"><i class="glyphicon glyphicon-pencil"></i><span class="epNavTitle" style="display: none;">&nbsp;&nbsp;Main courante</span></a></li>
                <li class="epNavBtn"><a href="#" class="navBarBtn" data-link="mission" title="Missions"><i class="fa fa-tasks"></i><span class="epNavTitle" style="display: none;">&nbsp;&nbsp;Missions</span></a></li>
                <li class="epNavBtn"><a href="#" class="navBarBtn" data-link="contact" title="Contacts"><i class="fa fa-address-book-o"></i><span class="epNavTitle" style="display: none;">&nbsp;&nbsp;Contacts</span></a></li>
            	<li class="epNavBtn"><a href="#" class="navBarBtn" data-link="eventinfos" title="Infos Evenement"><i class="glyphicon glyphicon-info-sign"></i><span class="epNavTitle" style="display: none;">&nbsp;&nbsp;Infos Evenement</span></a></li>
            </ul>
        </div>
        
	    <div id="pageContainer"></div>
	    
	    <div id="loadingContainer">
	    	<img src="desktop/img/loading.gif"/>
	    </div>
	    
		<div id="modalContainer"></div>
		<script type="text/html" id="templateModal">
			<div class="modal" data-template-bind='[{"attribute": "id", "value": "modalId"}]' role="dialog">
				<div class="modal-dialog modal-lg">
					<div class="modal-content">
						<div class="modal-header">
							<button class="close" type="button" data-dismiss="modal" aria-hidden="true">&times;</button>
							<h4 class="modal-title text-primary" data-content="title"></h4>
						</div>
						<div class="modal-body" data-content="modalContent"></div>
						<div class="modal-footer">
							<button type="button" class="btn btn-success modalValidBtn"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Valider</button>
							<button type="button" class="btn btn-danger modalDeleteBtn" style="display:none"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Supprimer</button>
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
