<div id="mission">
	<nav class="navbar navbar-default epContextualNavBar">
		<div class="container-fluid">
			<div class="nav navbar-nav navbar-left">
		    	<a class="navbar-brand">Contacts</a>
		    	<div class="pull-right hidden-sm hidden-sm hidden-lg">
		    		<button type="button" class="btn navbar-btn btn-success editContactBtn btn-sm" data-contact-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
		    	</div>
		    </div>
			
			<div class="nav navbar-nav navbar-right hidden-xs">
	    		<button type="button" class="btn navbar-btn btn-success editContactBtn btn-sm" data-contact-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
	    	</div>
		</div>
	</nav>

	<ul class="list-group contactTable" id="contactTable">
	</ul>
	<script type="text/html" id="templateContactTable">
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
		 	<span data-content="type"></span>: <span data-content="value"></span>
		 </span><br>
	</script>


</div>


