<div id="discipline">
	<nav class="navbar navbar-default epContextualNavBar">
		<div class="container-fluid">
			<div class="navbar-header">
		    	<a class="navbar-brand">Disciplines</a>
		    	<div class="pull-right visible-xs">
		    		<button type="button" class="btn navbar-btn btn-success editDisciplineBtn btn-sm" data-discipline-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
		    	</div>
		    </div>
			
			<div class="nav navbar-nav navbar-right hidden-xs">
	    		<button type="button" class="btn navbar-btn btn-success editDisciplineBtn btn-sm" data-discipline-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
	    	</div>
		</div>
	</nav>

	<div class="screenContainer">
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
	</div>
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