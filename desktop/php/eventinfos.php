<div class="row" id='eventinfos'>
	<ul class="nav nav-tabs" role="tablist">
		<li role="presentation" class="active"><a href="#general" aria-controls="general" role="tab" data-toggle="tab">Général</a></li>
		<li role="presentation" class=""><a href="#contact" aria-controls="contact" role="tab" data-toggle="tab">Contacts</a></li>
		<li role="presentation" class=""><a href="#configuration" aria-controls="configuration" role="tab" data-toggle="tab">Configuration</a></li>
		<li role="presentation" class=""><a href="#plan" aria-controls="plan" role="tab" data-toggle="tab">Plan</a></li>
	</ul>
	
	<!-- Tab panes -->
	<div class="tab-content panel-body">
		<div role="tabpanel" class="tab-pane active" id="general">
			<button type="button" class="btn btn-primary pull-right hidden-xs" id="editEventInfoBtn"><span class="glyphicon glyphicon-pencil"></span> Editer</button>
			<button type="button" class="btn btn-success pull-right" id="validEventInfoBtn"><span class="glyphicon glyphicon-pencil"></span> Valider</button>
			
			<div id="eventInfosContainer"></div>
			
			<div id="eventInfosEditorContainer">
				<textarea id="eventInfosTextarea" style="width: 100%; height: 400px; font-size: 14px; line-height: 18px;"></textarea>
			</div>
		</div>
		
		
		<div role="tabpanel" class="tab-pane" id="contact">
			<ul class="list-group contactTable" id="eventInfoContactTable">
			</ul>
			<script type="text/html" id="templateEventInfoContactTable">
				<li class="list-group-item msgItem" data-template-bind='[{"attribute": "data-id", "value": "msgId"}]'>
		  			<div class="row">
			  			<div class="col-xs-8 col-md-5">
							<strong><span data-content="contactName"></span></strong><br>
							<small><span data-content="contactFct"></span></small>
						</div>
						<div class="col-md-3 hidden-xs" data-template-bind='[{"attribute": "content", "value": "contactZones", "formatter": "formatListWithZoneName", "formatOptions": "<span class=\"label label-default\"></span>"}]'></div>
						<div class="col-md-3 hidden-xs" data-template-bind='[{"attribute": "content", "value": "contactCoord", "formatter": "formatList", "formatOptions": "<span class=\"label label-default\"></span>"}]'></div>
						<div class="col-xs-4 col-md-1" style="text-align: right;">
							<button type="button" class="btn btn-warning btn-xs editMissionBtn" data-template-bind='[{"attribute": "data-mission-id", "value": "missionId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button> 
							<button type="button" class="btn btn-danger btn-xs deleteMissionBtn" data-template-bind='[{"attribute": "data-mission-id", "value": "missionId"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
						</div>
					</div>
					<div class="row hidden-sm hidden-md hidden-lg">
						<div class="col-xs-6" data-template-bind='[{"attribute": "content", "value": "contactZones", "formatter": "formatListWithZoneName", "formatOptions": "<span class=\"label label-default\"></span>"}]'></div>
						<div class="col-xs-6" data-template-bind='[{"attribute": "content", "value": "contactCoord", "formatter": "formatList", "formatOptions": "<span class=\"label label-default\"></span>"}]'></div>
		  			</div>
				</li>
			</script>
		</div>
		
		
		<div role="tabpanel" class="tab-pane" id="configuration">...</div>
		
		
		<div role="tabpanel" class="tab-pane" id="plan">
			<div id="eventMapPlanConfig" style="width: 100%; height: 400px;"></div>
		</div>
	</div>
</div>
