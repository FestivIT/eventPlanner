<form class="form-horizontal" id="stateForm">
  <div class="form-group">
    <label for="stateSelect" class="col-sm-3 control-label" >Etat:</label>
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
    <label class="col-sm-3 control-label" >S'applique sur:</label>
    <div class="col-sm-9">
    	<p id="stateToList"></p>
   	</div>
   	<script type="text/html" id="templateStateTo">
		<p>
			<span class="label label-danger" data-content="typeName"></span>&nbsp;
			<span class="label label-primary" data-content="name"></span><br>
		</p>
	</script>
  </div>
  <div class="form-group zoneEqlogicState">
    <label class="col-sm-3 control-label" >Appliquer sur les équipements de la zone</label>
    <div class="col-sm-2">
    	<input type="checkbox" id="eqLogicStateSwitch">
    </div>
    <div class="col-sm-7">
		<span class="label label-primary zoneEqLogicState"></span>   	
   	</div>
  </div>
</form>
