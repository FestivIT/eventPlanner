<form class="form-horizontal" id="missionForm">

  <div class="form-group">
      <label for="missionName" class="col-sm-3 control-label" >Nom</label>
      <div class="col-sm-9">
        <input type="text" class="form-control" id="missionName" placeholder="" data-value="missionName">
      </div>
  </div>

  <div class="form-group">
      <label for="missionComment" class="col-sm-3 control-label" >Commentaire</label>
      <div class="col-sm-9">
        <textarea class="form-control" rows="5" id="missionComment" data-content="missionComment"></textarea>
      </div>
  </div>

  <div class="form-group">
    <label for="stateSelect" class="col-sm-3 control-label" >Etat</label>
    <div class="col-sm-9">
      <select class="form-control" name="stateSelect" id="stateSelect"></select>
      <script type="text/html" id="templateStateSelectOptgroup">
        <optgroup data-template-bind='[{"attribute": "label", "value": "text"}, {"attribute": "id", "value": "id"}]' ></optgroup>
      </script>
      <script type="text/html" id="templateStateSelectOptions">
        <option data-template-bind='[{"attribute": "value", "value": "id"}]' data-content="text"></option>
      </script>
    </div>
  </div>

  <div class="form-group">
      <label for="missionZoneSelect" class="col-sm-3 control-label" >Zone</label>
      <div class="col-sm-9">
        <select multiple class="form-control" id="missionZoneSelect"></select>
        <script type="text/html" id="templateZoneOptions">
          <option data-template-bind='[{"attribute": "value", "value": "zoneId"}]' data-content="zoneName"></option>
        </script>
      </div>
  </div>

  <div class="form-group">
      <label for="missionUserSelect" class="col-sm-3 control-label" >Attribué à</label>
      <div class="col-sm-9">
        <select multiple class="form-control" id="missionUserSelect"></select>
        <script type="text/html" id="templateUserOptions">
          <option data-template-bind='[{"attribute": "value", "value": "userId"}]' data-content="userName"></option>
        </script>
      </div>
  </div>

  <div class="form-group">
    <div class="col-sm-offset-3 col-sm-9">
      <input type="text" id="missionId" style="display: none;" data-value="missionId">
      <input type="text" id="missionEventId" style="display: none;" data-value="missionEventId">
      <button type="submit" class="btn btn-success">Sauvegarder</button>
    </div>
  </div>
</form>