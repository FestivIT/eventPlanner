<div id="configevent">
	<nav class="navbar navbar-default epContextualNavBar">
		<div class="container-fluid">
			<div class="nav navbar-nav navbar-left">
		    	<a class="navbar-brand">Configuration de l'événement</a>
		    </div>
		</div>
	</nav>
	
	<div class="screenContainer">
		<div id="configContact">
			<legend>Contact</legend>
			<button type="button" class="btn navbar-btn btn-success addContactBtn btn-sm"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
			<button type="button" class="btn navbar-btn btn-success saveContactBtn btn-sm">Sauvegarder</button>
			<table id="contactTable" class="table table-striped">
			    <thead>
				    <tr>
				    	<th readonly></th>
					    <th>Nom</th>
					    <th>Fct</th>
					    <th name="zone">Zone</th>
					    <th>Tél</th>
					    <th>Mail</th>
					    <th>DECT</th>
					    <th>Autre</th>
				    </tr>
			    </thead>
			    <tbody>
			    </tbody>
			</table>
	
			<script type="text/html" id="templateContactTable">
					<tr class="contactItem" data-template-bind='[{"attribute": "data-id", "value": "contactId"}]'>
						<td tabindex="1"></td>
			    		<td tabindex="1" data-content="contactName" data-property="contactName" data-template-bind='[{"attribute": "data-original-value", "value": "contactName"}]'></td>
			    		<td tabindex="1" data-content="contactFct" data-property="contactFct" data-template-bind='[{"attribute": "data-original-value", "value": "contactFct"}]'></td>
			    		<td tabindex="1" data-content="zoneName" data-property="contactZoneId" data-template-bind='[{"attribute": "data-original-value", "value": "zoneName"}]'></td>
			    		<td tabindex="1" data-property="contactCoord" data-property-item="Tel" data-template-bind='[{"attribute": "content", "value": "contactId", "formatter": "contactCoord", "formatOptions": "Tel"}, {"attribute": "data-original-value", "value": "contactId", "formatter": "contactCoord", "formatOptions": "Tel"}]'></td>
			    		<td tabindex="1" data-property="contactCoord" data-property-item="Mail" data-template-bind='[{"attribute": "content", "value": "contactId", "formatter": "contactCoord", "formatOptions": "Mail"}, {"attribute": "data-original-value", "value": "contactId", "formatter": "contactCoord", "formatOptions": "Mail"}]'></td>
			    		<td tabindex="1" data-property="contactCoord" data-property-item="DECT" data-template-bind='[{"attribute": "content", "value": "contactId", "formatter": "contactCoord", "formatOptions": "DECT"}, {"attribute": "data-original-value", "value": "contactId", "formatter": "contactCoord", "formatOptions": "DECT"}]'></td>
			    		<td tabindex="1" data-property="contactCoord" data-property-item="Autre" data-template-bind='[{"attribute": "content", "value": "contactId", "formatter": "contactCoord", "formatOptions": "Autre"}, {"attribute": "data-original-value", "value": "contactId", "formatter": "contactCoord", "formatOptions": "Autre"}]'></td>
			    	</tr>
			</script>
		</div>
	</div>
</div>


