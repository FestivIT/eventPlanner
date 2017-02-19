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
				<!--<tfoot>
					<tr>
					  <th colspan="9" class="ts-pager form-horizontal">
					    <button type="button" class="btn first"><i class="icon-step-backward glyphicon glyphicon-step-backward"></i></button>
					    <button type="button" class="btn prev"><i class="icon-arrow-left glyphicon glyphicon-backward"></i></button>
					    <span class="pagedisplay"></span>
					    <button type="button" class="btn next"><i class="icon-arrow-right glyphicon glyphicon-forward"></i></button>
					    <button type="button" class="btn last"><i class="icon-step-forward glyphicon glyphicon-step-forward"></i></button>
					    <select class="pagesize input-mini" title="Select page size">
					      <option selected="selected" value="10">10</option>
					      <option value="20">20</option>
					      <option value="40">40</option>
					      <option value="20">60</option>
					      <option value="20">80</option>
					    </select>
					    <select class="pagenum input-mini" title="Select page number"></select>
					  </th>
					</tr>
				</tfoot>
			-->
			</table>
			<script type="text/html" id="templateEqTable">
				<tr class="eqLogicItem" data-template-bind='[{"attribute": "data-id", "value": "eqLogicId"}]' >
					<th class="col-xs-3" scope="row" data-content="matTypeName"></th>
					<td class="col-xs-4" data-content="eqRealName"></td>
					<td class="col-xs-4" data-content="zoneName"></td>
					<td class="col-xs-1" style="text-align: right;">
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