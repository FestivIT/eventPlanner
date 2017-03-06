<div id='planning'>
  	<nav class="navbar navbar-default epContextualNavBar">
		<div class="container-fluid">
			<div class="navbar-header">
		    	<a class="navbar-brand" href="#">Planning</a>
				<div class="pull-right visible-xs">
					<div class="btn-group">
		    			<button type="button" class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							Trier <span class="caret"></span>
						</button>
						<ul class="dropdown-menu">
							<li><a href="#" class="planningSortBy" data-sortby="zoneName" data-sortorder="asc"><span class="glyphicon glyphicon-sort-by-alphabet"></span> Zone</a></li>
							<li><a href="#" class="planningSortBy" data-sortby="zoneName" data-sortorder="desc"><span class="glyphicon glyphicon-sort-by-alphabet-alt"></span> Zone</a></li>
							<li><a href="#" class="planningSortBy" data-sortby="zoneInstallDate" data-sortorder="asc"><span class="glyphicon glyphicon-sort-by-alphabet"></span> Date installation</a></li>
							<li><a href="#" class="planningSortBy" data-sortby="zoneInstallDate" data-sortorder="desc"><span class="glyphicon glyphicon-sort-by-alphabet-alt"></span> Date installation</a></li>
						</ul>
		    		</div>

					<button type="button" class="btn navbar-btn btn-info btn-sm showAllZone"><span class="glyphicon glyphicon-triangle-bottom"></span></button>
		    		<button type="button" class="btn navbar-btn btn-info btn-sm hideAllZone"><span class="glyphicon glyphicon-triangle-right"></span></button>
		    	
		    		<div class="btn-group">
						<button class="btn btn-success btn-sm dropdown-toggle" id="planningAction" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						    Actions
						    <span class="caret"></span>
						</button>
						<ul class="dropdown-menu" aria-labelledby="planningAction">
						    <li><a href="#" class="editMultipleStateBtn">Changer état équipements</a></li>
						    <li><a href="#" class="editMultipleZoneStateBtn">Changer état zones</a></li>
						    <li role="separator" class="divider"></li>
						    <li><a href="#" class="addMissionBtn">Créer une mission</a></li>
						</ul>
					</div>
				</div>
		    </div>
	    	
	    	<div class="nav navbar-nav navbar-left hidden-xs">
				<button type="button" class="btn btn-default btn-sm navbar-btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Trier <span class="caret"></span>
				</button>
				<ul class="dropdown-menu">
					<li><a href="#" class="planningSortBy" data-sortby="zoneName" data-sortorder="asc"><span class="glyphicon glyphicon-sort-by-alphabet"></span> Zone</a></li>
					<li><a href="#" class="planningSortBy" data-sortby="zoneName" data-sortorder="desc"><span class="glyphicon glyphicon-sort-by-alphabet-alt"></span> Zone</a></li>
					<li><a href="#" class="planningSortBy" data-sortby="zoneInstallDate" data-sortorder="asc"><span class="glyphicon glyphicon-sort-by-alphabet"></span> Date installation</a></li>
					<li><a href="#" class="planningSortBy" data-sortby="zoneInstallDate" data-sortorder="desc"><span class="glyphicon glyphicon-sort-by-alphabet-alt"></span> Date installation</a></li>
				</ul>
			</div>

			<form class="navbar-form navbar-left planningSearchPanel">
				<div class="input-group">
					<span class="input-group-addon">Filtre: </span>
				  	<input type="text" class="form-control input-sm" id="planningSearch" placeholder="Filtre: Logistique, Routeur, UBNT105, 192.168.0.1...">
				  	<span class="input-group-btn">
				        <button class="btn btn-danger btn-sm" type="button" id="planningSearchClear"><i class="glyphicon glyphicon-remove"></i></button>
				    </span>
				</div>
			</form>

			<div class="nav navbar-nav navbar-right hidden-xs">
				<button type="button" class="btn navbar-btn btn-info btn-sm hidden-xs showAllZone"><span class="glyphicon glyphicon-triangle-bottom"></span></button>
	    		<button type="button" class="btn navbar-btn btn-info btn-sm hidden-xs hideAllZone"><span class="glyphicon glyphicon-triangle-right"></span></button>
	    	
	    		<div class="btn-group">
					<button class="btn btn-success btn-sm dropdown-toggle" id="planningAction" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					    Actions
					    <span class="caret"></span>
					</button>
					<ul class="dropdown-menu" aria-labelledby="planningAction">
					    <li><a href="#" class="editMultipleStateBtn">Changer état équipements</a></li>
					    <li><a href="#" class="editMultipleZoneStateBtn">Changer état zones</a></li>
					    <li role="separator" class="divider"></li>
					    <li><a href="#" class="addMissionBtn">Créer une mission</a></li>
					</ul>
				</div>
	    	</div>
			
		</div>
	</nav>
  	
  	
  		<div id="planningTable" class="panel-group eqLogicTable zoneTable" role="tablist" aria-multiselectable="true"></div>

  		<script type="text/html" id="templatePlanningTableZone">
  		<div class="panel panel-default zoneItem" data-template-bind='[{"attribute": "data-id", "value": "zoneId"}]'>
		    <div class="panel-heading" role="tab" data-template-bind='[{"attribute": "id", "value": "zoneId", "formatter": "prepend", "formatOptions": "headingPlanningZone"}]'>
		      <h4 class="panel-title">
		      	<div class="row">
		      		<div class="col-xs-11 col-sm-9">
						<div class="row">
							<div class="col-xs-12 col-sm-6">
								<button type="button" class="btn btn-success btn-xs zoneBtn" data-template-bind='[{"attribute": "data-zone-id", "value": "zoneId"}]'><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span></button>
								<a role="button" data-toggle="collapse" aria-expanded="true" data-template-bind='[{"attribute": "href", "value": "zoneId", "formatter": "prepend", "formatOptions": "#collapsePlanningZone"},{"attribute": "aria-controls", "value": "zoneId", "formatter": "prepend", "formatOptions": "collapsePlanningZone"}]'>
				      				<strong class="planningZoneName" data-content="zoneName" ></strong>
				      			</a>
							</div>
							<div class="col-sm-6 hidden-xs">
								<span data-content="zoneInstallDate" data-format="formatDateYmd2Dmy"></span>
								<span class="glyphicon glyphicon-arrow-right"></span>
								<span data-content="zoneUninstallDate" data-format="formatDateYmd2Dmy"></span>
							</div>
						</div>
					</div>
					<div class="col-sm-2 hidden-xs">
						<button type="button" style="width: 100%;font-weight: bold;" data-template-bind='[{"attribute": "class", "value": "zoneState", "formatter": "formatStateColorClass", "formatOptions": "editZoneStateBtn btn btn-xs btn"},{"attribute": "content", "value": "zoneState", "formatter": "formatState"}, {"attribute": "data-zone-id", "value": "zoneId"}, {"attribute": "data-zone-state", "value": "zoneState"}]'></span>
					</div>
					<div class="col-xs-1 col-sm-1" style="padding-left: 0px;">
						<input type="checkbox" class="planningZoneCb pull-right" data-template-bind='[{"attribute": "data-zone-id", "value": "zoneId"}, {"attribute": "data-zone-state", "value": "zoneState"}]'>
					</div>
		      	</div>
		      	<div class="row">
					<div class="col-xs-5 hidden-sm hidden-md hidden-lg">
						<small>
							Install: <span data-content="zoneInstallDate" data-format="formatDateYmd2Dmy"></span></br>
							Désinst: <span data-content="zoneUninstallDate" data-format="formatDateYmd2Dmy"></span>
						</small>
					</div>
					<div class="col-xs-6 col-sm-2 hidden-sm hidden-md hidden-lg">
						<button type="button" style="width: 100%;font-weight: bold;" data-template-bind='[{"attribute": "class", "value": "zoneState", "formatter": "formatStateColorClass", "formatOptions": "editZoneStateBtn btn btn-xs btn"},{"attribute": "content", "value": "zoneState", "formatter": "formatState"}, {"attribute": "data-zone-id", "value": "zoneId"}, {"attribute": "data-zone-state", "value": "zoneState"}]'></span>
					</div>
		      	</div>		      		
		      </h4>
		    </div>
		    <div class="panel-collapse collapse" role="tabpanel" data-template-bind='[{"attribute": "id", "value": "zoneId", "formatter": "prepend", "formatOptions": "collapsePlanningZone"},{"attribute": "aria-labelledby", "value": "zoneId", "formatter": "prepend", "formatOptions": "headingPlanningZone"}]'>
		      <ul class="list-group zoneEqList"></ul>
		    </div>
		  </div>
		</script>

		<script type="text/html" id="templatePlanningTableEq">
			<li data-template-bind='[{"attribute": "data-id", "value": "eqLogicId"}, {"attribute": "class", "value": "eqLogicState", "formatter": "formatStateColorClass", "formatOptions": "eqLogicItem list-group-item list-group-item"}]'>
				<div class="row">
					<div class="col-xs-5 col-sm-4">
						<div class="row">
							<div class="col-sm-6">
								<span class="label label-default" data-content="matTypeName"></span>
							</div>
							<div class="col-sm-6">
								<span data-content="eqRealName"></span>
							</div>
						</div>
					</div>
					<div class="col-sm-2 hidden-xs" data-template-bind='[{"attribute": "content", "value": "eqLogicId", "formatter": "formatEqLogicAttributes", "formatOptions": "templateEqLogicAttributes"}]'>
					</div>
					<div class="col-sm-3 hidden-xs">
						<span data-content="eqLogicComment"></span>
					</div>
					<div class="col-xs-6 col-sm-2">
						<button type="button" style="width: 100%;font-weight: bold;" data-template-bind='[{"attribute": "class", "value": "eqLogicState", "formatter": "formatStateColorClass", "formatOptions": "editStateBtn btn btn-xs btn"},{"attribute": "content", "value": "eqLogicState", "formatter": "formatState"}, {"attribute": "data-eqLogic-id", "value": "eqLogicId"}, {"attribute": "data-eqLogic-state", "value": "eqLogicState"}]'></span>
					</div>
					<div class="col-xs-1 col-sm-1" style="padding-left: 0px;">
						<input type="checkbox" class="planningEqCb pull-right" data-template-bind='[{"attribute": "data-eqlogic-id", "value": "eqLogicId"}, {"attribute": "data-zone-id", "value": "zoneId"}, {"attribute": "data-eqlogic-state", "value": "eqLogicState"}]'>
					</div>			
				</div>
			</li>
		</script>
		<script type="text/html" id="templateEqLogicAttributes">
			<span class="label label-info">
				<span data-content="matTypeAttributeName"></span>: <span data-content="eqLogicAttributeValue"></span>
			</span><br>
		</script>
		
</div>