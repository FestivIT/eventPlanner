<form class="form-horizontal" id="eqRealForm">
  <div class="form-group">
      <label for="eqRealMatTypeId" class="col-sm-3 control-label" >Type de matériel</label>
      <div class="col-sm-9">
        <select class="form-control" id="eqRealMatTypeId"></select>
        <script type="text/html" id="templateEqMatTypeOptions">
          <option data-value="matTypeId" data-content="matTypeName"></option>
        </script>
      </div>
  </div>
  <div class="form-group">
    	<label for="eqRealName" class="col-sm-3 control-label" >Nom</label>
    	<div class="col-sm-9">
    		<input type="text" class="form-control" id="eqRealName" placeholder="Nom" data-value="eqRealName">
    	</div>
  </div>
  <div class="form-group">
      <label for="eqRealComment" class="col-sm-3 control-label" >Commentaire</label>
      <div class="col-sm-9">
        <textarea class="form-control" rows="5" id="eqRealComment" data-content="eqRealComment"></textarea>
      </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-3 col-sm-9">
      <input type="text" id="eqRealId" style="display: none;" data-value="eqRealId">
      <input type="text" id="eqRealState" style="display: none;" data-value="eqRealState">
      <button type="submit" class="btn btn-success">Sauvegarder</button>
    </div>
  </div>
</form>