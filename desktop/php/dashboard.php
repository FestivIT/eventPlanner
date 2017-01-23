<div class="row" id="dashboard">
	<div class="col-sm-6">
		<div class="panel panel-primary">
		  <div class="panel-heading">
		    <h3 class="panel-title">Mes missions en cours:</h3>
		  </div>
		  <ul class="list-group missionTable" id="missionList"></ul>
		</div>
	</div>
	<script type="text/html" id="templateMissionList">
		<a href="#" class="list-group-item selectMissionBtn" data-template-bind='[{"attribute": "data-mission-id", "value": "missionId"}]'>
			<span class="glyphicon glyphicon-chevron-right pull-right"></span>
			<p data-content-append="missionName"><span data-template-bind='[{"attribute": "class", "value": "missionState", "formatter": "formatStateColorClass", "formatOptions": "pull-right label label"},{"attribute": "content", "value": "missionState", "formatter": "formatState"}]'></span></p>
			<small><span data-content="missionDate" data-format="formatDateMsg"></span></small>
			<p data-template-bind='[{"attribute": "content", "value": "missionZones", "formatter": "formatListWithZoneName", "formatOptions": "<span class=\"label label-default\"></span>"}]'></p>
		</a>
	</script>

	<div class="col-sm-6">
		<div class="panel panel-primary">
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