<div id="plans">
	<nav class="navbar navbar-default epContextualNavBar">
		<div class="container-fluid">
			<div class="navbar-header">
		    	<a class="navbar-brand">Plans</a>
		    	<div class="pull-right visible-xs">
		    		<button type="button" class="btn navbar-btn btn-success editPlanBtn btn-sm" data-plan-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
		    	</div>
		    </div>
			
			<div class="nav navbar-nav navbar-right hidden-xs">
	    		<button type="button" class="btn navbar-btn btn-success editPlanBtn btn-sm" data-plan-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
	    	</div>
		</div>
	</nav>

	<div class="screenContainer">
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
	</div>
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


