eventplanner.eventLevel = {
    dataReady: $.Deferred(),
    container: {},
    eventLevelItem: function(_data){
        for (var prop in _data) {
            if (_data.hasOwnProperty(prop)) {
                this[prop] = _data[prop];
            }
        }

        if(!this.hasOwnProperty('eventLevelId')){
            this.eventLevelId = ''; // Nouveau eventLevel
        }
        if(!this.hasOwnProperty('eventLevelName')){
            this.eventLevelName = "";
        }
        if(!this.hasOwnProperty('eventLevelEventId')){
            throw "eventLevelEventId manquant!";
        }
        if(!this.hasOwnProperty('eventLevelPlanId')){
            this.eventLevelPlanId = null;
        }

        this.getEvent = function(_fullData = false){
            return eventplanner.event.byId(this.eventLevelEventId, _fullData);
        }
        this.getPlan = function(_fullData = false){
            return eventplanner.plan.byId(this.eventLevelPlanId, _fullData);
        }

        this.remove = function(_params = {}){
            return eventplanner.eventLevel.remove($.extend(_params, {id: this.eventLevelId}));
        }
        
        this.checkValues = function(){
        	if(this.eventLevelEventId == ""){
				throw new Error("Le niveau doit être rattaché à un événement.");
			}
			
			if(this.eventLevelName == ""){
				throw new Error("Le nom du niveau ne peut pas être vide.");
			}
			
		    if(this.eventLevelPlanId == ""){
				this.eventLevelPlanId = null;
			}
			
			return true;
        }
        
        this.getValues = function(){
        	var values = {};
        	
        	for (keys in this){
        		if(typeof this[keys] != 'function'){
        			if(keys.substring(0, "eventLevel".length) == "eventLevel"){
        				values[firstToLowerCase(keys.substring("eventLevel".length))] = this[keys];
        			}
        		}
        	}
        	
        	return values;
        };
        
        this.clone = function(){
            return new eventplanner.eventLevel.eventLevelItem(this);
        }
        
        this.save = function(_params = {}){
        	this.checkValues();

			return eventplanner.eventLevel.save($.extend({eventLevel: this.getValues()}, _params));
        }
    },

    // Chargement initial des données depuis le serveur
    load: function(){
    	return eventplanner.loadDataFromServer('eventLevel');
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('eventLevel', _params);
    },

    // suppression
    remove: function(_params) {
        return eventplanner.removeDataFromServer('eventLevel', _params);
    },

    // Accés aux données
    all: function(_fulldata = false){
        if(this.dataReady.state() == 'resolved'){
            // Selection des données à conserver dans le container:
            var dataSelection = $.map(this.container, function(value, index) {
                return [value];
            });

            // Tri
            dataSelection.sort(this.compareNameAsc);

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

    compareNameAsc: function(a,b) {
      if (a.eventLevelName.toLowerCase() < b.eventLevelName.toLowerCase())
        return -1;
      if (a.eventLevelName.toLowerCase() > b.eventLevelName.toLowerCase())
        return 1;
      return 0;
    }
}
