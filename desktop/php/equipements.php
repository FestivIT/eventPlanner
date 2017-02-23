<div class="row" id='equipements'>
	<div class="col-sm-12">
		<div class="panel panel-primary">
		  	<div class="panel-heading">
		  		Equipements
		  		<button type="button" class="btn btn-success btn-xs pull-right editEqBtn" data-eq-id="new">Ajouter</button>
		  	</div>
			
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
	</div>
</div>

<?php
	//include_file('desktop', 'equipement', 'js');
?>