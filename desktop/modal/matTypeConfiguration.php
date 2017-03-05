<form class="form-horizontal" id="matTypeForm">
	<div class="panel panel-primary">
  	  <div class="panel-heading">Général</div>
  	  <div class="panel-body">
	  	  <div class="form-group">
		    	<label for="matTypeName" class="col-sm-3 control-label" >Nom</label>
		    	<div class="col-sm-9">
		    		<input type="text" class="form-control" id="matTypeName" placeholder="NS5, SWITCH, ..." data-value="matTypeName">
		    	</div>
		  </div>
		  <div class="form-group">
		      <label for="eqLogicMatTypeId" class="col-sm-3 control-label" >Parent</label>
		      <div class="col-sm-9">
		        <select class="form-control" id="matTypeParentId">
		        	<option value="">Aucun</option>
		        </select>
		        <script type="text/html" id="templateMatTypeParentOption">
		        	<option data-value="matTypeId" data-content="matTypeName"></option>
		        </script>
		      </div>
		  </div>
  	  </div>
  	</div>
    <div class="panel panel-primary">
  	  <div class="panel-heading">
  	  	Attributs associés
  	  </div>
	  <div class="panel-body">
		<div class="list-group" id="attributesList">
		  <div class="list-group-item">
			<div class="input-group">
				<input type="text" id="addAttributeName" class="form-control"></span>
				<span class="input-group-btn">
	            	<button class="btn btn-success addAttributeBtn" type="button"><span class="glyphicon glyphicon-plus-sign"></span></button>
	        	</span>
	        </div>
		  </div>
		</div>
		<script type="text/html" id="templateMatTypeAttribute">
			<div class="list-group-item">
				<div class="input-group matTypeAttributeItem" data-template-bind='[{"attribute": "data-attribute-id", "value": "matTypeAttributeId"}]'>
					<input type="text" data-value="matTypeAttributeName" class="form-control">
					<span class="input-group-btn">
		            	<button class="btn btn-danger deleteAttributeBtn" type="button"><span class="glyphicon glyphicon-minus-sign"></span></button>
		        	</span>
		        </div>
			</div>
		</script>
        
		<script type="text/html" id="templateMatTypeAttributeParent">
			<div class="list-group-item" data-template-bind='[{"attribute": "data-attribute-id", "value": "matTypeAttributeId"}]' ><span class="label label-info" data-content="matTypeName"></span> <span data-content="matTypeAttributeName"></span></div>
        </script>
	  </div>
	</div>
</form>