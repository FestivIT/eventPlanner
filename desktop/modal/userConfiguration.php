<form class="form-horizontal" id="userForm">
  <div class="form-group">
      <label for="name" class="col-sm-3 control-label" >Nom</label>
      <div class="col-sm-9">
        <input type="text" class="form-control" id="userName" placeholder="Nom" data-value="name">
      </div>
  </div>
  <div class="form-group">
      <label for="login" class="col-sm-3 control-label" >Login</label>
      <div class="col-sm-9">
        <input type="text" class="form-control" id="userLogin" placeholder="Login" data-value="login">
      </div>
  </div>
  <div class="form-group">
      <label for="userEnable" class="col-sm-3 control-label" >Activé</label>
      <div class="col-sm-9">
        <input type="checkbox" id="userEnable">
      </div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-3 col-sm-9">
      <input type="text" id="userId" style="display: none;" data-value="id">
      <button type="submit" class="btn btn-success">Sauvegarder</button>
    </div>
  </div>
</form>