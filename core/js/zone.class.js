eventplanner.zone = {
    dataReady: $.Deferred(),
    container: {},
    zoneItem: function(){ 
    	this.getEvent = function(_fullData = false){
    		return eventplanner.event.byId(this.zoneEventId, _fullData);
    	}
    	
    	this.getEqLogics = function(_fullData = false){
    		return eventplanner.eqLogic.byZoneId(this.zoneId, _fullData);
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
      if (a.zoneName < b.zoneName)
        return -1;
      if (a.zoneName > b.zoneName)
        return 1;
      return 0;
    }
}
