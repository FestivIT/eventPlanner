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
    },

    // Chargement initial des données depuis le serveur
    load: function(){
    	return eventplanner.loadDataFromServer('eventLevel');
    },

    // enregistrement
    save: function(_params) {
        return eventplanner.saveDataToServer('eventLevel', _params);
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
      if (a.eventLevelName < b.eventLevelName)
        return -1;
      if (a.eventLevelName > b.eventLevelName)
        return 1;
      return 0;
    }
}
