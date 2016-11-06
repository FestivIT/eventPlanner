<div id="wrap">
    <div class="container">
	    <div class="panel panel-default">
		  	<div class="panel-heading">
		    	<h3 class="panel-title">Identification</h3>
		  	</div>
		  	<div class="panel-body">
				<center>
          			<div style="display: none;width : 100%" id="div_alert"></div>
		          	<div style="width:300px">
		                <input class="form-control" type="text" id="in_login_username" placeholder="Nom d'utilisateur"/><br/>
		            	<input class="form-control" type="password" id="in_login_password" placeholder="Mot de passe" style="margin-top:10px;" />
		            	<input type="checkbox" id="cb_storeConnection" style="margin-top:10px;" /> Enregistrer cet ordinateur<br/>
						<button class="btn-lg btn-primary btn-block" id="bt_login_validate" style="margin-top: 10px;"><i class="fa fa-sign-in"></i> Connexion</button>
					</div>
	    		</center>
	    	</div>
		</div>
	</div>
</div>
<script>
    $('#bt_login_validate').on('click', function() {
        eventplanner.user.login({
            username: $('#in_login_username').val(),
            password: $('#in_login_password').val(),
            storeConnection: $('#cb_storeConnection').value(),
            error: function (error) {
                $('#div_alert').showAlert({message: error.message, level: 'danger'});
            },
            success: function (data) {
                window.location.href = 'index.php?v=d';
            }
        });
    });

    $('#in_login_password').keypress(function(e) {
      if(e.which == 13) {
         $('#bt_login_validate').trigger('click');
     }
 });

    $('#in_twoFactorCode').keypress(function(e) {
      if(e.which == 13) {
        $('#bt_login_validate').trigger('click');
    }
});
</script>