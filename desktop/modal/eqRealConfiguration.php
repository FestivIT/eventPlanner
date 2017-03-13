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
</form>