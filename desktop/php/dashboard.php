<div id="dashboard">
	<nav class="navbar navbar-default epContextualNavBar">
		<div class="container-fluid">
			<div class="navbar-header">
				<a class="navbar-brand">Dashboard</a>
		    </div>
		</div>
	</nav>

	<div class="screenContainer">
		<div class="col-sm-6">
			<div class="panel panel-default">
			  <div class="panel-heading">
			    <h3 class="panel-title">Mes missions en cours:</h3>
			  </div>
				<ul class="list-group missionTable" id="missionList">
				</ul>
				<script type="text/html" id="templateMissionList">
					<a href="#" class="list-group-item selectMissionBtn missionItem" data-template-bind='[{"attribute": "data-mission-id", "value": "missionId"}]'>
				  		<div class="row">
				  			<div class="col-xs-12">
				  				<div class="pull-right">
					  				<span style="font-weight: bold;" data-template-bind='[{"attribute": "class", "value": "missionState", "formatter": "formatStateColorClass", "formatOptions": "label editMissionBtn label"},{"attribute": "content", "value": "missionState", "formatter": "formatState"}, {"attribute": "data-mission-id", "value": "missionId"}, {"attribute": "data-mission-state", "value": "missionState"}]'></span>
								</div>
								
				  				<small><span data-content="missionDate" data-format="formatDateMsg"></span></small><br>
								<strong><span data-content="missionName"></span></strong><br>
								<small><span data-content="missionComment"></span></small>
								<span class="glyphicon glyphicon-chevron-right pull-right"></span>
							</div>
						</div>
						<div class="row">
							<div class="col-xs-6" data-template-bind='[{"attribute": "content", "value": "missionId", "formatter": "formatMissionZones", "formatOptions": "templateMissionZoneName"}]'></div>
							<div class="col-xs-6" data-template-bind='[{"attribute": "content", "value": "missionId", "formatter": "formatMissionUsers", "formatOptions": "templateMissionUserName"}]'></div>
				  		</div>
					</a>
				</script>
				
				<script type="text/html" id="templateMissionUserName">
					<span class="label label-info" data-content="userName"></span><span> </span>
				</script>
				<script type="text/html" id="templateMissionZoneName">
					<span class="label label-default" data-content="zoneName"></span><span> </span>
				</script>
			</div>
		</div>

		<div class="col-sm-6">
			<div class="panel panel-default">
			  <div class="panel-heading">
			    <h3 class="panel-title">Evenements du moment:</h3>
			  </div>
			  <ul class="list-group eventTable" id="eventList"></ul>
			</div>
		</div>
		<script type="text/html" id="templateEventList">
			<a href="#" class="list-group-item selectEventBtn" data-template-bind='[{"attribute": "data-event-id", "value": "id"}]' data-content-append="name"><span class="glyphicon glyphicon-chevron-right pull-right"></span></a>
		</script>
	</div>
</div>