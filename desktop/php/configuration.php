<div class="row" id="configuration">
	<div class="col-sm-12">
		<div class="panel panel-primary">
		  	<div class="panel-heading">
		  		Evénements
		  		<button type="button" class="btn btn-success btn-xs pull-right editEventBtn" data-event-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
		  	</div>
			
			<table class="table table-striped table-hover table-condensed eventTable" id="eventTable">
				<thead>
					<tr>
						<th>Nom</th>
						<th>Ville</th>
						<th>Date</th>
						<th class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
			<script type="text/html" id="templateEventTable">
				<tr>
					<th class="col-xs-4" scope="row" data-content="eventName"></th>
					<td class="col-xs-2" data-content="eventVille"></td>
					<td class="col-xs-2" data-content="eventStartDate" data-format="formatDateYmd2Dmy"></td>
					<td class="col-xs-4" style="text-align: right;">
						<button type="button" class="btn btn-success btn-xs selectEventBtn" data-template-bind='[{"attribute": "data-event-id", "value": "eventId"}]' title="Selectionner"><span class="glyphicon glyphicon-ok"></span></button> 
						<button type="button" class="btn btn-primary btn-xs dupEventBtn" data-template-bind='[{"attribute": "data-event-id", "value": "eventId"}]' title="Dupliquer"><span class="glyphicon glyphicon-duplicate"></span></button> 
						<button type="button" class="btn btn-warning btn-xs editEventBtn" data-template-bind='[{"attribute": "data-event-id", "value": "eventId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button>
					</td>
				</tr>
			</script>
		</div>
	</div>
	
	<div class="col-sm-6">
		<div class="panel panel-primary">
		  	<div class="panel-heading">
		  		Types de matériel
		  		<button type="button" class="btn btn-success btn-xs pull-right editMatTypeBtn" data-matType-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
		  	</div>
			
			<table class="table table-striped table-hover table-condensed matTypeTable" id="matTypeTable">
				<thead>
					<tr>
						<th>Nom</th>
						<th class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
			<script type="text/html" id="templateMatTypeTable">
				<tr>
					<th class="col-xs-8" scope="row" data-content="matTypeName"></th>
					<td class="col-xs-4" style="text-align: right;">
						<button type="button" class="btn btn-primary btn-xs dupMatTypeBtn" data-template-bind='[{"attribute": "data-matType-id", "value": "matTypeId"}]' title="Dupliquer"><span class="glyphicon glyphicon-duplicate"></span></button> 
						<button type="button" class="btn btn-warning btn-xs editMatTypeBtn" data-template-bind='[{"attribute": "data-matType-id", "value": "matTypeId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button>
					</td>
				</tr>
			</script>
		</div>
	</div>
	
	<div class="col-sm-6">
		<div class="panel panel-primary">
		  	<div class="panel-heading">
		  		Utilisateurs
		  		<button type="button" class="btn btn-success btn-xs pull-right editUserBtn" data-user-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
		  	</div>
			
			<table class="table table-striped table-hover table-condensed userTable" id="userTable">
				<thead>
					<tr>
						<th>Nom</th>
						<th class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
			<script type="text/html" id="templateUserTable">
				<tr>
					<th class="col-xs-8" scope="row" data-content="userName"></th>
					<td class="col-xs-4" style="text-align: right;">
						<button type="button" class="btn btn-warning btn-xs editUserBtn" data-template-bind='[{"attribute": "data-user-id", "value": "userId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button>
					</td>
				</tr>
			</script>
		</div>
	</div>
</div>

<?php
	//include_file('desktop', 'configuration', 'js');
?>