<div id="mission">
	<nav class="navbar navbar-default epContextualNavBar">
		<div class="container-fluid">
			<div class="navbar-header">
		    	<a class="navbar-brand">Missions</a>
		    	<div class="pull-right visible-xs">
		    		<button type="button" class="btn navbar-btn btn-success editMissionBtn btn-sm" data-mission-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
		    	</div>
		    </div>
			
			<div class="nav navbar-nav navbar-right hidden-xs">
	    		<button type="button" class="btn navbar-btn btn-success editMissionBtn btn-sm" data-mission-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
	    	</div>
		</div>
	</nav>

	<div class="screenContainer"> 	
		<ul class="list-group missionTable" id="missionTable">
		</ul>
	</div>
	
	<script type="text/html" id="templateMissionTable">
		<li class="list-group-item missionItem" data-template-bind='[{"attribute": "data-id", "value": "missionId"}]'>
  			<div class="row">
	  			<div class="col-xs-12 col-sm-6">
	  				<div class="pull-right hidden-sm hidden-md hidden-lg">
		  				<button type="button" style="font-weight: bold;" data-template-bind='[{"attribute": "class", "value": "missionState", "formatter": "formatStateColorClass", "formatOptions": "btn btn-xs editStateBtn btn"},{"attribute": "content", "value": "missionState", "formatter": "formatState"}, {"attribute": "data-mission-id", "value": "missionId"}, {"attribute": "data-mission-state", "value": "missionState"}]'></button>
						<button type="button" class="btn btn-warning btn-xs editMissionBtn" data-template-bind='[{"attribute": "data-mission-id", "value": "missionId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button> 
						<button type="button" class="btn btn-danger btn-xs deleteMissionBtn" data-template-bind='[{"attribute": "data-mission-id", "value": "missionId"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
					</div>
					
	  				
					<strong><span data-content="missionName"></span></strong><br>
					<small><span data-content="missionDate" data-format="formatDateMsg"></span></small><br>
					<small><span data-content="missionComment"></span></small>

					
				</div>
				<div class="col-sm-2 hidden-xs" data-template-bind='[{"attribute": "content", "value": "missionId", "formatter": "formatMissionZones", "formatOptions": "templateMissionZoneName"}]'></div>
				<div class="col-sm-2 hidden-xs" data-template-bind='[{"attribute": "content", "value": "missionId", "formatter": "formatMissionUsers", "formatOptions": "templateMissionUserName"}]'></div>
				<div class="col-sm-1 hidden-xs"><button type="button" style="font-weight: bold;" data-template-bind='[{"attribute": "class", "value": "missionState", "formatter": "formatStateColorClass", "formatOptions": "editStateBtn btn btn-xs btn"},{"attribute": "content", "value": "missionState", "formatter": "formatState"}, {"attribute": "data-mission-id", "value": "missionId"}, {"attribute": "data-mission-state", "value": "missionState"}]'></button></div>
				<div class="col-sm-1 hidden-xs" style="text-align: right;">
					<button type="button" class="btn btn-warning btn-xs editMissionBtn" data-template-bind='[{"attribute": "data-mission-id", "value": "missionId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button> 
					<button type="button" class="btn btn-danger btn-xs deleteMissionBtn" data-template-bind='[{"attribute": "data-mission-id", "value": "missionId"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
				</div>
			</div>
			<div class="row hidden-sm hidden-md hidden-lg">
				<div class="col-xs-6" data-template-bind='[{"attribute": "content", "value": "missionId", "formatter": "formatMissionZones", "formatOptions": "templateMissionZoneName"}]'></div>
				<div class="col-xs-6" style="text-align: right;" data-template-bind='[{"attribute": "content", "value": "missionId", "formatter": "formatMissionUsers", "formatOptions": "templateMissionUserName"}]'></div>
  			</div>
		</li>
	</script>

	<script type="text/html" id="templateMissionUserName">
		<span class="label label-info" data-content="userName"></span><span> </span>
	</script>
	<script type="text/html" id="templateMissionZoneName">
		<span class="label label-default" data-content="zoneName"></span><span> </span>
	</script>
</div>