<div class="well">
  <form class="form-horizontal msgForm">
    <div class="input-group">
      <input type="text" class="form-control msgFormInput" placeholder="Déposer un message...">
      <span class="input-group-btn">
        <button type="submit" class="btn btn-default">Poster</button>
      </span>
    </div>
  </form>
</div>

<div class="panel panel-primary" id="maincourante">
  	<div class="panel-heading">
  		Main courante
      <button type="button" class="btn btn-xs btn-info next pull-right"><span class="glyphicon glyphicon-triangle-right small"></span></button>
      <button type="button" class="btn btn-xs btn-info previous pull-right"><span class="glyphicon glyphicon-triangle-left small"></span></button>
      
  	</div>
  	<ul class="list-group msgTable" id="msgTable">
	</ul>
	
	<script type="text/html" id="templateMsgTable">
	  	<li class="list-group-item msgItem" data-template-bind='[{"attribute": "data-id", "value": "msgId"}]'>
  			<p class="pull-right small">
  				<span data-content="msgDate" data-format="formatDateMsg"></span> - <strong><span class="label label-info" data-content="userName"></span></strong>
  			</p>
  			<p>
  				<label class="label label-default" data-content="zoneName"></label>
  			</p>
  			<p>
  				<strong><span data-content="matTypeName"></span> <span data-content="eqRealName"></span></strong>
  			</p>
  			<p data-content="msgContent"></p>
		</li>
    </script>
</div>
