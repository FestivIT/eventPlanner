<div class="panel panel-primary" id='planning'>
  	<div class="panel-heading">
  		<button type="button" class="btn btn-xs btn-info showAllZone"><span class="glyphicon glyphicon-triangle-bottom small"></span></button>
  		<button type="button" class="btn btn-xs btn-info hideAllZone"><span class="glyphicon glyphicon-triangle-right small"></span></button>
  		Planning
  		<button type="button" class="btn btn-success btn-xs pull-right editMultipleStateBtn">Etat équipements</button> 
  		<button type="button" class="btn btn-success btn-xs pull-right editMultipleZoneStateBtn">Etat zones</button>
  	</div>
		<table id="planningTable" class="eqTable zoneTable"> <!-- bootstrap classes added by the uitheme widget -->
		  <thead>
		    <tr>
		      <th style="width: 150px;">Zone</th>
		      <th style="width: 160px;">Matériel</th>
		      <th style="width: 120px;">Nom</th>
		      <th style="width: 120px;">IP</th>
		      <th style="width: 100px;" data-date-format="ddmmyyyy">Instal.</th>
		      <th style="width: 100px;" data-date-format="ddmmyyyy">Désinstal.</th>
		      <th>Commentaire</th>
		      <th style="width: 90px;">Etat</th>
		      <th style="width: 40px;"></th>
		    </tr>
		  </thead>
		  <!--
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
		          <option value="30">30</option>
		          <option value="40">40</option>
		        </select>
		        <select class="pagenum input-mini" title="Select page number"></select>
		      </th>
		    </tr>
		  </tfoot>
		  -->
		  <tbody>
		  </tbody>
		</table>
		<script type="text/html" id="templatePlanningTableZone">
				<tr data-template-bind='[{"attribute": "data-zone-id", "value": "zoneId"}, {"attribute": "class", "value": "zoneZtate", "formatter": "formatStateColorClass", "formatOptions": "tablesorter-hasChildRow zoneItem "}]' >
					<td rowspan="1"><strong><a href="#" class="toggle" data-content-append="zoneName"><span class="glyphicon glyphicon-triangle-bottom small" aria-hidden="true"></span><span class="glyphicon glyphicon-triangle-right small" style="display: none;" aria-hidden="true"></span> </a></strong></td>
					<td colspan="3">
						<button type="button" class="btn btn-success btn-xs zoneBtn" data-template-bind='[{"attribute": "data-zone-id", "value": "zoneId"}]'><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span></button>
						<span class="label label-default planningZoneNbrEq">Aucun équipement</span>
					</td>
					<td data-content="zoneInstallDate" data-format="formatDateYmd2Dmy"></td>
					<td data-content="zoneUninstallDate" data-format="formatDateYmd2Dmy"></td>
					<td data-content="zoneComment"></td>
					<td><button type="button" style="width: 100%;font-weight: bold;" data-template-bind='[{"attribute": "class", "value": "zoneState", "formatter": "formatStateColorClass", "formatOptions": "editZoneStateBtn btn btn-xs btn"},{"attribute": "content", "value": "zoneState", "formatter": "formatState"}, {"attribute": "data-zone-id", "value": "zoneId"}, {"attribute": "data-zone-state", "value": "zoneState"}]'></span></td>
					<td>
						<input type="checkbox" class="planningZoneCb" data-template-bind='[{"attribute": "data-zone-id", "value": "zoneId"}, {"attribute": "data-zone-state", "value": "zoneState"}]'>
					</td>
			</tr>
	</script>
	<script type="text/html" id="templatePlanningTableEq">
			<tr class="tablesorter-childRow" data-template-bind='[{"attribute": "data-eq-id", "value": "eqLogicId"}]' >
				<td data-content="matTypeName"></td>
				<td data-content="eqRealName"></td>
				<td data-content="eqLogicIp"></td>
				<td></td>
				<td></td>
				<td data-content="eqLogicComment"></td>
				<td><button type="button" style="width: 100%;font-weight: bold;" data-template-bind='[{"attribute": "class", "value": "eqLogicState", "formatter": "formatStateColorClass", "formatOptions": "editStateBtn btn btn-xs btn"},{"attribute": "content", "value": "eqLogicState", "formatter": "formatState"}, {"attribute": "data-eqLogic-id", "value": "eqLogicId"}, {"attribute": "data-eqLogic-state", "value": "eqLogicState"}]'></span></td>
				<td>
					<input type="checkbox" class="planningEqCb" data-template-bind='[{"attribute": "data-zone-id", "value": "zoneId"}, {"attribute": "data-eq-id", "value": "eqLogicId"}, {"attribute": "data-eqLogic-state", "value": "eqLogicState"}]'>
				</td>
			</tr>
	</script>
	
</div>

<?php
	//include_file('desktop', 'planning', 'js');
	//<td><span data-template-bind='[{"attribute": "class", "value": "eqLogicState", "formatter": "formatStateColorClass", "formatOptions": "label label"},{"attribute": "content", "value": "eqLogicState", "formatter": "formatState"}]'></span></td>
				
?>