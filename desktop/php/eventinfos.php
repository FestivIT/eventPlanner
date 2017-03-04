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
			<div class="well">
			<button type="button" class="btn btn-success editContactBtn" data-contact-id="new">Ajouter un nouveau contact</button>
			</div>
			<ul class="list-group contactTable" id="eventInfoContactTable">
			</ul>
			<script type="text/html" id="templateEventInfoContactTable">
				<li class="list-group-item contactItem" data-template-bind='[{"attribute": "data-id", "value": "contactId"}]'>
		  			<div class="row">
			  			<div class="col-xs-8 col-sm-5">
							<strong><span data-content="contactName"></span></strong><br>
							<small><span data-content="contactFct"></span></small>
						</div>
						<div class="col-sm-3 hidden-xs">
							<span class="label label-default" data-content="zoneName"></span>
						</div>
						<div class="col-sm-3 hidden-xs" data-template-bind='[{"attribute": "content", "value": "contactId", "formatter": "formatContactCoord", "formatOptions": "templateContactCoord"}]'></div>
						<div class="col-xs-4 col-sm-1" style="text-align: right;">
							<button type="button" class="btn btn-warning btn-xs editContactBtn" data-template-bind='[{"attribute": "data-contact-id", "value": "contactId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button> 
							<button type="button" class="btn btn-danger btn-xs deleteContactBtn" data-template-bind='[{"attribute": "data-contact-id", "value": "contactId"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
						</div>
					</div>
					<div class="row hidden-sm hidden-md hidden-lg">
						<div class="col-xs-6">
							<span class="label label-default" data-content="zoneName"></span>
						</div>
						<div class="col-xs-6" data-template-bind='[{"attribute": "content", "value": "contactId", "formatter": "formatContactCoord", "formatOptions": "templateContactCoord"}]'></div>
		  			</div>
				</li>
			</script>
			<script type="text/html" id="templateContactCoord">
				 <span class="label label-info">
				 	<span data-content="type"></span>: 
				 	<span data-content="value"></span>
				 </span><br>
			</script>
		</div>
		
		
		<div role="tabpanel" class="tab-pane" id="configuration">...</div>
		
		
		<div role="tabpanel" class="tab-pane" id="plan">
			<div id="eventMapPlanConfig" style="width: 100%; height: 400px;"></div>
		</div>
	</div>
</div>
