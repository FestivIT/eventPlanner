<div id="events">
	<nav class="navbar navbar-default epContextualNavBar">
		<div class="container-fluid">
		    <div class="navbar-header">
		    	<a class="navbar-brand">Evenements</a>
		    	<div class="pull-right visible-xs">
		    		<button type="button" class="btn navbar-btn btn-success editEventBtn btn-sm" data-event-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
		    	</div>
		    </div>
			
			<div class="nav navbar-nav navbar-right hidden-xs">
	    		<button type="button" class="btn navbar-btn btn-success editEventBtn btn-sm" data-event-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
	    	</div>
		</div>
	</nav>

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


