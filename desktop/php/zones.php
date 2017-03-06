<div id="zones">
	<nav class="navbar navbar-default epContextualNavBar">
		<div class="container-fluid">
			<div class="navbar-header">
		    	<a class="navbar-brand">Zones</a>
		    	<div class="pull-right visible-xs">
		    		<button type="button" class="btn navbar-btn btn-success editZoneBtn btn-sm" data-zone-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
		    	</div>
		    </div>
			
			<div class="nav navbar-nav navbar-right hidden-xs">
	    		<button type="button" class="btn navbar-btn btn-success editZoneBtn btn-sm" data-zone-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
	    	</div>
		</div>
	</nav>
			
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
		<tr class="zoneItem" data-template-bind='[{"attribute": "data-id", "value": "zoneId"}]' >
			<th class="col-xs-7" scope="row" data-content="zoneName"></th>
			<td class="col-xs-2" data-content="zoneInstallDate" data-format="formatDateYmd2Dmy"></td>
			<td class="col-xs-2" data-content="zoneUninstallDate" data-format="formatDateYmd2Dmy"></td>
			<td class="col-xs-1" style="text-align: right;">
				<button type="button" class="btn btn-warning btn-xs editZoneBtn" data-template-bind='[{"attribute": "data-zone-id", "value": "zoneId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button> 
				<button type="button" class="btn btn-danger btn-xs deleteZoneBtn" data-template-bind='[{"attribute": "data-zone-id", "value": "zoneId"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
			</td>
		</tr>
	</script>
</div>