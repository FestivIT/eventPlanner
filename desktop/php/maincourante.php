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
  	</div>
	<table class="msgTable" id="msgTable"> <!-- bootstrap classes added by the uitheme widget -->
	  <thead>
	    <tr style="display: none;">
	      <!--
	      <th style="width: 140px;">Date</th>
	      <th style="width: 100px;">Zone</th>
	      <th style="width: 170px;">Equipement</th>
	      -->
	      <th>Message</th>
	    </tr>
	  </thead>
	  <tfoot>
	    <tr>
	      <th colspan="9" class="ts-pager form-horizontal">
	        <button type="button" class="btn first"><i class="icon-step-backward glyphicon glyphicon-step-backward"></i></button>
	        <button type="button" class="btn prev"><i class="icon-arrow-left glyphicon glyphicon-backward"></i></button>
	        <span class="pagedisplay"></span>
	        <button type="button" class="btn next"><i class="icon-arrow-right glyphicon glyphicon-forward"></i></button>
	        <button type="button" class="btn last"><i class="icon-step-forward glyphicon glyphicon-step-forward"></i></button>
	        <select class="pagesize input-mini" title="Select page size">
	          <option selected="selected" value="10">10</option>
	          <option value="20">20</option>
	          <option value="40">40</option>
	          <option value="20">60</option>
	          <option value="20">80</option>
	        </select>
	        <select class="pagenum input-mini" title="Select page number"></select>
	      </th>
	    </tr>
	  </tfoot>
	  <tbody>
	  </tbody>
	</table>
	<script type="text/html" id="templateMsgTable">
		<tr>
			<td>
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
	  		</td>
  		</tr>
    </script>
	<!--
	<script type="text/html" id="templateMsgTable">
			<tr>
				<td data-content="msgDate"></td>
				<td data-content="zoneName"></td>
				<td><span data-content="matTypeName"></span> - <span data-content="eqRealName"></span></td>
				<td>[<span data-content="userName"></span>] <span data-content="msgContent"></span></td>
			</tr>
		</script>
	-->
</div>
