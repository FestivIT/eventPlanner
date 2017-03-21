eventplanner.zone = {
    dataReady: $.Deferred(),
    container: {},
    zoneItem: function(_data){ 
        for (var prop in _data) {
            if (_data.hasOwnProperty(prop)) {
                this[prop] = _data[prop];
            }
        }

        if(!this.hasOwnProperty('zoneId')){
            this.zoneId = ''; // Nouvelle zone
        }
        if(!this.hasOwnProperty('zoneEventId')){
            throw new Error("zoneEventId manquant!");
        }
        if(!this.hasOwnProperty('zoneEventLevelId')){
            throw new Error("zoneEventLevelId manquant!");
        }
        if(!this.hasOwnProperty('zoneLocalisation')){
            throw new Error("zoneLocalisation manquant!");
        }
        if(!this.hasOwnProperty('zoneInstallDate')){
            throw new Error("zoneInstallDate manquant!");
        }
        if(!this.hasOwnProperty('zoneUninstallDate')){
            throw new Error("zoneUninstallDate manquant!");
        }
        if(!this.hasOwnProperty('zoneState')){
            this.zoneState = 200;
        }
        if(!this.hasOwnProperty('zoneComment')){
            this.zoneComment = "";
        }
        
    	this.getEvent = function(_fullData = false){
            return eventplanner.event.byId(this.zoneEventId, _fullData);
        }

        this.getEventLevel = function(_fullData = false){
            return eventplanner.eventLevel.byId(this.zoneEventLevelId, _fullData);
        }
    	
    	this.getEqLogics = function(_fullData = false){
    		return eventplanner.eqLogic.byZoneId(this.zoneId, _fullData);
    	}

        this.remove = function(_params = {}){
            return eventplanner.zone.remove($.extend(_params, {id: this.zoneId}));
        }
		
        this.checkValues = function(){		
            if(this.zoneEventId == ""){
                throw new Error("La zone doit être rattaché à un événement.");
            }
			
            if(this.zoneEventLevelId == ""){
                throw new Error("La zone doit être rattachée à un niveau.");
            }
			
            if(this.zoneInstallDate == ""){
                throw new Error("Le format de la date d'installation de la zone n'est pas valide.");
            }
			
            if(this.zoneUninstallDate == ""){
                throw new Error("Le format de la date de désinstallation de la zone n'est pas valide.");
            }
			
            if(this.zoneState <= 0){
                throw new Error("L'état de la zone n'est pas valide.");
            }
			            
            return true;
        }
        
        this.getValues = function(){
            var values = {};
            
            for (keys in this){
                if(typeof this[keys] != 'function'){
                    if(keys.substring(0, "zone".length) == "zone"){
                        values[firstToLowerCase(keys.substring("zone".length))] = this[keys];
                    }
                }
            }
            
            return values;
        };
        
        this.clone = function(){
            return new eventplanner.zone.zoneItem(this);
        }
        
        this.save = function(_params = {}){
            this.checkValues();

            return eventplanner.zone.save($.extend({zone: this.getValues()}, _params));
        }
    },
    
    // Chargement initial des données depuis le serveur
    load: function(){
        return eventplanner.loadDataFromServer('zone');
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('zone', _params);
    },

    // suppression
    remove: function(_params) {
        return eventplanner.removeDataFromServer('zone', _params);
    },

    updateState: function(_params) {
        return eventplanner.updateStateToServer('zone' ,_params);
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
        //Traitement
        // faire un merge des des _data + les donnée captées par le byId...
        // NB: stocker dans les container les champs avec les préfix déjà là...
        
        // ! tester si c'est un tableau --> traiter chaque item (c'est une liste d'objet)
        // si c'est un objet: traiter le seul objet
        
        // ! pour les missions, les champs missionZones et missionUsers sont des listes d'ID
        return _data;
    },

    compareNameAsc: function(a,b) {
      if (a.zoneName.toLowerCase() < b.zoneName.toLowerCase())
        return -1;
      if (a.zoneName.toLowerCase() > b.zoneName.toLowerCase())
        return 1;
      return 0;
    }
}
