<div id="maincourante">
	<nav class="navbar navbar-default epContextualNavBar">
		<div class="container-fluid">
			<div class="navbar-header">
				<a class="navbar-brand">Main courante</a>
				<div class="pull-right visible-xs">
					<button type="button" class="btn navbar-btn btn-info btn-sm previous"><span class="glyphicon glyphicon-triangle-left small"></span></button>
			    	<button type="button" class="btn navbar-btn btn-info btn-sm next"><span class="glyphicon glyphicon-triangle-right small"></span></button>
			    </div>
		    </div>

		    <form class="navbar-form navbar-left searchMsgForm">
				<div class="input-group">
					<span class="input-group-addon">Filtre: </span>
					<input type="text" class="form-control input-sm" id="searchMsgInput" placeholder="Logistique, Routeur, UBNT105, Fred...">
					<span class="input-group-btn">
				        <button class="btn btn-danger btn-sm" type="button" id="searchMsgClear"><i class="glyphicon glyphicon-remove"></i></button>
				    </span>
				</div>
			</form>

		    <form class="navbar-form navbar-right msgForm">
				<div class="input-group">
					<input type="text" class="form-control msgFormInput input-sm" placeholder="Déposer un message...">
					<span class="input-group-btn">
						<button type="submit" class="btn btn-default btn-sm">Poster</button>
					</span>
				</div>
			</form>

			<div class="nav navbar-nav navbar-right hidden-xs">
				<button type="button" class="btn navbar-btn btn-info btn-sm previous"><span class="glyphicon glyphicon-triangle-left small"></span></button>
		    	<button type="button" class="btn navbar-btn btn-info btn-sm next"><span class="glyphicon glyphicon-triangle-right small"></span></button>
		    </div>
		</div>
	</nav>
	
  	<ul class="list-group msgTable" id="msgTable">
	</ul>
	
	<script type="text/html" id="templateMsgTable">
	  	<li class="list-group-item msgItem" data-template-bind='[{"attribute": "data-id", "value": "msgId"}]'>
  			<p class="pull-right small">
  				<span data-content="msgDate" data-format="formatDateMsg"></span>
  				<strong><span class="label label-info" data-content="userName"></span></strong>
  			</p>
  			<p>
  				<label class="label label-default" data-content="zoneName"></label>
  			</p>
  			<p>
  				<strong><span data-content="matTypeName"></span> <span data-content="eqRealName"></span></strong>
  			</p>
  			<p data-template-bind='[{"attribute": "content", "value": "msgId", "formatter": "formatMsgContent", "formatOptions": "templateMsgContent"}]'></p>
		</li>
    </script>

    <script type="text/html" class="templateMsgContent" msg-content-type="text">
	  	<p data-content="value"></p>
	</script>
	<script type="text/html" class="templateMsgContent" msg-content-type="msgPhoto">
	  	<img class="img-rounded msgPhoto" data-template-bind='[{"attribute": "src", "value": "fileName", "formatter": "prepend", "formatOptions": "ressources/msgPhoto/"}]'/>
	</script>
</div>
