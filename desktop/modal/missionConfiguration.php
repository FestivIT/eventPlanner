<form class="form-horizontal" id="missionForm">
<input type="text" id="missionId" style="display: none;" data-value="missionId">
      <input type="text" id="missionEventId" style="display: none;" data-value="missionEventId">
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
    <label for="missionZoneSelect" class="col-sm-3 control-label" >Zones</label>
      <div class="col-sm-9">
        <div class="input-group">
          <select class="form-control" id="missionZoneSelect"></select>
          <span class="input-group-btn">
            <button class="btn btn-success addZoneOptionBtn" type="button"><span class="glyphicon glyphicon-plus-sign"></span></button>
          </span>
          <script type="text/html" id="templateZoneOptions">
            <option data-template-bind='[{"attribute": "value", "value": "zoneId"}]' data-content="zoneName"></option>
          </script>
        </div>

        <div id="missionZoneList" class="list-group">
        </div>
        <script type="text/html" id="templateMissionZoneOption">
          <span class="list-group-item missionZoneItem" data-template-bind='[{"attribute": "data-zone-id", "value": "zoneId"}]' data-content-prepend="zoneName"><a href="#" class="deleteZoneOptionBtn"><span class="glyphicon glyphicon-minus-sign pull-right "></span></a></span>
        </script>
    </div>
  </div>
  
  <div class="form-group">
  	<label for="missionUserSelect" class="col-sm-3 control-label" >Attribué à</label>
      <div class="col-sm-9">
        <div class="input-group">
          <select class="form-control" id="missionUserSelect"></select>
          <span class="input-group-btn">
            <button class="btn btn-success addUserOptionBtn" type="button"><span class="glyphicon glyphicon-plus-sign"></span></button>
          </span>
          <script type="text/html" id="templateUserOptions">
            <option data-template-bind='[{"attribute": "value", "value": "userId"}]' data-content="userName"></option>
          </script>
        </div>

        <div id="missionUserList" class="list-group">
        </div>
        <script type="text/html" id="templateMissionUserOption">
          <span class="list-group-item missionUserItem" data-template-bind='[{"attribute": "data-user-id", "value": "userId"}]' data-content-prepend="userName"><a href="#" class="deleteUserOptionBtn"><span class="glyphicon glyphicon-minus-sign pull-right "></span></a></span>
        </script>
  	</div>
  </div>
</form>