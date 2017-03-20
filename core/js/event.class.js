eventplanner.event = {
    dataReady: $.Deferred(),
    container: {},
    eventItem: function(_data){
        for (var prop in _data) {
            if (_data.hasOwnProperty(prop)) {
                this[prop] = _data[prop];
            }
        }

        if(!this.hasOwnProperty('eventId')){
            this.eventId = ''; // Nouveau event
        }
        if(!this.hasOwnProperty('eventOrganisationId')){
            throw new Error("eventOrganisationId manquant!");
        }
        if(!this.hasOwnProperty('eventDefaultEventLevelId')){
            this.eventDefaultEventLevelId = "";
        }
        if(!this.hasOwnProperty('eventName')){
            this.eventName = "";
        }
        if(!this.hasOwnProperty('eventLocalisation')){
            this.eventLocalisation = [48.856614, 2.352222];
        }
        if(!this.hasOwnProperty('eventVille')){
            this.eventVille = "";
        }
        if(!this.hasOwnProperty('eventStartDate')){
            this.eventStartDate = new Date().toISOString().slice(0,10);
        }
        if(!this.hasOwnProperty('eventEndDate')){
            this.eventEndDate = new Date().toISOString().slice(0,10);
        }
        if(!this.hasOwnProperty('eventGeneralInfo')){
            this.eventGeneralInfo = "";
        }
        if(!this.hasOwnProperty('eventConfiguration')){
            this.eventConfiguration = {};
        }

        this.remove = function(_params = {}){
            return eventplanner.event.remove($.extend(_params, {id: this.eventId}));
        }
        
        this.checkValues = function(){
        	if(this.eventOrganisationId == ""){
				throw new Error("Il n'y a pas d'organisation rattaché à l'événement.");
			}
			
			if(this.eventName == ""){
				throw new Error("Le nom de l'événement ne peut pas être vide.");
			}
			
		    if(this.eventVille == ""){
				throw new Error("La ville de l'événement ne peut pas être vide.");
			}
			
		    if(typeof this.eventLocalisation != 'object'){
				throw new Error("La localisation n'a pas le bon format.");
			}
			
		    if(this.eventStartDate == ""){
				throw new Error("La date de début n'a pas le bon format");
			}
			
		    if(this.eventEndDate == ""){
				throw new Error("La date de fin n'a pas le bon format");
			}
			
			return true;
        }
        
        this.getValues = function(){
        	var values = {};
        	
        	for (keys in this){
        		if(typeof this[keys] != 'function'){
        			if(keys.substring(0, "event".length) == "event"){
        				values[firstToLowerCase(keys.substring("event".length))] = this[keys];
        			}
        		}
        	}
        	
        	return values;
        };
        
        this.clone = function(){
            return new eventplanner.event.eventItem(this);
        }
        
        this.save = function(_params = {}){
        	this.checkValues();

			return eventplanner.event.save($.extend({event: this.getValues()}, _params));
        }
    },

    // Chargement initial des données depuis le serveur
    load: function(){
        return eventplanner.loadDataFromServer('event');
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('event', _params);
    },

    // suppression
    remove: function(_params) {
        return eventplanner.removeDataFromServer('event', _params);
    },

    // Accés aux données
    all: function(_fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = $.map(this.container, function(value, index) {
                return [value];
            });

            // Tri
            dataSelection.sort(this.compareIdDesc);

            // Si on demande les data consolidées (pour l'utilisation avec les template)
            if(_fulldata){
                dataSelection = this.getFullData(dataSelection);
            }
            
            return dataSelection;

        }else{
            return false;
        }
    },

     // Accés aux données
    byId: function(_id, _fulldata = false){
        if(this.dataReady.state() == 'resolved'){

            // Selection des données à conserver dans le container:
            if(this.container.hasOwnProperty(_id)){
                var dataSelection = this.container[_id];
            }else{
                return false;
            }            

            // Si on demande les data consolidées (pour l'utilisation avec les template)
            if(_fulldata){
                dataSelection = this.getFullData(dataSelection);
            }
            
            return dataSelection;
        }else{
            return false;
        }
    },

    getFullData: function(_data){
        return _data;
    },

    compareIdDesc: function(a,b) {
      if (a.eventId > b.eventId)
        return -1;
      if (a.eventId < b.eventId)
        return 1;
      return 0;
    }
}

eventplanner.event.byDayInterval = function(_params) {
    var paramsRequired = ['dayBefore', 'dayAfter'];
    var paramsSpecifics = {};

    try {
        eventplanner.private.checkParamsRequired(_params || {}, paramsRequired);
    } catch (e) {
        (_params.error || paramsSpecifics.error || eventplanner.private.default_params.error)(e);
        return;
    }

    var params = $.extend({}, eventplanner.private.default_params, paramsSpecifics, _params || {});

    var paramsAJAX = eventplanner.private.getParamsAJAX(params);
    paramsAJAX.url = 'core/ajax/event.ajax.php';
    paramsAJAX.data = {
        action: 'byDayInterval',
        dayBefore: _params.dayBefore,
        dayAfter: _params.dayAfter
    };
    $.ajax(paramsAJAX);
};