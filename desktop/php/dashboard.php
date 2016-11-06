<div class="row" id="dashboard">
	<div class="col-sm-6">
		<div class="panel panel-primary">
		  <div class="panel-heading">
		    <h3 class="panel-title">Evenements du moment:</h3>
		  </div>
		  <ul class="list-group" id="eventList"></ul>
		</div>
	</div>
	<script type="text/html" id="templateEventList">
		<a href="#" class="list-group-item selectEventBtn" data-template-bind='[{"attribute": "data-event-id", "value": "id"}]' data-content-append="name"><span class="glyphicon glyphicon-chevron-right pull-right"></span></a>
	</script>
	
	
</div>
<?php
	//include_file('desktop', 'dashboard', 'js');
?>