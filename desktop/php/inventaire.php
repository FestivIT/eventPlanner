<div class="row" id='inventaire'>
	<div class="col-sm-12">
		<div class="panel panel-primary">
		  	<div class="panel-heading">
		  		Inventaire matériel
		  		<button type="button" class="btn btn-success btn-xs pull-right editEqRealBtn" data-eqReal-id="new">Ajouter</button>
		  	</div>
			
			<table class="table table-striped table-hover table-condensed eqRealTable" id="eqRealTable">
				<thead>
					<tr>
						<th>Type</th>
						<th>Matériel</th>
						<th>Etat</th>
						<th class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
				<tfoot>
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
			</table>
			
			<script type="text/html" id="templateEqRealTable">
				<tr class="eqRealItem" data-template-bind='[{"attribute": "data-id", "value": "eqRealId"}]' >
					<th class="col-xs-4" scope="row" data-content="matTypeName"></th>
					<td class="col-xs-3" data-content="eqRealName"></td>
					<td class="col-xs-4"><button type="button" style="font-weight: bold;" data-template-bind='[{"attribute": "class", "value": "eqRealState", "formatter": "formatStateColorClass", "formatOptions": "editStateBtn btn btn-xs btn"},{"attribute": "content", "value": "eqRealState", "formatter": "formatState"}, {"attribute": "data-eqReal-id", "value": "eqRealId"}, {"attribute": "data-eqReal-state", "value": "eqRealState"}]'></span></td>
					<td class="col-xs-1" style="text-align: right;">
						<button type="button" class="btn btn-warning btn-xs editEqRealBtn" data-template-bind='[{"attribute": "data-eqReal-id", "value": "eqRealId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button>
						<button type="button" class="btn btn-danger btn-xs deleteEqRealBtn" data-template-bind='[{"attribute": "data-eqReal-id", "value": "eqRealId"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
					</td>
				</tr>
			</script>
		</div>
	</div>
</div>

<?php
	//include_file('desktop', 'equipement', 'js');
?>