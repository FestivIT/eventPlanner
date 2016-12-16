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
    <div class="col-sm-offset-3 col-sm-9">
      <button type="submit" class="btn btn-success">Sauvegarder</button>
    </div>
  </div>
</form>
