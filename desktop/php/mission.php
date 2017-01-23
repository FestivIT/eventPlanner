<div class="row" id="mission">
	<div class="col-sm-12">
		<div class="panel panel-primary">
		  	<div class="panel-heading">
		  		Missions
		  		<button type="button" class="btn btn-success btn-xs pull-right editMissionBtn" data-mission-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
		  	</div>
			
			<table class="table table-striped table-hover table-condensed missionTable" id="missionTable">
				<thead>
					<tr>
						<th>Nom</th>
						<th>Attribué à</th>
						<th>Zone(s)</th>
						<th>Créée le</th>
						<th>Etat</th>
						<th class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
			<script type="text/html" id="templateMissionTable">
				<tr>
					<th scope="row" data-content="missionName"></th>
					<td data-template-bind='[{"attribute": "content", "value": "missionUsers", "formatter": "formatListWithUserName", "formatOptions": "<span class=\"label label-info\"></span>"}]'></td>
					<td data-template-bind='[{"attribute": "content", "value": "missionZones", "formatter": "formatListWithZoneName", "formatOptions": "<span class=\"label label-default\"></span>"}]'></td>
					<td data-content="missionDate" data-format="formatDateMsg"></td>
					<td><button type="button" style="font-weight: bold;" data-template-bind='[{"attribute": "class", "value": "missionState", "formatter": "formatStateColorClass", "formatOptions": "editStateBtn btn btn-xs btn"},{"attribute": "content", "value": "missionState", "formatter": "formatState"}, {"attribute": "data-mission-id", "value": "missionId"}, {"attribute": "data-mission-state", "value": "missionState"}]'></span></td>
					<td class="col-xs-4" style="text-align: right;">
						<button type="button" class="btn btn-warning btn-xs editMissionBtn" data-template-bind='[{"attribute": "data-mission-id", "value": "missionId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button> 
						<button type="button" class="btn btn-danger btn-xs deleteMissionBtn" data-template-bind='[{"attribute": "data-mission-id", "value": "missionId"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
					</td>
				</tr>
			</script>
		</div>
	</div>
</div>