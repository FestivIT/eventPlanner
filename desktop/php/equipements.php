<div id="equipements">
	<nav class="navbar navbar-default epContextualNavBar">
		<div class="container-fluid">
			<div class="navbar-header">
		    	<a class="navbar-brand" href="#">Equipements</a>
		    	<div class="pull-right visible-xs">
		    		<button type="button" class="btn navbar-btn btn-success editEqBtn btn-sm" data-eq-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
		    	</div>
		    </div>
			
			<div class="nav navbar-nav navbar-right hidden-xs">
	    		<button type="button" class="btn navbar-btn btn-success editEqBtn btn-sm" data-eq-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
	    	</div>
		</div>
	</nav>
			
	<table class="table table-striped table-hover table-condensed eqLogicTable" id="eqLogicTable">
		<thead>
			<tr>
				<th>Type</th>
				<th>Matériel</th>
				<th>Zone</th>
				<th class="text-right">Actions</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
	<script type="text/html" id="templateEqTable">
		<tr class="eqLogicItem" data-template-bind='[{"attribute": "data-id", "value": "eqLogicId"}]' >
			<th class="col-xs-3" scope="row" data-content="matTypeName"></th>
			<td class="col-xs-4" data-content="eqRealName"></td>
			<td class="col-xs-4" data-content="zoneName"></td>
			<td class="col-xs-1" style="text-align: right;">
				<button type="button" class="btn btn-primary btn-xs dupEqBtn" data-template-bind='[{"attribute": "data-eq-id", "value": "eqLogicId"}]' title="Dupliquer"><span class="glyphicon glyphicon-duplicate"></span></button> 
				<button type="button" class="btn btn-warning btn-xs editEqBtn" data-template-bind='[{"attribute": "data-eq-id", "value": "eqLogicId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button>
				<button type="button" class="btn btn-danger btn-xs deleteEqBtn" data-template-bind='[{"attribute": "data-eq-id", "value": "eqLogicId"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
			</td>
		</tr>
	</script>
</div>