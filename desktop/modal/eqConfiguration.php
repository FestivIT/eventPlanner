<form class="form-horizontal" id="eqLogicForm">
  <div class="form-group">
      <label for="eqLogicZoneId" class="col-sm-3 control-label" >Zone</label>
      <div class="col-sm-9">
        <select class="form-control" id="eqLogicZoneId"></select>
        <script type="text/html" id="templateEqZoneOptions">
        
          <option data-template-bind='[{"attribute": "value", "value": "zoneId"}, {"attribute": "data-zone-loc", "value": "zoneLocalisation", "formatter": "JSONStringify"}]' data-content="zoneName"></option>
        </script>
      </div>
  </div>
  <div class="form-group">
      <label for="eqLogicMatTypeId" class="col-sm-3 control-label" >Type de matériel</label>
      <div class="col-sm-9">
        <select class="form-control" id="eqLogicMatTypeId"></select>
        <script type="text/html" id="templateEqMatTypeOptions">
          <option data-value="matTypeId" data-content="matTypeName"></option>
        </script>
      </div>
  </div>

  <div class="form-group">
      <label for="eqLogicEqRealId" class="col-sm-3 control-label" >Matériel utilisé</label>
      <div class="col-sm-9">
        <select class="form-control" id="eqLogicEqRealId"></select>

        <script type="text/html" id="templateEqRealOptions">
          <option data-value="eqRealId" data-content="eqRealName"></option>
        </script>
      </div>
  </div>
  <div class="form-group">
      <label for="eqLogicIp" class="col-sm-3 control-label" >IP</label>
      <div class="col-sm-9">
        <input type="text" class="form-control" id="eqLogicIp" placeholder="IP" data-value="eqLogicIp">
      </div>
  </div>
  <div class="form-group">
      <label for="eqLogicComment" class="col-sm-3 control-label" >Commentaire</label>
      <div class="col-sm-9">
        <textarea class="form-control" rows="5" id="eqLogicComment" data-content="eqLogicComment"></textarea>
      </div>
  </div>
  <div class="form-group">
      <label for="eqLocalisation" class="col-sm-3 control-label" >Localiser précisément</label>
      <div class="col-sm-9">
        <input type="checkbox" id="eqLocalisation">
      </div>
  </div>
  <div class="form-group" id="mapDiv">
		<label class="col-sm-3 control-label" data-template-bind='[{"attribute": "for", "value": "modalId", "formatter": "prepend", "formatOptions": "mapZone"}]'>Localisation</label>
		<div class="col-sm-9">
        	<div class="modalMap" data-template-bind='[{"attribute": "id", "value": "modalId", "formatter": "prepend", "formatOptions": "mapZone"}]'></div>
        </div>
  </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-3 col-sm-9">
      <input type="text" id="eqLogicId" style="display: none;" data-value="eqLogicId">
      <input type="text" id="eqLogicEventId" style="display: none;" data-value="eqLogicEventId">
      <input type="text" id="eqLogicState" style="display: none;" data-value="eqLogicState">
      <button type="submit" class="btn btn-success">Sauvegarder</button>
    </div>
  </div>
</form>