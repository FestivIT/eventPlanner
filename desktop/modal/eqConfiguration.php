<form class="form-horizontal" id="eqLogicForm">
	<!-- Nav tabs -->
	<ul class="nav nav-tabs" role="tablist">
		<li role="presentation" class="active"><a href="#general" aria-controls="general" role="tab" data-toggle="tab">Général</a></li>
		<li role="presentation"><a href="#attributs" aria-controls="attributs" role="tab" data-toggle="tab">Attributs</a></li>
		<li role="presentation"><a href="#link" aria-controls="link" role="tab" data-toggle="tab">Liens</a></li>
		<li role="presentation"><a href="#localisation" aria-controls="localisation" role="tab" data-toggle="tab">Localisation</a></li>
	</ul>
	
	<!-- Tab panes -->
	<div class="tab-content">
		<div role="tabpanel" class="tab-pane active" id="general">
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
			      <label for="eqLogicComment" class="col-sm-3 control-label" >Commentaire</label>
			      <div class="col-sm-9">
			        <textarea class="form-control" rows="5" id="eqLogicComment" data-content="eqLogicComment"></textarea>
			      </div>
			  </div>
		</div>
		
		<div role="tabpanel" class="tab-pane" id="attributs">
			  <div class="form-group">
			      <label for="eqLogicIp" class="col-sm-3 control-label" >IP</label>
			      <div class="col-sm-9">
			        <input type="text" class="form-control" id="eqLogicIp" placeholder="IP" data-value="eqLogicIp">
			      </div>
			  </div>
		</div>
		<script type="text/html" id="templateEqConfigurationEqLogicAttribute">
			<div class="form-group">
				<label class="col-sm-3 control-label" data-content="matTypeAttributeName"></label>
				<div class="col-sm-9">
					<input type="text" class="form-control eqLogicAttribute" data-attribute-id="" data-template-bind='[{"attribute": "data-mat-type-attribute-id", "value": "matTypeAttributeId"}]'>
				</div>
			</div>
		</script>
		
		<div role="tabpanel" class="tab-pane" id="link">
			<div class="form-group eqLinkConf">
		      <label for="eqTableZone" class="col-sm-2 control-label" >Liens<br>
		      <button type="button" class="btn btn-success btn-xs addEqLinkBtn" data-template-bind='[{"attribute": "data-eq-logic-id", "value": "eqLogicId"}]'>Ajouter</button>
		      </label>
		      <div class="col-sm-10">
		        <table class="table table-striped table-hover table-condensed eqLinkTable" id="eqLinkTable">
		        <thead>
		          <tr>
		            <th>Vers</th>
		            <th>Type</th>
		            <th>Commentaire</th>
		            <th class="text-right">Actions</th>
		          </tr>
		        </thead>
		        <tbody>
		        </tbody>
		      </table>
		      <script type="text/html" id="templateEqConfigurationEqLinkTable">
		        <tr data-template-bind='[{"attribute": "data-eq-link-id", "value": "eqLinkId"}, {"attribute": "data-status", "value": "status"}]'>
		          <td class="col-xs-6">
		            <select class="form-control eqLinkEqLogicIdSelect"></select>
		          </td>
		          <td class="col-xs-2">
		            <select class="form-control eqLinkTypeSelect"></select>
		          </td>
		          <td class="col-xs-3">
		            <input class="form-control eqLinkComment" placeholder="Commentaire" data-value="eqLinkComment">
		          </td>
		          <td class="col-xs-1" style="text-align: right;">
		            <button type="button" class="btn btn-danger btn-xs deleteEqLinkBtn" data-template-bind='[{"attribute": "data-eq-link-id", "value": "eqLinkId"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
		          </td>
		        </tr>
		      </script>
		      <script type="text/html" id="templateEqLogicOptions">
		          <option data-value="eqLogicId" data-content="eqLogicName"></option>
		      </script>
		      <script type="text/html" id="templateEqLinkTypeOptions">
		          <option data-value="eqLinkTypeId" data-content="eqLinkTypeName"></option>
		      </script>
		    </div>
		  </div>
		</div>
		
		<div role="tabpanel" class="tab-pane" id="localisation">
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
	</div>
</form>