<div class="row" id="zones">
	<div class="col-sm-12">
		<div class="panel panel-primary">
		  	<div class="panel-heading">
		  		Zones
		  		<button type="button" class="btn btn-success btn-xs pull-right editZoneBtn" data-zone-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
		  	</div>
			
			<table class="table table-striped table-hover table-condensed zoneTable" id="zoneTable">
				<thead>
					<tr>
						<th>Nom</th>
						<th>Instal.</th>
						<th>Désinstal.</th>
						<th class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
			<script type="text/html" id="templateZoneTable">
				<tr>
					<th class="col-xs-4" scope="row" data-content="name"></th>
					<td class="col-xs-2" data-content="installDate" data-format="formatDateYmd2Dmy"></td>
					<td class="col-xs-2" data-content="uninstallDate" data-format="formatDateYmd2Dmy"></td>
					<td class="col-xs-4" style="text-align: right;">
						<button type="button" class="btn btn-warning btn-xs editZoneBtn" data-template-bind='[{"attribute": "data-zone-id", "value": "id"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button> 
						<button type="button" class="btn btn-danger btn-xs deleteZoneBtn" data-template-bind='[{"attribute": "data-zone-id", "value": "id"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
					</td>
				</tr>
			</script>
		</div>
	</div>
</div>