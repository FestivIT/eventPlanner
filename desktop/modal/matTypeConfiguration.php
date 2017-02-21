<form class="form-horizontal" id="matTypeForm">
	<input type="text" id="matTypeId" style="display: none;" data-value="matTypeId">
	<div class="panel panel-primary">
  	  <div class="panel-heading">Général</div>
  	  <div class="panel-body">
	  	  <div class="form-group">
		    	<label for="matTypeName" class="col-sm-3 control-label" >Nom</label>
		    	<div class="col-sm-9">
		    		<input type="text" class="form-control" id="matTypeName" placeholder="NS5, SWITCH, ..." data-value="matTypeName">
		    	</div>
		  </div>
  	  </div>
  	</div>
    <div class="panel panel-primary">
  	  <div class="panel-heading">
  	  	Options associées
  	  	<button type="button" class="btn btn-success btn-xs pull-right" id="addMatOptionBtn">Ajouter</button>
  	  </div>
	  <div class="panel-body">
		<div class="list-group" id="optionList">
		  <a href="#" class="list-group-item disabled">IP</a>
		</div>
		<script type="text/html" id="templateMatTypeOption">
			<a href="#" class="list-group-item" data-template-bind='[{"attribute": "data-option", "value": "option"}]' ><span data-content="option"></span> <span class="glyphicon glyphicon-minus-sign pull-right deleteOptionBtn"></span></a>
        </script>
        <script type="text/html" id="templateMatTypeAddOption">
			<a href="#" class="list-group-item" data-template-bind='[{"attribute": "data-option", "value": "option"}]' ><input type="text" id="addOptionName" class="input-form"> <span class="glyphicon glyphicon-plus-sign pull-right addOptionBtn"></span></a>
        </script>
	  </div>
	</div>
</form>