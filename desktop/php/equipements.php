<div id="equipements">
	<nav class="navbar navbar-default epContextualNavBar">
		<div class="container-fluid">
			<div class="navbar-header">
		    	<a class="navbar-brand">Equipements</a>
		    </div>
			
			<div class="nav navbar-nav navbar-right hidden-xs">
				<button type="button" class="btn navbar-btn btn-default btn-sm" data-toggle="modal" data-target="#zoneDupModal">Dupliquer zone</button>
	    		<button type="button" class="btn navbar-btn btn-default btn-sm" data-toggle="modal" data-target="#columnsSelectorModal">Colonnes</button>
	    		<button type="button" class="btn navbar-btn btn-success addEqBtn btn-sm"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
	    		<button type="button" class="btn navbar-btn btn-warning btn-sm saveEqBtn">Sauvegarder</button>
	    	</div>
		</div>
	</nav>

	<!-- Modal -->
	<div class="modal fade" id="columnsSelectorModal" tabindex="-1" role="dialog">
	  <div class="modal-dialog modal-lg" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title">Sélection des attributs</h4>
	      </div>
	      <div class="modal-body">
	      	Cocher les attributs à afficher:
	        <div id="eqColSelectBtn-target"></div>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button>
	      </div>
	    </div>
	  </div>
	</div>
	
	<div class="modal fade" id="zoneDupModal" tabindex="-1" role="dialog">
	  <div class="modal-dialog modal-lg" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title">Duplication des équipements d'une zone</h4>
	      </div>
	      <div class="modal-body">
	    	<form class="form-horizontal" id="dupZoneForm">
	    		<div class="form-group">
			      <label for="eqLogicZoneId" class="col-sm-3 control-label" >Zone à dupliquer (source):</label>
			      <div class="col-sm-9">
			        <select class="form-control" id="dupZoneSource"></select>
			      </div>
				</div>
				
				<div class="form-group">
			      <label for="eqLogicZoneId" class="col-sm-3 control-label" >Zone(s) destinataires:</label>
			      <div class="col-sm-9">
			        <select class="form-control" id="dupZoneDest" multiple size="10"></select>
			      </div>
				</div>
			</form>
	      		<script type="text/html" id="templateEqZoneOptions">
			          <option data-template-bind='[{"attribute": "value", "value": "zoneId"}, {"attribute": "data-zone-loc", "value": "zoneLocalisation", "formatter": "JSONStringify"}]' data-content="zoneName"></option>
			    </script>
	      </div>
	      <div class="modal-footer">
	        <button type="button" class="btn btn-default" data-dismiss="modal">Fermer</button>
	        <button type="button" class="btn btn-primary" id="btnDupZoneSubmit">Dupliquer</button>
	      </div>
	    </div>
	  </div>
	</div>
	
	<div class="screenContainer" id="eqLogicTableWrapper">
		<table class="table table-striped table-condensed eqLogicTable" id="eqLogicTable">
			<thead>
				<tr>
					<th class="eqColAct" readonly></th>
					<th class="eqColMatType" name="matType">Type</th>
					<th class="eqColEqReal" name="eqReal">Matériel</th>
					<th class="eqColZone" name="zone">Zone</th>
					<th class="eqColComment" name="comment">Commentaire</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
	
	<script type="text/html" id="templateEqTable">
		<tr class="eqLogicItem" data-template-bind='[{"attribute": "data-id", "value": "eqLogicId"}]' >
			<td class="eqColAct" tabindex="1" readonly>
				<button type="button" class="btn btn-primary btn-xs dupEqBtn" data-template-bind='[{"attribute": "data-eq-id", "value": "eqLogicId"}]' title="Dupliquer"><span class="glyphicon glyphicon-duplicate"></span></button> 
				<button type="button" class="btn btn-danger btn-xs deleteEqBtn" data-template-bind='[{"attribute": "data-eq-id", "value": "eqLogicId"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
			</td>
			<td class="eqColMatType" tabindex="1" data-property="eqLogicMatTypeId" data-template-bind='[{"attribute": "data-val", "value": "matTypeId"}]' data-content="matTypeName"></td>
			<td class="eqColEqReal" tabindex="1" data-property="eqLogicEqRealId" data-template-bind='[{"attribute": "data-val", "value": "eqRealId"}]' data-content="eqRealName"></td>
			<td class="eqColZone" tabindex="1" data-property="eqLogicZoneId" data-template-bind='[{"attribute": "data-val", "value": "zoneId"}]' data-content="zoneName"></td>
			<td class="eqColComment" tabindex="1" data-property="eqLogicComment" data-content="eqLogicComment"></td>
		</tr>
	</script>

	<script type="text/html" id="templateAttributeHeader">
		<th class="eqColAttr" data-columnSelector="false" data-template-bind='[{"attribute": "data-attribute-id", "value": "matTypeAttributeId"}]'><span class="label label-info" data-content="matTypeName"></span> <span data-content="matTypeAttributeName"></span></th>
	</script>

	<script type="text/html" id="templateAttributeCell">
		<td class="eqColAttr" readonly tabindex="1" data-property="eqLogicAttribute" data-content="eqLogicAttributeValue" data-template-bind='[{"attribute": "data-matTypeAttributeId", "value": "matTypeAttributeId"}]'></td>
	</script>
</div>