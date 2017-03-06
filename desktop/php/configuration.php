<div id="configuration">
	<nav class="navbar navbar-default epContextualNavBar">
		<div class="container-fluid">
			<div class="navbar-header">
		    	<a class="navbar-brand" href="#">Configuration</a>
		    </div>
		</div>
	</nav>

	<div>
		<div class="col-sm-12">
			<div class="panel panel-default">
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
					<tr class="eventItem" data-template-bind='[{"attribute": "data-id", "value": "eventId"}]'>
						<th class="col-xs-4" scope="row" data-content="eventName"></th>
						<td class="col-xs-4" data-content="eventVille"></td>
						<td class="col-xs-2" data-content="eventStartDate" data-format="formatDateYmd2Dmy"></td>
						<td class="col-xs-2" style="text-align: right;">
							<button type="button" class="btn btn-success btn-xs selectEventBtn" data-template-bind='[{"attribute": "data-event-id", "value": "eventId"}]' title="Selectionner"><span class="glyphicon glyphicon-ok"></span></button> 
							<button type="button" class="btn btn-primary btn-xs dupEventBtn" data-template-bind='[{"attribute": "data-event-id", "value": "eventId"}]' title="Dupliquer"><span class="glyphicon glyphicon-duplicate"></span></button> 
							<button type="button" class="btn btn-warning btn-xs editEventBtn" data-template-bind='[{"attribute": "data-event-id", "value": "eventId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button>
							<button type="button" class="btn btn-danger btn-xs deleteEventBtn" data-template-bind='[{"attribute": "data-event-id", "value": "eventId"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
						</td>
					</tr>
				</script>
			</div>
		</div>
		
		
		<div class="col-sm-6">
			<div class="panel panel-default">
			  	<div class="panel-heading">
			  		Types de matériel
			  		<button type="button" class="btn btn-success btn-xs pull-right editMatTypeBtn" data-matType-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
			  	</div>
			  	<div class="matTypeTable" id="matTypeTable"></div>
			</div>
		</div>
		
		<div class="col-sm-6">
			<div class="panel panel-default">
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
					<tr class="userItem" data-template-bind='[{"attribute": "data-id", "value": "userId"}]'>
						<th class="col-xs-11" scope="row" data-content="userName"></th>
						<td class="col-xs-1" style="text-align: right;">
							<button type="button" class="btn btn-warning btn-xs editUserBtn" data-template-bind='[{"attribute": "data-user-id", "value": "userId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button>
							<button type="button" class="btn btn-danger btn-xs deleteUserBtn" data-template-bind='[{"attribute": "data-user-id", "value": "userId"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
						</td>
					</tr>
				</script>
			</div>
		</div>

		<div class="col-sm-6">
			<div class="panel panel-default">
			  	<div class="panel-heading">
			  		Disciplines
			  		<button type="button" class="btn btn-success btn-xs pull-right editDisciplineBtn" data-discipline-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
			  	</div>
				
				<table class="table table-striped table-hover table-condensed disciplineTable" id="disciplineTable">
					<thead>
						<tr>
							<th>Nom</th>
							<th class="text-right">Actions</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
				<script type="text/html" id="templateDisciplineTable">
					<tr class="disciplineItem" data-template-bind='[{"attribute": "data-id", "value": "disciplineId"}]'>
						<th class="col-xs-11" scope="row" data-content="disciplineName"></th>
						<td class="col-xs-1" style="text-align: right;">
							<button type="button" class="btn btn-warning btn-xs editDisciplineBtn" data-template-bind='[{"attribute": "data-discipline-id", "value": "disciplineId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button>
							<button type="button" class="btn btn-danger btn-xs deleteDisciplineBtn" data-template-bind='[{"attribute": "data-discipline-id", "value": "disciplineId"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
						</td>
					</tr>
				</script>
			</div>
		</div>



		<div class="col-sm-6">
			<div class="panel panel-default">
			  	<div class="panel-heading">
			  		Plans
			  		<button type="button" class="btn btn-success btn-xs pull-right editPlanBtn" data-plan-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
			  	</div>
				
				<table class="table table-striped table-hover table-condensed planTable" id="planTable">
					<thead>
						<tr>
							<th>Nom</th>
							<th class="text-right">Actions</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
				<script type="text/html" id="templatePlanTable">
					<tr class="planItem" data-template-bind='[{"attribute": "data-id", "value": "planId"}]'>
						<th class="col-xs-11" scope="row" data-content="planName"></th>
						<td class="col-xs-1" style="text-align: right;">
							<button type="button" class="btn btn-warning btn-xs editPlanBtn" data-template-bind='[{"attribute": "data-plan-id", "value": "planId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button>
							<button type="button" class="btn btn-danger btn-xs deletePlanBtn" data-template-bind='[{"attribute": "data-plan-id", "value": "planId"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
						</td>
					</tr>
				</script>
			</div>
		</div>
	</div>
</div>