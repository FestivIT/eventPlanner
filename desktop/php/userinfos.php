<div id="userinfos">
	<nav class="navbar navbar-default epContextualNavBar">
		<div class="container-fluid">
			<div class="navbar-header">
		    	<a class="navbar-brand" href="#">Mon compte</a>
		    </div>
		</div>
	</nav>
	<div>
		<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
		  <div class="panel panel-default">
		    <div class="panel-heading" role="tab" id="headingUserInfo">
		      <h4 class="panel-title">
		        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseUserInfo" aria-expanded="true" aria-controls="collapseUserInfo">
		          Informations utilisateurs
		        </a>
		      </h4>
		    </div>
		    <div id="collapseUserInfo" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingUserInfo">
		      <div class="panel-body">
		        <form class="form-horizontal" id="userLoginForm">
				  <div class="form-group">
				      <label for="name" class="col-sm-2 control-label" >Nom</label>
				      <div class="col-sm-3">
				        <input type="text" class="form-control" id="userName" placeholder="Nom">
				      </div>
				  </div>
				  <div class="form-group">
				      <label for="login" class="col-sm-2 control-label" >Login</label>
				      <div class="col-sm-3">
				        <input type="text" class="form-control" id="userLogin" placeholder="Login">
				      </div>
				  </div>
				  <div class="form-group">
				      <label for="userPassword1" class="col-sm-2 control-label">Modifier mot de passe</label>
				      <div class="col-sm-3">
				        <input type="password" class="form-control" id="userPassword1" placeholder="********">
				      </div>
				  </div>
				  <div class="form-group">
				      <label for="userPassword2" class="col-sm-2 control-label" >Confirmer mot de passe</label>
				      <div class="col-sm-3">
				        <input type="password" class="form-control" id="userPassword2" placeholder="********">
				      </div>
				  </div>
				  <div class="form-group">
				    <div class="col-sm-offset-2 col-sm-3">
				      <button type="submit" class="btn btn-success">Sauvegarder</button>
				    </div>
				  </div>
				</form>
		      </div>
		    </div>
		  </div>

		  <div class="panel panel-default">
		  	<div class="panel-heading" role="tab" id="headingSlack">
		      <h4 class="panel-title">
		        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseSlack" aria-expanded="true" aria-controls="collapseSlack">
		          Interface Slack
		        </a>
		      </h4>
		    </div>
		    <div id="collapseSlack" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingSlack">
		      <div class="panel-body">
		        <form class="form-horizontal" id="userSlackForm">
				  <div class="form-group">
				      <label for="name" class="col-sm-2 control-label" >Slack ID</label>
				      <div class="col-sm-3">
				        <input type="text" class="form-control" id="userSlackID" placeholder="Slack ID">
				      </div>
				  </div>
				  <div class="form-group">
				    <div class="col-sm-offset-2 col-sm-3">
				      <button type="submit" class="btn btn-success">Sauvegarder</button>
				    </div>
				  </div>
				</form>
		      </div>
		    </div>
		  </div>

		  <div class="panel panel-default">
		    <div class="panel-heading" role="tab" id="headingScan">
		      <h4 class="panel-title">
		        <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseScan" aria-expanded="false" aria-controls="collapseScan">
		          Scan des équipements
		        </a>
		      </h4>
		    </div>
		    <div id="collapseScan" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingScan">
		      <div class="panel-body">
		        <form class="form-horizontal" id="userScanForm">
				  <div class="form-group">
				      <label for="scanSelect" class="col-sm-2 control-label" >Lorsque je scan un équipement</label>
				      <div class="col-sm-6">
				        <select class="form-control" name="scanSelect" id="scanSelect">
				        	<option value="zone">Ouvrir le détail de la zone</option>
				        	<optgroup label="Changer l'état de l'équipement" id="eqStateList">
				        		<option value="eqStateSelect">Demander l'état à appliquer</option>
				        	</optgroup>
				        	<optgroup label="Changer l'état du matériel" id="eqRealStateList">
				        		<option value="eqRealStateSelect">Demander l'état à appliquer</option>
				        	</optgroup>
				        </select>
				        <script type="text/html" id="templateStateSelectOptions">
					        <option data-template-bind='[{"attribute": "value", "value": "id"}]' data-content="text"></option>
					    </script>
				      </div>
				  </div>
				  <div class="form-group">
				    <div class="col-sm-offset-2 col-sm-6">
				      <input type="text" id="userId" style="display: none;" data-value="userId">
				      <button type="submit" class="btn btn-success">Sauvegarder</button>
				    </div>
				  </div>
				</form>
		      </div>
		    </div>
		  </div>
		</div>
	</div>
</div>
