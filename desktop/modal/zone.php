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
		<div class="col-sm-6">
			<legend>Informations</legend>
			<div class="row">
			  <div class="col-xs-4"><label class="control-label">Etat:</label></div>
			  <div class="col-xs-8"><button type="button" style="font-weight: bold;" data-template-bind='[{"attribute": "class", "value": "state", "formatter": "formatStateColorClass", "formatOptions": "editStateBtn btn btn-xs btn"},{"attribute": "content", "value": "state", "formatter": "formatState"}, {"attribute": "data-zone-id", "value": "id"}, {"attribute": "data-zone-state", "value": "state"}]'></span></div>
			</div>
			<div class="row">
			  <div class="col-xs-4"><label class="control-label">Installation:</label></div>
			  <div class="col-xs-8"><span class="label label-primary" data-content="installDate" data-format="formatDateYmd2Dmy"></span></div>
			</div>		
			<div class="row">
			  <div class="col-xs-4"><label class="control-label">Désinstallation:</label></div>
			  <div class="col-xs-8"><span class="label label-primary" data-content="uninstallDate" data-format="formatDateYmd2Dmy"></span></div>
			</div>
		</div>
		<div class="col-sm-6">
			<legend>Commentaire</legend>
			<div class="well well-sm" data-content="eqLogicComment" data-content="configuration" data-format="getConfigurationKey" data-format-options="comment"></div>
		</div>
		<div class="col-sm-12">    
			<div class="panel panel-primary">
				<div class="panel-heading"> 
				  <h3 class="panel-title">Main courante</h3>
				</div>
				<div>
				  <form class="form-horizontal msgForm" data-template-bind='[{"attribute": "data-zone-id", "value": "id"}]'>
					<div class="input-group">
					  <input type="text" class="form-control msgFormInput" placeholder="Déposer un message...">
					  <span class="input-group-btn">
						<button type="submit" class="btn btn-default">Poster</button>
					  </span>
					</div>
				  </form>
				</div>
			  <table class="table table-striped table-hover table-condensed msgTable" id="zoneMsgTable">
				<tbody></tbody>
			  </table>
			  <script type="text/html" id="templateZoneMsgTable">
				<tr>
					<td>
						<p class="pull-right small">
							<span data-content="msgDate" data-format="formatDateMsg"></span> - <strong><span data-content="userName"></span></strong>
						</p>
						<strong><span data-content="matTypeName"></span> <span data-content="eqRealName"></span></strong>
						<p data-content="msgContent"></p>
					</td>
				</tr>
			  </script>
			</div>
		</div>
    </div>
    
    
    <div role="tabpanel" class="tab-pane" id="equipements">
    	<legend>Equipements
    		<button type="button" class="btn btn-xs btn-primary pull-right editMultipleStateBtn">Modifier tous les états</button>
    	</legend>
    	
		<div class="panel-group eqTable" role="tablist" aria-multiselectable="true" id="zoneEqTable">
		</div>
		<script type="text/html" id="templateZoneEqTable">
		  <div class="panel panel-default">
		    <div class="panel-heading" role="tab" data-template-bind='[{"attribute": "id", "value": "eqLogicId", "formatter": "prepend", "formatOptions": "heading"}]'>
		      <h4 class="panel-title">
		        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#zoneEqTable" aria-expanded="false" data-template-bind='[{"attribute": "href", "value": "eqLogicId", "formatter": "prepend", "formatOptions": "#collapse"},{"attribute": "aria-controls", "value": "eqLogicId", "formatter": "prepend", "formatOptions": "collapse"}]'>
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
		    <div class="panel-collapse collapse" role="tabpanel" data-template-bind='[{"attribute": "id", "value": "eqLogicId", "formatter": "prepend", "formatOptions": "collapse"},{"attribute": "aria-labelledby", "value": "eqLogicId", "formatter": "prepend", "formatOptions": "heading"}]'>
		    	<div class="panel-body">
		    		<div class="col-sm-12">
		    			<legend>Main courante</legend>
		    			<form class="form-horizontal msgForm" data-template-bind='[{"attribute": "data-zone-id", "value": "zoneId"},{"attribute": "data-eqLogic-id", "value": "eqLogicId"}]'>
				            <div class="input-group">
						      <input type="text" class="form-control msgFormInput" placeholder="Déposer un message...">
						      <span class="input-group-btn">
						        <button type="submit" class="btn btn-default">Poster</button>
						      </span>
						    </div>
					    </form>
		    		</div>
		    		<div class="col-sm-6">
		    			<legend>Informations</legend>
		    			<div class="row">
						  <div class="col-xs-2"><label class="control-label">Etat:</label></div>
						  <div class="col-xs-10"><span data-template-bind='[{"attribute": "class", "value": "eqLogicState", "formatter": "formatStateColorClass", "formatOptions": "label label"},{"attribute": "content", "value": "eqLogicState", "formatter": "formatState"}]'></span><button type="button" class="btn btn-xs btn-primary pull-right editStateBtn"  data-template-bind='[{"attribute": "data-eqLogic-id", "value": "eqLogicId"}, {"attribute": "data-eqLogic-state", "value": "eqLogicState"}]'>Modifier</button></div>
						</div>
		    			<div class="row">
						  <div class="col-xs-2"><label class="control-label">IP:</label></div>
						  <div class="col-xs-10"><span class="label label-info" data-content="eqLogicIp"></span></div>
						</div>
						<div class="row">
						  <div class="col-xs-2"><label class="control-label">Liens:</label></div>
						  <div class="col-xs-10"><span class="label label-info">Glenmor - Rocket Omni</span><button type="button" class="btn btn-xs btn-primary pull-right">Orienter</button></div>
						</div>
		    		</div>
		    		<div class="col-sm-6">
		    			<legend>Commentaire</legend>
		    			<div class="well well-sm" data-content="eqLogicComment"></div>
		    		</div>
			    </div>
		    </div>
		  </div>
		</script>
    </div>
    <div role="tabpanel" class="tab-pane" id="carte">
      <div class="modalMap" data-template-bind='[{"attribute": "id", "value": "modalId", "formatter": "prepend", "formatOptions": "mapZone"}]'></div>
    </div>
  </div>
</div>