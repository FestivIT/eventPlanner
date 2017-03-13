<form class="form-horizontal" id="contactForm">
  <div class="form-group">
      <label for="contactName" class="col-sm-3 control-label" >Nom</label>
      <div class="col-sm-9">
        <input type="text" class="form-control" id="contactName" placeholder="Nom" data-value="contactName">
      </div>
  </div>
  <div class="form-group">
      <label for="contactFct" class="col-sm-3 control-label" >Fonction</label>
      <div class="col-sm-9">
        <input type="text" class="form-control" id="contactFct" placeholder="Fonction" data-value="contactFct">
      </div>
  </div>
  <div class="form-group">
      <label for="contactZoneId" class="col-sm-3 control-label" >Zone</label>
      <div class="col-sm-9">
        <select class="form-control" id="contactZoneId"></select>
        <script type="text/html" id="templateContactZoneOptions">
          <option data-template-bind='[{"attribute": "value", "value": "zoneId"}]' data-content="zoneName"></option>
        </script>
      </div>
  </div>
  <div class="form-group">
      <label for="contactCoord" class="col-sm-3 control-label" >Tél.</label>
      <div class="col-sm-9">
        <input type="text" class="form-control contactCoord" data-coord-type="Tel" data-template-bind='[{"attribute": "value", "value": "contactId", "formatter": "contactCoord", "formatOptions": "Tel"}]'>
      </div>
  </div>
  <div class="form-group">
      <label for="contactFct" class="col-sm-3 control-label" >Mail</label>
      <div class="col-sm-9">
        <input type="text" class="form-control contactCoord" data-coord-type="Mail" data-template-bind='[{"attribute": "value", "value": "contactId", "formatter": "contactCoord", "formatOptions": "Mail"}]'>
      </div>
  </div>
  <div class="form-group">
      <label for="contactFct" class="col-sm-3 control-label" >DECT</label>
      <div class="col-sm-9">
        <input type="text" class="form-control contactCoord" data-coord-type="DECT" data-template-bind='[{"attribute": "value", "value": "contactId", "formatter": "contactCoord", "formatOptions": "DECT"}]'>
      </div>
  </div>
  <div class="form-group">
      <label for="contactFct" class="col-sm-3 control-label" >Autre</label>
      <div class="col-sm-9">
        <input type="text" class="form-control contactCoord" data-coord-type="Autre" data-template-bind='[{"attribute": "value", "value": "contactId", "formatter": "contactCoord", "formatOptions": "Autre"}]'>
      </div>
  </div>
</form>