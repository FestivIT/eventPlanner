<div>
  <!-- Nav tabs -->
  <ul class="nav nav-tabs" role="tablist">
    <li role="presentation" class="active"><a href="#zone" aria-controls="zone" role="tab" data-toggle="tab" id="linkHome">Zone</a></li>
    <li role="presentation"><a href="#equipements" aria-controls="equipements" role="tab" data-toggle="tab" id="linkEquipement">Equipements</a></li>
    <li role="presentation"><a href="#carte" aria-controls="carte" role="tab" data-toggle="tab" id="linkCarte">Carte</a></li>
  </ul>

  <!-- Tab panes -->
  <div class="tab-content">
    <div role="tabpanel" class="tab-pane active row zoneTable" id="zone">
    	<div class="col-sm-12">
    		<div class="row zoneItem" id="zoneInfo" data-template-bind='[{"attribute": "data-id", "value": "zoneId"}]'>
				
			</div>
			<script type="text/html" id="templateZoneInfo">
				<div class="col-sm-6">
					<div class="panel panel-default">
						<div class="panel-heading">Informations</div>
						<div class="panel-body">
							<div class="row">
							  <div class="col-xs-4"><label class="control-label">Etat:</label></div>
							  <div class="col-xs-8">
							  	<button type="button" style="width: 100%;font-weight: bold;" data-template-bind='[{"attribute": "class", "value": "zoneState", "formatter": "formatStateColorClass", "formatOptions": "editStateBtn btn btn-xs btn"},{"attribute": "content", "value": "zoneState", "formatter": "formatState"}, {"attribute": "data-zone-id", "value": "zoneId"}, {"attribute": "data-zone-state", "value": "zoneState"}]'></span>
							  </div>
							</div>
							<div class="row">
							  <div class="col-xs-4"><label class="control-label">Installation:</label></div>
							  <div class="col-xs-8"><span class="label label-primary" data-content="zoneInstallDate" data-format="formatDateYmd2Dmy"></span></div>
							</div>		
							<div class="row">
							  <div class="col-xs-4"><label class="control-label">Désinstallation:</label></div>
							  <div class="col-xs-8"><span class="label label-primary" data-content="zoneUninstallDate" data-format="formatDateYmd2Dmy"></span></div>
							</div>		
							<div class="row">
							  <div class="col-xs-4"><label class="control-label">Contact:</label></div>
							  <div class="col-xs-8" id="zoneContactList">
							  	
							  </div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-sm-6">
					<div class="panel panel-default">
						<div class="panel-heading">Commentaire</div>
						<div class="panel-body" data-content="zoneComment">
						</div>
					</div>
				</div>
			</script>
			<script type="text/html" id="templateZoneContact">
				<div class="row">
					<div class="col-sm-6">	
						<strong><span data-content="contactName">Test Name</span></strong><br>
						<small><span data-content="contactFct">Test fct</span></small>
					</div>
					<div class="col-sm-6" data-template-bind='[{"attribute": "content", "value": "contactId", "formatter": "formatContactCoord", "formatOptions": "templateZoneContactCoord"}]'>
					</div>
				</div>
			</script>
			<script type="text/html" id="templateZoneContactCoord">
				 <span class="label label-info">
				 	<span data-content="type"></span>: 
				 	<span data-content="value"></span>
				 </span><br>
			</script>
		</div>
		<div class="col-sm-12">    
			<div class="panel panel-default">
				<div class="panel-heading">
					Main courante
				  <button type="button" class="btn btn-xs btn-info next pull-right"><span class="glyphicon glyphicon-triangle-right small"></span></button>
      			  <button type="button" class="btn btn-xs btn-info previous pull-right"><span class="glyphicon glyphicon-triangle-left small"></span></button>
				</div>
				<div>
				  <form class="form-horizontal msgForm" data-template-bind='[{"attribute": "data-zone-id", "value": "zoneId"}]'>
					<div class="input-group">
					  <input type="text" class="form-control msgFormInput" placeholder="Déposer un message...">
					  <span class="input-group-btn">
						<button type="submit" class="btn btn-default">Poster</button>
					  </span>
					</div>
				  </form>
				</div>
			  	<ul class="list-group msgTable" id="zoneMsgTable">
				</ul>

			  <script type="text/html" id="templateZoneMsgTable">
			  <li class="list-group-item msgItem" data-template-bind='[{"attribute": "data-id", "value": "msgId"}]'>
	  			<p class="pull-right small">
	  				<span data-content="msgDate" data-format="formatDateMsg"></span> - <strong><span class="label label-info" data-content="userName"></span></strong>
	  			</p>
	  			<p>
	  				<strong><span data-content="matTypeName"></span> <span data-content="eqRealName"></span></strong>
	  			</p>
	  			<p data-content="msgContent"></p>
			</li>
			  </script>
			</div>
		</div>
    </div>
    
    
    <div role="tabpanel" class="tab-pane" id="equipements">
		
		<button type="button" class="btn btn-xs btn-primary editMultipleStateBtn">Modifier tous les états</button>
		<div class="eqTable" role="tablist" aria-multiselectable="true" id="zoneEqTable">
		</div>
		<script type="text/html" id="templateZoneEqTable">
		  <div class="panel panel-default eqLogicItem" data-template-bind='[{"attribute": "data-id", "value": "eqLogicId"}]'>
		    <div class="panel-heading" role="tab" data-template-bind='[{"attribute": "id", "value": "eqLogicId", "formatter": "prepend", "formatOptions": "headingZoneEq"}]'>
		      <h4 class="panel-title">
		        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#zoneEqTable" aria-expanded="false" data-template-bind='[{"attribute": "href", "value": "eqLogicId", "formatter": "prepend", "formatOptions": "#collapseZoneEq"},{"attribute": "aria-controls", "value": "eqLogicId", "formatter": "prepend", "formatOptions": "collapseZoneEq"}]'>
		          <div class="row">
			          <div class="col-sm-8">
			          	<span data-content="matTypeName"></span> - <span data-content="eqRealName"></span>
			          </div>
			          <div class="col-sm-4">
			          	<span data-template-bind='[{"attribute": "class", "value": "eqLogicState", "formatter": "formatStateColorClass", "formatOptions": "eqLogicLabel label label"},{"attribute": "content", "value": "eqLogicState", "formatter": "formatState"}]'></span>
			          </div>
		          </div>
		        </a>
		      </h4>
		    </div>
		    <div class="panel-collapse collapse" role="tabpanel" data-template-bind='[{"attribute": "id", "value": "eqLogicId", "formatter": "prepend", "formatOptions": "collapseZoneEq"},{"attribute": "aria-labelledby", "value": "eqLogicId", "formatter": "prepend", "formatOptions": "headingZoneEq"}]'>
		    	<div class="panel-body">
		    		<div class="row">
			    		<div class="col-sm-6">
			    			<div class="panel panel-default">
								<div class="panel-heading">Informations</div>
								<div class="panel-body">
					    			<div class="row">
									  <div class="col-xs-2"><label class="control-label">Etat:</label></div>
									  <div class="col-xs-10">
									  	<button type="button" style="width: 100%;font-weight: bold;" data-template-bind='[{"attribute": "class", "value": "eqLogicState", "formatter": "formatStateColorClass", "formatOptions": "editStateBtn btn btn-xs btn"},{"attribute": "content", "value": "eqLogicState", "formatter": "formatState"}, {"attribute": "data-eqLogic-id", "value": "eqLogicId"}, {"attribute": "data-eqLogic-state", "value": "eqLogicState"}]'></span>
									  </div>
									</div>
					    			<div class="row">
					    				<div class="col-xs-12 eqLogicListAttribute" data-template-bind='[{"attribute": "data-eq-logic-id", "value": "eqLogicId"}]'>
					    				</div>
									</div>
									<div class="row">
									  <div class="col-sm-2"><label class="control-label">Liens:</label></div>
									  <div class="col-sm-10 eqLinkTable" data-template-bind='[{"attribute": "data-eq-logic-id", "value": "eqLogicId"}]'></div>
									</div>
								</div>
							</div>
			    		</div>
			    		<div class="col-sm-6">
			    			<div class="panel panel-default">
								<div class="panel-heading">Commentaire</div>
								<div class="panel-body" data-content="eqLogicComment"></div>
							</div>
			    		</div>
			    	</div>
			    	<div class="row">
			    		<div class="col-sm-12">
			    			<div class="panel panel-default">
								<div class="panel-heading">Main courante</div>
								<div class="panel-body">
					    			<form class="form-horizontal msgForm" data-template-bind='[{"attribute": "data-zone-id", "value": "zoneId"},{"attribute": "data-eqLogic-id", "value": "eqLogicId"}]'>
							            <div class="input-group">
									      <input type="text" class="form-control msgFormInput" placeholder="Déposer un message...">
									      <span class="input-group-btn">
									        <button type="submit" class="btn btn-default">Poster</button>
									      </span>
									    </div>
								    </form>
								</div>
							</div>
			    		</div>
			    	</div>
			    </div>
		    </div>
		  </div>
		</script>
		<script type="text/html" id="templateEqLinkTable">
				<div class="row">
				  <div class="col-xs-2"><span class="label label-primary" data-content="eqLinkType"></span></div>
				  <div class="col-xs-10"><span class="label label-info"><span data-content="eqLinkTargetEqLogicZoneName"></span> <span data-content="eqLinkTargetEqLogicMatTypeName"></span> <span data-content="eqLinkTargetEqLogicEqRealName"></span></span></div>
				</div>
		</script>

		<script type="text/html" id="templateEqConfigurationEqLogicAttribute">
			<div class="row">
			  <div class="col-xs-2"><label class="control-label" data-content="matTypeAttributeName"></label></div>
			  <div class="col-xs-10"><span class="label label-info" data-content="eqLogicAttributeValue"></span></div>
			</div>
		</script>
    </div>
    <div role="tabpanel" class="tab-pane" id="carte">
      <div class="modalMap" data-template-bind='[{"attribute": "id", "value": "modalId", "formatter": "prepend", "formatOptions": "mapZone"}]'></div>
    </div>
  </div>
</div>