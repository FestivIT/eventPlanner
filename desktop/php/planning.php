<div class="panel panel-primary">
  	<div class="panel-heading">
  		Planning
  	</div>
	
	<table id="planningTable"> <!-- bootstrap classes added by the uitheme widget -->
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
			<tr class="tablesorter-hasChildRow" data-template-bind='[{"attribute": "data-zone-id", "value": "id"}, {"attribute": "class", "value": "state", "formatter": "formatStateColorClass"}]' >
				<td rowspan="1"><a href="#" class="toggle" data-content-append="name"><span class="glyphicon glyphicon-triangle-bottom small" aria-hidden="true"></span><span class="glyphicon glyphicon-triangle-right small" style="display: none;" aria-hidden="true"></span> </a></td>
				<td colspan="3"></td>
				<td data-content="installDate" data-format="formatDateYmd2Dmy"></td>
				<td data-content="uninstallDate" data-format="formatDateYmd2Dmy"></td>
				<td data-content="comment"></td>
				<td><span data-template-bind='[{"attribute": "class", "value": "state", "formatter": "formatStateColorClass", "formatOptions": "label label"},{"attribute": "content", "value": "state", "formatter": "formatState"}]'></span></td>
				<td>
					<input type="checkbox" class="planningZoneCb" data-template-bind='[{"attribute": "data-zone-id", "value": "id"}]'>
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
				<td><span data-template-bind='[{"attribute": "class", "value": "eqLogicState", "formatter": "formatStateColorClass", "formatOptions": "label label"},{"attribute": "content", "value": "eqLogicState", "formatter": "formatState"}]'></span></td>
				<td>
					<input type="checkbox" class="planningEqCb" data-template-bind='[{"attribute": "data-zone-id", "value": "zoneId"}, {"attribute": "data-eq-id", "value": "eqLogicId"}]'>
				</td>
			</tr>
	</script>
</div>

<?php
	//include_file('desktop', 'planning', 'js');
?>