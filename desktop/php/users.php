<div id="users">
	<nav class="navbar navbar-default epContextualNavBar">
		<div class="container-fluid">
			<div class="navbar-header">
		    	<a class="navbar-brand">Utilisateurs</a>
		    	<div class="pull-right visible-xs">
		    		<button type="button" class="btn navbar-btn btn-success editUserBtn btn-sm" data-user-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
		    	</div>
		    </div>
			
			<div class="nav navbar-nav navbar-right hidden-xs">
	    		<button type="button" class="btn navbar-btn btn-success editUserBtn btn-sm" data-user-id="new"><span class="glyphicon glyphicon-plus-sign"></span> Ajouter</button>
	    	</div>
		</div>
	</nav>

	<div class="screenContainer">
		<table class="table table-striped table-hover table-condensed userTable" id="userTable">
			<thead>
				<tr>
					<th>Nom</th>
					<th class="text-right">Actions</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
	<script type="text/html" id="templateUserTable">
		<tr class="userItem" data-template-bind='[{"attribute": "data-id", "value": "userId"}]'>
			<th class="col-xs-11" scope="row" data-content="userName"></th>
			<td class="col-xs-1" style="text-align: right;">
				<button type="button" class="btn btn-warning btn-xs editUserBtn" data-template-bind='[{"attribute": "data-user-id", "value": "userId"}]' title="Modifier"><span class="glyphicon glyphicon-pencil"></span></button>
				<button type="button" class="btn btn-danger btn-xs deleteUserBtn" data-template-bind='[{"attribute": "data-user-id", "value": "userId"}]' title="Supprimer"><span class="glyphicon glyphicon-remove"></span></button>
			</td>
		</tr>
	</script>


</div>


