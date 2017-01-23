<form class="form-horizontal" id="zoneForm">
  <div class="form-group">
    	<label for="name" class="col-sm-3 control-label" >Nom</label>
    	<div class="col-sm-9">
    		<input type="text" class="form-control" id="zoneName" placeholder="Nom" data-value="zoneName">
    	</div>
  </div>
  <div class="form-group" id="mapDiv">
		<label class="col-sm-3 control-label" data-template-bind='[{"attribute": "for", "value": "modalId", "formatter": "prepend", "formatOptions": "mapZone"}]'>Localisation</label>
		<div class="col-sm-9">
        	<div class="modalMap" data-template-bind='[{"attribute": "id", "value": "modalId", "formatter": "prepend", "formatOptions": "mapZone"}]'></div>
        </div>
  </div>
  <div class="form-group">
  		<label for="eventDate" class="col-sm-3 control-label" >Dates</label>
  		<div class="col-sm-9">
			<div class="input-group">
				<div class="input-daterange input-group" id="datepicker">
				    <input id="zoneInstallDate" type="text" class="input-sm form-control" placeholder="Instal." data-value="zoneInstallDate" data-format="formatDateYmd2Dmy" data-format-target="value"/>
				    <span class="input-group-addon">au</span>
				    <input id="zoneUninstallDate" type="text" class="input-sm form-control" placeholder="Désinstal." data-value="zoneUninstallDate" data-format="formatDateYmd2Dmy" data-format-target="value"/>
				</div>
			</div>
		</div>
  </div>
  <div class="form-group eqZoneConf">
  		<label for="eqTableZone" class="col-sm-3 control-label" >Equipements<br>
  		<button type="button" class="btn btn-success btn-xs editEqBtn" data-eq-id="new" data-template-bind='[{"attribute": "data-zone-id", "value": "zoneId"}]'>Ajouter</button>
  		</label>
	  	<div class="col-sm-9">
	  		<table class="table table-striped table-hover table-condensed eqTable" id="eqTableZone">
				<thead>
					<tr>
						<th>Type</th>
						<th>Matériel</th>
						<th class="text-right">Actions</th>
					</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
			<script type="text/html" id="templateZoneConfigurationEqTable">
				<tr>
					<th class="col-xs-3" scope="row" data-content="matTypeName"></th>
					<td class="col-xs-4" data-content="eqRealName"></td>
					<td class="col-xs-1" style="text-align: right;">
						<button type="button" class="btn btn-warning btn-xs editEqBtn" data-template-bind='[{"attribute": "data-eq-id", "value": "eqLogicId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button>
						<button type="button" class="btn btn-danger btn-xs deleteEqBtn" data-template-bind='[{"attribute": "data-eq-id", "value": "eqLogicId"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
					</td>
				</tr>
			</script>
		</div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-3 col-sm-9">
      <input type="text" id="zoneId" style="display: none;" data-value="zoneId">
      <input type="text" id="zoneEventId" style="display: none;" data-value="zoneEventId">
      <input type="text" id="zoneState" style="display: none;" data-value="zoneState">
      <button type="submit" class="btn btn-success">Sauvegarder</button>
    </div>
  </div>
</form>