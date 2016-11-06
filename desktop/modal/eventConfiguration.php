<form class="form-horizontal" id="eventForm">
  <div class="form-group">
    	<label for="eventName" class="col-sm-3 control-label">Nom</label>
    	<div class="col-sm-9">
    		<input type="text" class="form-control" id="eventName" placeholder="Nom - Edition" data-value="name">
    	</div>
  </div>
  <div class="form-group">
		<label for="eventVille" class="col-sm-3 control-label" >Ville</label>
		<div class="col-sm-9">
      		<div class="input-group">
            <input type="text" class="form-control" id="eventVille" placeholder="Ville" data-value="ville">
            <span class="input-group-btn">
              <button class="btn btn-secondary" type="button" id="placeOnMap">Placer sur la carte</button>
            </span>
          </div>
      	</div>
  </div>
  <div class="form-group" id="mapDiv">
    <label class="col-sm-3 control-label" data-template-bind='[{"attribute": "for", "value": "modalId", "formatter": "prepend", "formatOptions": "mapEvent"}]'>Localisation</label>
    <div class="col-sm-9">
          <div class="modalMap" data-template-bind='[{"attribute": "id", "value": "modalId", "formatter": "prepend", "formatOptions": "mapEvent"}]'></div>
        </div>
  </div>
  <div class="form-group">
  		<label for="eventDate" class="col-sm-3 control-label" >Dates</label>
  		<div class="col-sm-9">
			<div class="input-group">
				<div class="input-daterange input-group" id="datepicker">
				    <input type="text" class="input-sm form-control" id="eventStartDate" placeholder="Début" data-value="startDate" data-format="formatDateYmd2Dmy" data-format-target="value"/>
				    <span class="input-group-addon">à</span>
				    <input type="text" class="input-sm form-control" id="eventEndDate" placeholder="Fin" data-value="endDate" data-format="formatDateYmd2Dmy" data-format-target="value"/>
				</div>
			</div>
		</div>
  </div>
  <div class="form-group">
    <div class="col-sm-offset-3 col-sm-9">
      <input type="text" id="eventId" style="display: none;" data-value="id" >
      <button type="submit" class="btn btn-success">Sauvegarder</button>
    </div>
  </div>
</form>